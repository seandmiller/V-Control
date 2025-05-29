// webImporter.js - Handles importing content from web pages
const WebImporter = {
    
    // Main function to import content from web
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
                html = await this.fetchWebContent(url);
                
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

            // Process styles if requested (now using CSSProcessor)
            let finalContent = content;
            if (importStyles && url !== 'demo') {
                statusEl.textContent = 'Processing webpage styles...';
                
                const styleResult = CSSProcessor.processImportedStyles(doc, url, true);
                
                if (styleResult.hasStyles) {
                    // Wrap content with scoped styles
                    finalContent = `<div class="${styleResult.scopeId}">
<style>
/* Imported styles from: ${url} */
${styleResult.styles}
</style>
${content}
</div>`;
                }
            }
            
            // Create new page with imported content
            const pageId = PageManager.createPage(title, finalContent);
            
            // Show success status
            statusEl.textContent = 'Successfully imported webpage content!';
            statusEl.className = 'import-status success';
            
            // Close modal after a short delay
            setTimeout(() => {
                document.getElementById('import-modal').classList.remove('active');
                App.showTab('edit');
                PageManager.prepareEditPage();
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

    // Fetch web content using multiple strategies
    fetchWebContent: async function(url) {
        const statusEl = document.getElementById('import-status');
        
        const proxyServices = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];
        
        // First try direct fetch
        try {
            statusEl.textContent = 'Attempting direct fetch...';
            const response = await fetch(url);
            if (response.ok) {
                return await response.text();
            }
        } catch (directError) {
            console.log('Direct fetch failed, trying proxies...');
        }
        
        // If direct fetch failed, try proxy services
        for (let i = 0; i < proxyServices.length; i++) {
            try {
                statusEl.textContent = `Trying proxy service ${i + 1}/${proxyServices.length}...`;
                const proxyUrl = proxyServices[i];
                const response = await fetch(proxyUrl);
                
                if (response.ok) {
                    if (proxyUrl.includes('allorigins.win')) {
                        const data = await response.json();
                        if (data.contents) {
                            return data.contents;
                        }
                    } else {
                        return await response.text();
                    }
                }
            } catch (proxyError) {
                console.log(`Proxy ${i + 1} failed:`, proxyError);
            }
        }
        
        return null;
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

    // Escape HTML for security
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};