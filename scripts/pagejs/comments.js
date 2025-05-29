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
        
        // Create comment button in view mode if it doesn't exist
        const commentBtn = document.getElementById('add-comment-btn');
        if (!commentBtn) {
            this.createCommentButton();
        }
    },
    
    // Create the comment sidebar
    createCommentSidebar: function() {
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.createElement('div');
        sidebar.className = 'comment-sidebar hidden';
        sidebar.innerHTML = `
            <div class="comment-sidebar-header">
                <h3 class="comment-sidebar-title">Comments</h3>
                <button class="comment-close-btn" type="button">
                    <img src="assets/icons/x-circle.svg" alt="Close" width="20" height="20">
                </button>
            </div>
            <div class="comment-sidebar-content">
                <div id="comments-list" class="comments-list">
                    <!-- Comments will be populated here -->
                </div>
            </div>
        `;
        
        mainContent.appendChild(sidebar);
        
        // Add close button event listener
        sidebar.querySelector('.comment-close-btn').addEventListener('click', () => {
            this.hideCommentSidebar();
        });
    },
    
    // Create add comment button
    createCommentButton: function() {
        const actionBar = document.querySelector('.fixed-action-bar .mobile-button-row');
        if (actionBar) {
            const commentBtn = document.createElement('button');
            commentBtn.id = 'add-comment-btn';
            commentBtn.className = 'primary-button';
            commentBtn.innerHTML = `
                <img src="assets/icons/edit.svg" alt="Comment" class="button-icon">
                Add Comment
            `;
            
            // Insert before the delete button
            const deleteBtn = document.getElementById('delete-page-btn');
            actionBar.insertBefore(commentBtn, deleteBtn);
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Add comment button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-comment-btn')) {
                this.showAddCommentForm();
            }
        });
        
        // Handle comment form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'comment-form') {
                e.preventDefault();
                this.handleCommentSubmission(e.target);
            }
        });
    },
    
    // Setup hover listeners for commented content
    setupPageHoverListeners: function() {
        if (!this.activePageId) return;
        
        const pageContent = document.getElementById('page-content');
        if (!pageContent) return;
        
        // Remove existing hover listeners
        this.removeHoverListeners();
        
        // Get comments for active page
        const pageComments = this.getCommentsByPage(this.activePageId);
        
        // Add hover listeners for elements with comments
        pageComments.forEach(comment => {
            if (comment.elementSelector) {
                const elements = pageContent.querySelectorAll(comment.elementSelector);
                elements.forEach(element => {
                    this.addCommentHoverListener(element, comment);
                });
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
        
        // Populate element selector
        this.populateElementSelector();
        
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
        
        // Show comments sidebar
        this.showCommentSidebar();
    },
    
    // Add a new comment
    addComment: function(comment) {
        this.comments.push(comment);
        this.updateCommentDisplay();
        this.setupPageHoverListeners();
    },
    
    // Update comment display
    updateCommentDisplay: function() {
        if (this.sidebarVisible) {
            this.renderComments();
        }
        this.updateCommentButton();
    },
    
    // Update comment button with count
    updateCommentButton: function() {
        const btn = document.getElementById('add-comment-btn');
        if (!btn || !this.activePageId) return;
        
        const pageComments = this.getCommentsByPage(this.activePageId);
        const count = pageComments.length;
        
        if (count > 0) {
            btn.innerHTML = `
                <img src="assets/icons/edit.svg" alt="Comment" class="button-icon">
                Comments (${count})
            `;
        } else {
            btn.innerHTML = `
                <img src="assets/icons/edit.svg" alt="Comment" class="button-icon">  
                Add Comment
            `;
        }
    },
    
    // Show comment sidebar
    showCommentSidebar: function() {
        const sidebar = document.querySelector('.comment-sidebar');
        if (sidebar) {
            sidebar.classList.remove('hidden');
            this.sidebarVisible = true;
            this.renderComments();
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
                ` : ''}
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
            this.updateCommentDisplay();
            this.setupPageHoverListeners();
        }
    },
    
    // Get comments for a specific page
    getCommentsByPage: function(pageId) {
        return this.comments.filter(comment => 
            comment.pageId === pageId && comment.status === 'active'
        );
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
        return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Clean up when page changes
    cleanup: function() {
        this.removeHoverListeners();
        this.hideCommentTooltip();
        this.hideCommentSidebar();
    }
};