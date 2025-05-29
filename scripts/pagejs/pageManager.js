// pageManager.js - Handles operations related to documentation pages
const PageManager = {
    // Reference to the page data
    pages: [],
    
    // Currently active page ID
    activePage: null,
    
    // Initialize with initial data
    init: function(initialPages) {
        this.pages = initialPages;
        if (this.pages.length > 0) {
            this.activePage = this.pages[0].id;
        }
        this.renderPageList();
        this.showActivePage();
    },
    
    // Set an active page and update the UI
    setActivePage: function(pageId) {
        this.activePage = pageId;
        
        // Update active class in page list
        document.querySelectorAll('.page-item').forEach(item => {
            if (parseInt(item.dataset.pageId) === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        this.showActivePage();
        
        // Update the page name indicator if App is available
        if (typeof App !== 'undefined' && App.updatePageNameIndicator) {
            App.updatePageNameIndicator();
        }
    },
    
    // Display the active page in the view tab
    showActivePage: function() {
        const currentPage = this.getPageById(this.activePage);
        if (!currentPage) return;
        
        // Update page title and metadata
        document.getElementById('page-title').textContent = currentPage.title;
        document.getElementById('page-meta').textContent = 
            `Last updated: ${currentPage.lastUpdated} by ${currentPage.author}`;
        
        // Update page content
        document.getElementById('page-content').innerHTML = currentPage.content;
        
        // Update edit title
        document.getElementById('edit-title').textContent = `Editing: ${currentPage.title}`;
        
        // Update the page name indicator if App is available
        if (typeof App !== 'undefined' && App.updatePageNameIndicator) {
            App.updatePageNameIndicator();
        }
    },
    
    // Delete a page by ID
    deletePage: function(pageId) {
        const pageIndex = this.pages.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return false;
        
        // Don't allow deletion of the last page
        if (this.pages.length <= 1) return false;
        
        // Remove the page
        const deletedPage = this.pages.splice(pageIndex, 1)[0];
        
        // If we deleted the active page, set a new active page
        if (this.activePage === pageId) {
            // Try to select the previous page, or the first page if we deleted the first one
            const newActiveIndex = pageIndex > 0 ? pageIndex - 1 : 0;
            this.activePage = this.pages[newActiveIndex].id;
        }
        
        // Update the UI
        this.renderPageList();
        this.showActivePage();
        
        // Clean up any related change requests
        RequestManager.deleteRequestsByPage(pageId);
        
        return true;
    },
    
    // Render the list of pages in the sidebar
    renderPageList: function() {
        const pageListElement = document.getElementById('page-list');
        pageListElement.innerHTML = '';
        
        this.pages.forEach(page => {
            const listItem = document.createElement('li');
            listItem.className = `page-item ${page.id === this.activePage ? 'active' : ''}`;
            listItem.textContent = page.title;
            listItem.dataset.pageId = page.id;
            
            listItem.addEventListener('click', () => {
                this.setActivePage(parseInt(page.id));
                App.showTab('view');
            });
            
            pageListElement.appendChild(listItem);
        });
    },
    
    // Get a page by its ID
    getPageById: function(pageId) {
        return this.pages.find(page => page.id === pageId);
    },
    
    // Get current local date in YYYY-MM-DD format
    getCurrentLocalDate: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    // Create a new page
    createPage: function(title, content) {
        const newId = this.pages.length > 0 
            ? Math.max(...this.pages.map(p => p.id)) + 1 
            : 1;
            
        const newPage = {
            id: newId,
            title: title || 'New Document',
            content: content || '<h1>New Document</h1><p>Add content here...</p>',
            lastUpdated: this.getCurrentLocalDate(),
            author: 'Current User'
        };
        
        this.pages.push(newPage);
        this.renderPageList();
        this.setActivePage(newId);
        return newId;
    },
    
    // Update a page with new content
    updatePage: function(pageId, newContent) {
        const pageIndex = this.pages.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return false;
        
        this.pages[pageIndex].content = newContent;
        this.pages[pageIndex].lastUpdated = this.getCurrentLocalDate();
        this.showActivePage();
        return true;
    },
    
    // Prepare for editing the current page
    prepareEditPage: function() {
        const currentPage = this.getPageById(this.activePage);
        if (!currentPage) return;
        
        // Initialize WYSIWYG editor if not already done
        if (!WYSIWYGEditor.isInitialized) {
            WYSIWYGEditor.init();
        }
        
        // Set content in the WYSIWYG editor
        WYSIWYGEditor.setContent(currentPage.content);
    },

    // Import content from web - now delegates to WebImporter
    importFromWeb: async function(url, customTitle, importStyles = false) {
        return await WebImporter.importFromWeb(url, customTitle, importStyles);
    }
};