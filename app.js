// app.js - Main application entry point

// Main application controller
const App = {
    // Initialize the application
    init: function() {
        // Initialize page manager with initial data
        PageManager.init(initialPages);
        
        // Initialize request manager with initial data
        RequestManager.init(initialChangeRequests);
        
        // Initialize comment manager with initial data
        CommentManager.init(initialComments);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show the view tab by default
        this.showTab('view');
        
        // Update the page name indicator and comments
        this.updatePageNameIndicator();
        this.updateCommentSystem();
        
        console.log('App initialized successfully');
    },

    // Update the page name indicator in the fixed action bar
    updatePageNameIndicator: function() {
        const currentPage = PageManager.getPageById(PageManager.activePage);
        const pageNameElement = document.getElementById('current-page-name');
        
        if (currentPage && pageNameElement) {
            pageNameElement.textContent = currentPage.title;
        }
    },

    // Update comment system for current page
    updateCommentSystem: function() {
        console.log('App: Updating comment system for page', PageManager.activePage);
        // Set active page in comment manager
        CommentManager.setActivePage(PageManager.activePage);
    },

    // Handle page deletion with confirmation
    handlePageDeletion: function() {
        const currentPage = PageManager.getPageById(PageManager.activePage);
        if (!currentPage) {
            alert('No page selected for deletion.');
            return;
        }

        // Prevent deletion if it's the last page
        if (PageManager.pages.length <= 1) {
            alert('Cannot delete the last remaining page. Create another page first.');
            return;
        }

        // Check for pending change requests
        const relatedRequests = RequestManager.getRequestsByPage(PageManager.activePage);
        const pendingRequests = relatedRequests.filter(r => r.status === 'pending');
        
        // Check for active comments
        const relatedComments = CommentManager.getCommentsByPage(PageManager.activePage);
        
        let confirmMessage = `Are you sure you want to delete "${currentPage.title}"?\n\nThis action cannot be undone.`;
        
        if (relatedRequests.length > 0) {
            confirmMessage += `\n\nThis page has ${relatedRequests.length} associated change request(s)`;
            if (pendingRequests.length > 0) {
                confirmMessage += ` (${pendingRequests.length} pending)`;
            }
            confirmMessage += ' that will also be deleted.';
        }

        if (relatedComments.length > 0) {
            confirmMessage += `\n\nThis page also has ${relatedComments.length} comment(s) that will be deleted.`;
        }

        // Confirm deletion
        if (!confirm(confirmMessage)) {
            return;
        }

        // Perform deletion
        const success = PageManager.deletePage(PageManager.activePage);
        if (success) {
            // Clean up comments for deleted page
            CommentManager.cleanup();
            
            // Show confirmation message
            let successMessage = `Page "${currentPage.title}" has been deleted successfully.`;
            if (relatedRequests.length > 0) {
                successMessage += `\n${relatedRequests.length} related change request(s) were also removed.`;
            }
            if (relatedComments.length > 0) {
                successMessage += `\n${relatedComments.length} comment(s) were also removed.`;
            }
            alert(successMessage);
            
            // Switch to view tab after deletion and update systems
            this.showTab('view');
            this.updatePageNameIndicator();
            this.updateCommentSystem();
        } else {
            alert('Failed to delete the page. Please try again.');
        }
    },
    
    // Set up event listeners for UI interactions
    setupEventListeners: function() {
        // Tab navigation
        document.getElementById('view-tab').addEventListener('click', () => this.showTab('view'));
        document.getElementById('edit-tab').addEventListener('click', () => this.showTab('edit'));
        document.getElementById('requests-tab').addEventListener('click', () => this.showTab('requests'));
        
        // Edit actions
        document.getElementById('request-changes-btn').addEventListener('click', () => {
            this.showTab('edit');
            PageManager.prepareEditPage();
        });
        
        document.getElementById('submit-changes-btn').addEventListener('click', () => {
            // Get content from WYSIWYG editor instead of textarea
            const editContent = WYSIWYGEditor.getContent();
            const currentPage = PageManager.getPageById(PageManager.activePage);
            
            if (!currentPage) {
                alert('No page selected for editing.');
                return;
            }
            
            // Only create a change request if the content has changed
            if (DiffViewer.hasChanges(currentPage.content, editContent)) {
                RequestManager.createChangeRequest(
                    PageManager.activePage,
                    currentPage.content,
                    editContent
                );
                this.showTab('requests');
               
            } else {
                alert('No changes were made to the document.');
            }
        });
        
        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            this.showTab('view');
        });
        
        // Create new page
        document.getElementById('create-page-btn').addEventListener('click', () => {
            const newTitle = prompt('Enter page title:', 'New Document');
            if (newTitle) {
                PageManager.createPage(newTitle);
                this.showTab('edit');
                PageManager.prepareEditPage();
                this.updatePageNameIndicator();
                this.updateCommentSystem();
            }
        });

        // Delete page
        document.getElementById('delete-page-btn').addEventListener('click', () => {
            this.handlePageDeletion();
        });

        // Import from web
        document.getElementById('import-web-btn').addEventListener('click', () => {
            this.showImportModal();
        });

        // Import modal events
        document.getElementById('import-confirm-btn').addEventListener('click', () => {
            this.handleWebImport();
        });

        document.getElementById('import-cancel-btn').addEventListener('click', () => {
            this.hideImportModal();
        });

        // Close modal when clicking outside
        document.getElementById('import-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('import-modal')) {
                this.hideImportModal();
            }
        });

        // Page navigation events - Update comment system when page changes
        document.addEventListener('click', (e) => {
            const pageItem = e.target.closest('.page-item');
            if (pageItem) {
                console.log('Page item clicked:', pageItem.dataset.pageId);
                // Small delay to ensure PageManager has updated first
                setTimeout(() => {
                    this.updatePageNameIndicator();
                    this.updateCommentSystem();
                }, 50);
            }
        });
    },
    
    // Switch between tabs
    showTab: function(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-content`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Special handling for tabs
        if (tabName === 'edit') {
            PageManager.prepareEditPage();
            // Clean up comments when entering edit mode
            CommentManager.cleanup();
        } else if (tabName === 'requests') {
            RequestManager.renderChangeRequests();
        } else if (tabName === 'view') {
            // Update comment system when returning to view mode
            setTimeout(() => {
                this.updateCommentSystem();
            }, 100);
        }
    },
    
    // Update the pending request count badge
    updatePendingCount: function(count) {
        const badge = document.getElementById('pending-count');
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    // Show the import modal
    showImportModal: function() {
        const modal = document.getElementById('import-modal');
        const statusEl = document.getElementById('import-status');
        
        // Reset form
        document.getElementById('import-url').value = '';
        document.getElementById('import-title').value = '';
        document.getElementById('import-styles').checked = false;
        statusEl.className = 'import-status hidden';
        
        modal.classList.add('active');
        document.getElementById('import-url').focus();
    },

    // Hide the import modal
    hideImportModal: function() {
        document.getElementById('import-modal').classList.remove('active');
    },

    // Handle web import
    handleWebImport: async function() {
        const url = document.getElementById('import-url').value.trim();
        const customTitle = document.getElementById('import-title').value.trim();
        const importStyles = document.getElementById('import-styles').checked;
        const confirmBtn = document.getElementById('import-confirm-btn');
        
        if (!url) {
            alert('Please enter a URL or type "demo" for sample content');
            return;
        }
        
        // Disable button during import
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Importing...';
        
        try {
            const finalUrl = url === 'demo' ? 'demo' : (url.startsWith('http') ? url : 'https://' + url);
            await PageManager.importFromWeb(finalUrl, customTitle, importStyles);
            
            // Update page name indicator and comment system after successful import
            this.updatePageNameIndicator();
            this.updateCommentSystem();
        } catch (error) {
            console.error('Import failed:', error);
        } finally {
            // Re-enable button
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Import';
        }
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});