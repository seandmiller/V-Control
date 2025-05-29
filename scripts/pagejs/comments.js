// comments.js - Handles page commenting functionality
const CommentManager = {
    // Reference to comment data
    comments: [],
    
    // Currently active page for filtering comments
    activePageId: null,
    
    // Comment sidebar state
    sidebarVisible: false,
    
    // Initialize with initial data
    init: function(initialComments) {
        this.comments = initialComments || [];
        this.setupEventListeners();
        this.initializeCommentUI();
    },
    
    // Set active page and update comment display
    setActivePage: function(pageId) {
        console.log('CommentManager: Setting active page to', pageId);
        this.activePageId = pageId;
        this.updateCommentDisplay();
        this.setupPageHoverListeners();
    },
    
    // Initialize comment UI elements
    initializeCommentUI: function() {
        // Create comment sidebar if it doesn't exist
        const sidebar = document.querySelector('.comment-sidebar');
        if (!sidebar) {
            this.createCommentSidebar();
        }
        
        // Create comment buttons if they don't exist
        this.createCommentButtons();
    },
    
    // Create the comment sidebar
    createCommentSidebar: function() {
        const body = document.body;
        const sidebar = document.createElement('div');
        sidebar.className = 'comment-sidebar hidden';
        sidebar.innerHTML = `
            <div class="comment-sidebar-header">
                <h3 class="comment-sidebar-title">Page Comments</h3>
                <button class="comment-close-btn" type="button" title="Close Comments">
                    <img src="assets/icons/x-circle.svg" alt="Close" width="20" height="20">
                </button>
            </div>
            <div class="comment-sidebar-content">
                <div class="comment-sidebar-actions">
                    <button id="add-comment-sidebar-btn" class="primary-button" style="width: 100%; margin-bottom: 1rem;">
                        <img src="assets/icons/plus-circle.svg" alt="Add" class="button-icon">
                        Add New Comment
                    </button>
                </div>
                <div id="comments-list" class="comments-list">
                    <!-- Comments will be populated here -->
                </div>
            </div>
        `;
        
        body.appendChild(sidebar);
        
        // Add close button event listener
        sidebar.querySelector('.comment-close-btn').addEventListener('click', () => {
            this.hideCommentSidebar();
        });
        
        // Add comment button in sidebar
        sidebar.querySelector('#add-comment-sidebar-btn').addEventListener('click', () => {
            this.showAddCommentForm();
        });
    },
    
    // Create comment buttons in the action bar
    createCommentButtons: function() {
        const actionBar = document.querySelector('.fixed-action-bar .mobile-button-row');
        if (actionBar) {
            // Remove existing comment buttons first
            const existingBtns = actionBar.querySelectorAll('#add-comment-btn, #view-comments-btn');
            existingBtns.forEach(btn => btn.remove());
            
            // Create view comments button
            const viewCommentsBtn = document.createElement('button');
            viewCommentsBtn.id = 'view-comments-btn';
            viewCommentsBtn.className = 'primary-button';
            viewCommentsBtn.innerHTML = `
                <img src="assets/icons/edit.svg" alt="Comments" class="button-icon">
                <span id="comments-btn-text">Comments</span>
            `;
            
            // Insert before the delete button
            const deleteBtn = document.getElementById('delete-page-btn');
            actionBar.insertBefore(viewCommentsBtn, deleteBtn);
            
            // Add event listener
            viewCommentsBtn.addEventListener('click', () => {
                this.toggleCommentSidebar();
            });
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Handle comment form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'comment-form') {
                e.preventDefault();
                this.handleCommentSubmission(e.target);
            }
        });
    },
    
    // Toggle comment sidebar visibility
    toggleCommentSidebar: function() {
        if (this.sidebarVisible) {
            this.hideCommentSidebar();
        } else {
            this.showCommentSidebar();
        }
    },
    
    // Setup hover listeners for commented content
    setupPageHoverListeners: function() {
        if (!this.activePageId) return;
        
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;
        
        // Remove existing hover listeners
        this.removeHoverListeners();
        
        // Get comments for active page only
        const pageComments = this.getCommentsByPage(this.activePageId);
        console.log('Setting up hover listeners for', pageComments.length, 'comments on page', this.activePageId);
        
        // Add hover listeners for elements with comments
        pageComments.forEach(comment => {
            if (comment.elementSelector) {
                try {
                    const elements = pageContent.querySelectorAll(comment.elementSelector);
                    elements.forEach(element => {
                        this.addCommentHoverListener(element, comment);
                    });
                } catch (e) {
                    console.warn('Invalid selector for comment:', comment.elementSelector);
                }
            }
        });
    },
    
    // Add hover listener to specific element
    addCommentHoverListener: function(element, comment) {
        element.classList.add('has-comment');
        
        const showTooltip = (e) => {
            this.showCommentTooltip(e, comment);
        };
        
        const hideTooltip = () => {
            this.hideCommentTooltip();
        };
        
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        
        // Store listeners for cleanup
        element._commentListeners = { showTooltip, hideTooltip };
    },
    
    // Remove all hover listeners
    removeHoverListeners: function() {
        const elementsWithComments = document.querySelectorAll('.has-comment');
        elementsWithComments.forEach(element => {
            if (element._commentListeners) {
                element.removeEventListener('mouseenter', element._commentListeners.showTooltip);
                element.removeEventListener('mouseleave', element._commentListeners.hideTooltip);
                delete element._commentListeners;
            }
            element.classList.remove('has-comment');
        });
    },
    
    // Show comment tooltip on hover
    showCommentTooltip: function(event, comment) {
        // Remove existing tooltip
        this.hideCommentTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'comment-tooltip';
        tooltip.innerHTML = `
            <div class="comment-tooltip-header">
                <strong>${comment.author}</strong>
                <span class="comment-date">${comment.timestamp}</span>
            </div>
            <div class="comment-tooltip-content">${comment.content}</div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
        
        // Store reference for cleanup
        this._activeTooltip = tooltip;
    },
    
    // Hide comment tooltip
    hideCommentTooltip: function() {
        if (this._activeTooltip) {
            this._activeTooltip.remove();
            this._activeTooltip = null;
        }
    },
    
    // Show add comment form
    showAddCommentForm: function() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('comment-modal');
        if (!modal) {
            modal = this.createCommentModal();
        }
        
        // Reset form
        const form = modal.querySelector('#comment-form');
        form.reset();
        
        // Populate element selector for current page
        this.populateElementSelector();
        
        // Show modal
        modal.classList.add('active');
        
        // Focus on textarea
        const textarea = modal.querySelector('#comment-content');
        setTimeout(() => textarea.focus(), 100);
    },
    
    // Create comment modal
    createCommentModal: function() {
        const modal = document.createElement('div');
        modal.id = 'comment-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">Add Comment</h2>
                <form id="comment-form">
                    <div class="form-group">
                        <label for="comment-content" class="form-label">Comment:</label>
                        <textarea id="comment-content" class="form-input" rows="4" 
                                placeholder="Enter your comment..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="comment-element" class="form-label">Link to specific element (optional):</label>
                        <select id="comment-element" class="form-input">
                            <option value="">General page comment</option>
                        </select>
                        <small class="form-hint">Select a heading or paragraph to link your comment to specific content</small>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="primary-button">Add Comment</button>
                        <button type="button" class="secondary-button" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        return modal;
    },
    
    // Populate the element selector dropdown
    populateElementSelector: function() {
        const select = document.getElementById('comment-element');
        if (!select) return;
        
        // Clear existing options (except first one)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // Get page content elements
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;
        
        const elements = pageContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, blockquote');
        elements.forEach((element, index) => {
            const text = element.textContent.trim().substring(0, 50);
            if (text) {
                const option = document.createElement('option');
                option.value = `${element.tagName.toLowerCase()}:nth-of-type(${this.getNthOfType(element)})`;
                option.textContent = `${element.tagName} - ${text}${text.length >= 50 ? '...' : ''}`;
                select.appendChild(option);
            }
        });
    },
    
    // Get nth-of-type index for element
    getNthOfType: function(element) {
        const siblings = Array.from(element.parentElement.children).filter(
            child => child.tagName === element.tagName
        );
        return siblings.indexOf(element) + 1;
    },
    
    // Handle comment form submission
    handleCommentSubmission: function(form) {
        const content = form.querySelector('#comment-content').value.trim();
        const elementSelector = form.querySelector('#comment-element').value;
        
        if (!content) return;
        
        // Create new comment
        const newComment = {
            id: this.generateCommentId(),
            pageId: this.activePageId,
            content: content,
            author: 'Current User',
            timestamp: this.getCurrentDateTime(),
            elementSelector: elementSelector || null,
            status: 'active'
        };
        
        // Add comment
        this.addComment(newComment);
        
        // Close modal
        document.getElementById('comment-modal').classList.remove('active');
        
        // Show comments sidebar if not already visible
        if (!this.sidebarVisible) {
            this.showCommentSidebar();
        }
    },
    
    // Add a new comment
    addComment: function(comment) {
        this.comments.push(comment);
        console.log('Added comment to page', comment.pageId, ':', comment.content);
        this.updateCommentDisplay();
        this.setupPageHoverListeners();
    },
    
    // Update comment display
    updateCommentDisplay: function() {
        this.updateCommentButton();
        if (this.sidebarVisible) {
            this.renderComments();
        }
    },
    
    // Update comment button with count
    updateCommentButton: function() {
        const btn = document.getElementById('view-comments-btn');
        const btnText = document.getElementById('comments-btn-text');
        if (!btn || !btnText || !this.activePageId) return;
        
        const pageComments = this.getCommentsByPage(this.activePageId);
        const count = pageComments.length;
        
        console.log('Updating comment button for page', this.activePageId, '- found', count, 'comments');
        
        if (count > 0) {
            btnText.textContent = `Comments (${count})`;
            btn.style.backgroundColor = 'var(--primary-color)';
        } else {
            btnText.textContent = 'Comments';
            btn.style.backgroundColor = 'var(--primary-color)';
        }
    },
    
    // Show comment sidebar
    showCommentSidebar: function() {
        const sidebar = document.querySelector('.comment-sidebar');
        if (sidebar) {
            sidebar.classList.remove('hidden');
            this.sidebarVisible = true;
            this.renderComments();
            console.log('Showing comment sidebar for page', this.activePageId);
        }
    },
    
    // Hide comment sidebar
    hideCommentSidebar: function() {
        const sidebar = document.querySelector('.comment-sidebar');
        if (sidebar) {
            sidebar.classList.add('hidden');
            this.sidebarVisible = false;
        }
    },
    
    // Render comments in sidebar
    renderComments: function() {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList || !this.activePageId) return;
        
        const pageComments = this.getCommentsByPage(this.activePageId);
        console.log('Rendering', pageComments.length, 'comments for page', this.activePageId);
        
        if (pageComments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments on this page yet.</p>';
            return;
        }
        
        // Sort comments by timestamp (newest first)
        const sortedComments = [...pageComments].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        commentsList.innerHTML = sortedComments.map(comment => `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <strong class="comment-author">${comment.author}</strong>
                    <span class="comment-date">${comment.timestamp}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                ${comment.elementSelector ? `
                    <div class="comment-location">
                        <small>📍 Linked to: ${this.getElementDescription(comment.elementSelector)}</small>
                    </div>
                ` : `
                    <div class="comment-location">
                        <small>💬 General page comment</small>
                    </div>
                `}
                <div class="comment-actions">
                    <button class="comment-resolve-btn" onclick="CommentManager.resolveComment(${comment.id})">
                        Resolve
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // Get description of linked element
    getElementDescription: function(selector) {
        try {
            const pageContent = document.getElementById('page-content');
            const element = pageContent?.querySelector(selector);
            if (element) {
                const text = element.textContent.trim().substring(0, 30);
                return `${element.tagName} - ${text}${text.length >= 30 ? '...' : ''}`;
            }
        } catch (e) {
            // Ignore selector errors
        }
        return selector;
    },
    
    // Resolve a comment
    resolveComment: function(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.status = 'resolved';
            console.log('Resolved comment', commentId);
            this.updateCommentDisplay();
            this.setupPageHoverListeners();
        }
    },
    
    // Get comments for a specific page (only active comments)
    getCommentsByPage: function(pageId) {
        const filtered = this.comments.filter(comment => 
            comment.pageId === pageId && comment.status === 'active'
        );
        console.log('getCommentsByPage for page', pageId, ':', filtered.length, 'comments found');
        return filtered;
    },
    
    // Generate unique comment ID
    generateCommentId: function() {
        return this.comments.length > 0 
            ? Math.max(...this.comments.map(c => c.id)) + 1 
            : 1;
    },
    
    // Get current date and time
    getCurrentDateTime: function() {
        const now = new Date();
        return now.toLocaleDateString() + ', ' + now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Clean up when page changes
    cleanup: function() {
        this.removeHoverListeners();
        this.hideCommentTooltip();
        // Don't auto-hide sidebar when cleaning up - let user control it
    }
};