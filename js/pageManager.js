// Page Manager - Handles operations related to documentation pages
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
    
    // Extract styles from the parsed HTML document
    extractStyles: function(doc, baseUrl) {
        let styles = '';
        
        // Extract inline styles from <style> tags
        const styleTags = doc.querySelectorAll('style');
        styleTags.forEach(styleTag => {
            if (styleTag.textContent) {
                styles += styleTag.textContent + '\n';
            }
        });
        
        // Extract external stylesheet references (commented out due to CORS)
        // const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
        // Note: External stylesheets would require additional CORS-enabled fetching
        
        // Extract common inline styles from key elements (more selective)
        const contentElements = doc.querySelectorAll('article [style], main [style], .content [style], #content [style]');
        const inlineStyles = new Set();
        
        contentElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            const inlineStyle = element.getAttribute('style');
            if (inlineStyle && this.isSafeStyle(inlineStyle)) {
                // Create more specific selectors to avoid conflicts
                const classes = element.className ? '.' + element.className.split(' ').join('.') : '';
                const selector = tagName + classes;
                const cssRule = `${selector} { ${inlineStyle} }`;
                inlineStyles.add(cssRule);
            }
        });
        
        // Add collected inline styles
        if (inlineStyles.size > 0) {
            styles += '\n/* Converted inline styles */\n';
            styles += Array.from(inlineStyles).join('\n') + '\n';
        }
        
        // Clean up problematic styles
        styles = this.sanitizeStyles(styles);
        
        // Add some basic typography and layout styles
        styles += `\n/* Basic imported content styles */
h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em 0; line-height: 1.2; }
p { margin: 0.5em 0; }
ul, ol { margin: 0.5em 0; padding-left: 2em; }
blockquote { margin: 1em 0; padding: 0.5em 1em; border-left: 3px solid #ccc; background: #f9f9f9; }
code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
pre { background: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; }
img { max-width: 100%; height: auto; }
`;
        
        return styles.trim();
    },
    
    // Check if a style is safe to import
    isSafeStyle: function(styleText) {
        const unsafe = [
            'position: fixed',
            'position: absolute',
            'z-index',
            'transform',
            'animation',
            'transition',
            '@import',
            'javascript:',
            'expression(',
            'behavior:'
        ];
        
        const lowerStyle = styleText.toLowerCase();
        return !unsafe.some(unsafePattern => lowerStyle.includes(unsafePattern));
    },
    
    // Sanitize CSS to remove problematic rules
    sanitizeStyles: function(css) {
        const lines = css.split('\n');
        const safeLines = [];
        
        for (let line of lines) {
            const trimmedLine = line.trim().toLowerCase();
            
            // Skip problematic CSS rules
            if (
                trimmedLine.includes('position: fixed') ||
                trimmedLine.includes('position: absolute') ||
                trimmedLine.includes('z-index') ||
                trimmedLine.includes('transform:') ||
                trimmedLine.includes('animation:') ||
                trimmedLine.includes('@import') ||
                trimmedLine.includes('javascript:') ||
                trimmedLine.includes('expression(') ||
                trimmedLine.includes('behavior:') ||
                trimmedLine.includes('overflow: hidden') ||
                (trimmedLine.includes('width:') && trimmedLine.includes('100vw')) ||
                (trimmedLine.includes('height:') && trimmedLine.includes('100vh'))
            ) {
                // Skip this line
                continue;
            }
            
            safeLines.push(line);
        }
        
        return safeLines.join('\n');
    },
    
    // Scope CSS styles to a specific container
    scopeStyles: function(css, scopeSelector) {
        // Improved CSS scoping with better selector detection
        const lines = css.split('\n');
        const scopedLines = [];
        let inMediaQuery = false;
        let braceDepth = 0;
        let currentRule = '';
        
        for (let line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.endsWith('*/')) {
                scopedLines.push(line);
                continue;
            }
            
            // Track media queries and other at-rules
            if (trimmedLine.startsWith('@')) {
                scopedLines.push(line);
                if (trimmedLine.includes('{')) {
                    inMediaQuery = true;
                    braceDepth++;
                }
                continue;
            }
            
            // Track brace depth
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;
            braceDepth += openBraces - closeBraces;
            
            // If we're closing a media query
            if (inMediaQuery && braceDepth === 0) {
                inMediaQuery = false;
                scopedLines.push(line);
                continue;
            }
            
            // Handle CSS rules more robustly
            if (trimmedLine.includes('{')) {
                // This line contains a CSS rule opening
                const parts = line.split('{');
                const selector = parts[0].trim();
                const rest = parts.slice(1).join('{');
                
                if (selector && !selector.startsWith('@') && !selector.includes(scopeSelector)) {
                    // Split multiple selectors and scope each one
                    const selectors = selector.split(',').map(s => s.trim());
                    const scopedSelectors = selectors.map(sel => {
                        // Don't scope if it's already scoped, a pseudo-selector, or keyframe
                        if (sel.includes(scopeSelector) || sel.startsWith(':') || sel.startsWith('@')) {
                            return sel;
                        }
                        return `${scopeSelector} ${sel}`;
                    });
                    
                    scopedLines.push(line.replace(selector, scopedSelectors.join(', ')));
                } else {
                    scopedLines.push(line);
                }
            } else {
                // This is a property line or continuation
                scopedLines.push(line);
            }
        }
        
        return scopedLines.join('\n');
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
    },
    
    // Get a page by its ID
    getPageById: function(pageId) {
        return this.pages.find(page => page.id === pageId);
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
            lastUpdated: new Date().toISOString().split('T')[0],
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
        this.pages[pageIndex].lastUpdated = new Date().toISOString().split('T')[0];
        this.showActivePage();
        return true;
    },
    
    // Prepare for editing the current page
    prepareEditPage: function() {
        const currentPage = this.getPageById(this.activePage);
        if (!currentPage) return;
        
        document.getElementById('edit-textarea').value = currentPage.content;
    },

    // Import content from web
    importFromWeb: async function(url, customTitle, importStyles = false) {
        try {
            const statusEl = document.getElementById('import-status');
            statusEl.textContent = 'Fetching webpage content...';
            statusEl.className = 'import-status loading';
            
            let html = null;
            
            // Handle demo content
            if (url === 'demo') {
                html = this.getDemoContent();
            } else {
                // Try multiple methods to fetch content
                const proxyServices = [
                    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                    `https://corsproxy.io/?${encodeURIComponent(url)}`
                ];
                
                // First try direct fetch
                try {
                    statusEl.textContent = 'Attempting direct fetch...';
                    const response = await fetch(url);
                    if (response.ok) {
                        html = await response.text();
                    }
                } catch (directError) {
                    console.log('Direct fetch failed, trying proxies...');
                }
                
                // If direct fetch failed, try proxy services
                if (!html) {
                    for (let i = 0; i < proxyServices.length && !html; i++) {
                        try {
                            statusEl.textContent = `Trying proxy service ${i + 1}/${proxyServices.length}...`;
                            const proxyUrl = proxyServices[i];
                            const response = await fetch(proxyUrl);
                            
                            if (response.ok) {
                                if (proxyUrl.includes('allorigins.win')) {
                                    const data = await response.json();
                                    if (data.contents) {
                                        html = data.contents;
                                    }
                                } else {
                                    html = await response.text();
                                }
                            }
                        } catch (proxyError) {
                            console.log(`Proxy ${i + 1} failed:`, proxyError);
                        }
                    }
                }
                
                if (!html) {
                    throw new Error('Unable to fetch content due to CORS restrictions. Try using "demo" as the URL for sample content.');
                }
            }
            
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract title
            let title = customTitle || doc.querySelector('title')?.textContent || 'Imported Web Content';
            title = title.substring(0, 100).trim();
            
            // Extract and clean content
            const content = this.extractMainContent(doc);
            
            if (!content.trim()) {
                throw new Error('No readable content found on the webpage');
            }

            // Extract styles if requested
            let finalContent = content;
            if (importStyles && url !== 'demo') {
                statusEl.textContent = 'Extracting webpage styles...';
                const extractedStyles = this.extractStyles(doc, url);
                if (extractedStyles) {
                    // Wrap content with scoped styles
                    const scopeId = 'imported-content-' + Date.now();
                    finalContent = `<div class="${scopeId}">
<style>
/* Imported styles from: ${url} */
${this.scopeStyles(extractedStyles, '.' + scopeId)}
</style>
${content}
</div>`;
                }
            }
            
            // Create new page with imported content
            const pageId = this.createPage(title, finalContent);
            
            // Show success status
            statusEl.textContent = 'Successfully imported webpage content!';
            statusEl.className = 'import-status success';
            
            // Close modal after a short delay
            setTimeout(() => {
                document.getElementById('import-modal').classList.remove('active');
                App.showTab('edit');
                this.prepareEditPage();
            }, 1500);
            
            return pageId;
            
        } catch (error) {
            console.error('Import error:', error);
            
            // Show error status with helpful message
            const statusEl = document.getElementById('import-status');
            statusEl.textContent = `Import failed: ${error.message}`;
            statusEl.className = 'import-status error';
            
            throw error;
        }
    },
    
    // Get demo content for testing
    getDemoContent: function() {
        return `<html>
        <head>
            <title>Demo Article: Machine Learning Basics</title>
            <style>
                .demo-header { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }
                .demo-highlight { background-color: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 4px; }
                .demo-algorithm-list { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #0ea5e9; }
                .demo-quote { font-style: italic; color: #374151; background: #f9fafb; padding: 1rem; border-left: 4px solid #d1d5db; margin: 1rem 0; }
            </style>
        </head>
        <body>
        <article>
            <h1 class="demo-header">Machine Learning Basics</h1>
            <p>Machine learning is a subset of <span class="demo-highlight">artificial intelligence</span> that focuses on algorithms that can learn and make decisions from data.</p>
            
            <h2 class="demo-header">Types of Machine Learning</h2>
            <p>There are three main types of machine learning:</p>
            <ul>
                <li><strong>Supervised Learning</strong> - Learning with labeled examples</li>
                <li><strong>Unsupervised Learning</strong> - Finding patterns in unlabeled data</li>
                <li><strong>Reinforcement Learning</strong> - Learning through interaction and feedback</li>
            </ul>
            
            <h2 class="demo-header">Common Algorithms</h2>
            <div class="demo-algorithm-list">
                <p>Some popular machine learning algorithms include:</p>
                <ul>
                    <li>Linear Regression</li>
                    <li>Decision Trees</li>
                    <li>Neural Networks</li>
                    <li>Support Vector Machines</li>
                </ul>
            </div>
            
            <h2 class="demo-header">Applications</h2>
            <p>Machine learning is used in many areas including <span class="demo-highlight">image recognition</span>, natural language processing, recommendation systems, and autonomous vehicles.</p>
            
            <blockquote class="demo-quote">
                "Machine learning is the science of getting computers to learn without being explicitly programmed." - Arthur Samuel
            </blockquote>
        </article>
        </body>
        </html>`;
    },
    
    // Extract main content from parsed HTML document
    extractMainContent: function(doc) {
        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style, nav, header, footer, aside, .navigation, .sidebar, .ads, .advertisement');
        scripts.forEach(el => el.remove());
        
        // Try to find main content area
        let contentEl = doc.querySelector('main, article, .content, .post, .entry, #content, #main') 
                     || doc.querySelector('body');
        
        if (!contentEl) {
            contentEl = doc.body || doc.documentElement;
        }
        
        // Extract structured content
        let html = '';
        const elements = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, code');
        
        if (elements.length === 0) {
            // Fallback: get all text content and structure it
            const textContent = contentEl.textContent || contentEl.innerText || '';
            const lines = textContent.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0 && line.length < 500);
            
            if (lines.length > 0) {
                html = lines.map(line => `<p>${this.escapeHtml(line)}</p>`).join('\n');
            }
        } else {
            // Process found elements
            elements.forEach(el => {
                const tagName = el.tagName.toLowerCase();
                const text = el.textContent?.trim();
                
                if (text && text.length > 0 && text.length < 1000) {
                    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
                        html += `<${tagName}>${this.escapeHtml(text)}</${tagName}>\n`;
                    } else if (tagName === 'p') {
                        html += `<p>${this.escapeHtml(text)}</p>\n`;
                    } else if (['ul', 'ol'].includes(tagName)) {
                        const listItems = el.querySelectorAll('li');
                        if (listItems.length > 0) {
                            html += `<${tagName}>\n`;
                            listItems.forEach(li => {
                                const liText = li.textContent?.trim();
                                if (liText && liText.length < 300) {
                                    html += `<li>${this.escapeHtml(liText)}</li>\n`;
                                }
                            });
                            html += `</${tagName}>\n`;
                        }
                    } else if (tagName === 'blockquote') {
                        html += `<blockquote>${this.escapeHtml(text)}</blockquote>\n`;
                    } else if (['pre', 'code'].includes(tagName)) {
                        html += `<pre><code>${this.escapeHtml(text)}</code></pre>\n`;
                    }
                }
            });
        }
        
        return html || '<p>No content could be extracted from this webpage.</p>';
    },
    
    // Escape HTML for security
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};