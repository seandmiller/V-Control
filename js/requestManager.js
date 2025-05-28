// Request Manager - Handles change requests and approval workflow
const RequestManager = {
    // Reference to the change request data
    changeRequests: [],
    
    // Get current local date in YYYY-MM-DD format
    getCurrentLocalDate: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    // Initialize with initial data
    init: function(initialRequests) {
        this.changeRequests = initialRequests;
        this.renderChangeRequests();
        this.updatePendingCount();
    },
    
    // Render the list of change requests in the requests tab
    renderChangeRequests: function() {
        const requestsListElement = document.getElementById('requests-list');
        requestsListElement.innerHTML = '';
        
        if (this.changeRequests.length === 0) {
            requestsListElement.innerHTML = '<p>No change requests found.</p>';
            return;
        }
        
        // Sort requests by date (newest first)
        const sortedRequests = [...this.changeRequests].sort((a, b) => {
            return new Date(b.requestDate) - new Date(a.requestDate);
        });
        
        sortedRequests.forEach(request => {
            const requestPage = PageManager.getPageById(request.pageId);
            if (!requestPage) return;
            
            const requestElement = document.createElement('div');
            requestElement.className = 'request-card';
            
            // Request header with status styling
            const headerClass = request.status === 'pending' ? 'request-header-pending' : 
                               request.status === 'approved' ? 'request-header-approved' : 
                               'request-header-rejected';
            
            // Status badge with icon
            let statusIcon, statusClass;
            if (request.status === 'pending') {
                statusIcon = 'alert-circle.svg';
                statusClass = 'request-status-pending';
            } else if (request.status === 'approved') {
                statusIcon = 'check.svg';
                statusClass = 'request-status-approved';
            } else {
                statusIcon = 'x-circle.svg';
                statusClass = 'request-status-rejected';
            }
            
            requestElement.innerHTML = `
                <div class="request-header ${headerClass}">
                    <div class="request-info">
                        <h3>${requestPage.title}</h3>
                        <p>Requested by: ${request.requester} on ${request.requestDate}</p>
                    </div>
                    <div class="request-status ${statusClass}">
                        <img src="assets/icons/${statusIcon}" alt="${request.status}" class="request-status-icon">
                        ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                </div>
                <div class="request-body">
                    <button class="diff-toggle" data-request-id="${request.id}">
                        Show changes
                    </button>
                    <div id="diff-content-${request.id}" class="diff-content-container" style="display: none;">
                        Loading...
                    </div>
                    <div id="diff-placeholder-${request.id}" class="diff-placeholder">
                        Click "Show changes" to see the proposed modifications
                    </div>
                    ${request.status === 'pending' ? `
                        <div class="request-actions">
                            <button class="approve-button" data-request-id="${request.id}">
                                <img src="assets/icons/check.svg" alt="Approve" class="button-icon">
                                Approve
                            </button>
                            <button class="reject-button" data-request-id="${request.id}">
                                <img src="assets/icons/x-circle.svg" alt="Reject" class="button-icon">
                                Reject
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            requestsListElement.appendChild(requestElement);
            
            // Add event listeners to the toggle button
            const toggleButton = requestElement.querySelector(`.diff-toggle[data-request-id="${request.id}"]`);
            toggleButton.addEventListener('click', () => {
                const diffContent = document.getElementById(`diff-content-${request.id}`);
                const diffPlaceholder = document.getElementById(`diff-placeholder-${request.id}`);
                
                if (diffContent.style.display === 'none') {
                    // Show diff content
                    diffContent.innerHTML = DiffViewer.generateDiffHtml(
                        request.originalContent,
                        request.proposedContent
                    );
                    diffContent.style.display = 'block';
                    diffPlaceholder.style.display = 'none';
                    toggleButton.textContent = 'Hide changes';
                } else {
                    // Hide diff content
                    diffContent.style.display = 'none';
                    diffPlaceholder.style.display = 'block';
                    toggleButton.textContent = 'Show changes';
                }
            });
            
            // Add event listeners for action buttons if present
            if (request.status === 'pending') {
                const approveButton = requestElement.querySelector(`.approve-button[data-request-id="${request.id}"]`);
                approveButton.addEventListener('click', () => {
                    this.approveRequest(request.id);
                });
                
                const rejectButton = requestElement.querySelector(`.reject-button[data-request-id="${request.id}"]`);
                rejectButton.addEventListener('click', () => {
                    this.rejectRequest(request.id);
                });
            }
        });
    },
    
    // Create a new change request
    createChangeRequest: function(pageId, originalContent, proposedContent) {
        const newId = this.changeRequests.length > 0 
            ? Math.max(...this.changeRequests.map(r => r.id)) + 1 
            : 1;
            
        const newRequest = {
            id: newId,
            pageId: pageId,
            originalContent: originalContent,
            proposedContent: proposedContent,
            requestDate: this.getCurrentLocalDate(),
            requester: 'Current User',
            status: 'pending'
        };
        
        this.changeRequests.push(newRequest);
        this.renderChangeRequests();
        this.updatePendingCount();
        return newId;
    },
    
    // Approve a change request
    approveRequest: function(requestId) {
        const request = this.changeRequests.find(r => r.id === requestId);
        if (!request) return false;
        
        // Update the page with the proposed content
        PageManager.updatePage(request.pageId, request.proposedContent);
        
        // Update the request status
        request.status = 'approved';
        this.renderChangeRequests();
        this.updatePendingCount();
        return true;
    },
    
    // Reject a change request
    rejectRequest: function(requestId) {
        const request = this.changeRequests.find(r => r.id === requestId);
        if (!request) return false;
        
        // Update the request status
        request.status = 'rejected';
        this.renderChangeRequests();
        this.updatePendingCount();
        return true;
    },
    
    // Delete all requests for a specific page (used when page is deleted)
    deleteRequestsByPage: function(pageId) {
        const initialLength = this.changeRequests.length;
        this.changeRequests = this.changeRequests.filter(request => request.pageId !== pageId);
        
        // If any requests were removed, update the UI
        if (this.changeRequests.length !== initialLength) {
            this.renderChangeRequests();
            this.updatePendingCount();
        }
        
        return initialLength - this.changeRequests.length; // Return number of deleted requests
    },
    
    // Update the pending request count badge
    updatePendingCount: function() {
        const pendingCount = this.changeRequests.filter(r => r.status === 'pending').length;
        App.updatePendingCount(pendingCount);
    },
    
    // Get all requests for a specific page
    getRequestsByPage: function(pageId) {
        return this.changeRequests.filter(request => request.pageId === pageId);
    }
};