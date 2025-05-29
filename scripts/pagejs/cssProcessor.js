// cssProcessor.js - Handles CSS extraction, sanitization, and scoping from foreign websites
const CSSProcessor = {
    
    // Extract styles from parsed HTML document
    extractStyles: function(doc, baseUrl) {
        let styles = '';
        
        // Extract inline styles from <style> tags
        const styleTags = doc.querySelectorAll('style');
        styleTags.forEach(styleTag => {
            if (styleTag.textContent) {
                styles += styleTag.textContent + '\n';
            }
        });
        
        // Extract common inline styles from key elements (more selective)
        const contentElements = doc.querySelectorAll('article [style], main [style], .content [style], #content [style]');
        const inlineStyles = new Set();
        
        contentElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            const inlineStyle = element.getAttribute('style');
            if (inlineStyle && this.isSafeStyle(inlineStyle)) {
                // Create more specific selectors to avoid conflicts
                const firstClass = element.className ? element.className.split(' ')[0].trim() : '';
                const selector = firstClass ? `${tagName}.${firstClass}` : tagName;
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
        
        // Add baseline typography styles for imported content
        styles += this.getBaselineStyles();
        
        return styles.trim();
    },

    // Check if a CSS style declaration is safe to import
    isSafeStyle: function(styleText) {
        const unsafePatterns = [
            'position: fixed',
            'position: absolute', 
            'z-index',
            'transform',
            'animation',
            'transition',
            '@import',
            'javascript:',
            'expression(',
            'behavior:',
            'binding:',
            'url(',
            '-moz-binding',
            '-webkit-binding'
        ];
        
        const lowerStyle = styleText.toLowerCase();
        return !unsafePatterns.some(pattern => lowerStyle.includes(pattern));
    },

    // Sanitize CSS to remove problematic and dangerous rules
    sanitizeStyles: function(css) {
        const lines = css.split('\n');
        const safeLines = [];
        
        for (let line of lines) {
            const trimmedLine = line.trim().toLowerCase();
            
            // Skip empty lines and comments (keep them for readability)
            if (!trimmedLine || trimmedLine.startsWith('/*')) {
                safeLines.push(line);
                continue;
            }
            
            // Remove dangerous CSS patterns
            if (this.isDangerousCSS(trimmedLine)) {
                // Replace with a comment explaining what was removed
                safeLines.push(`/* Removed potentially unsafe CSS: ${line.trim().substring(0, 50)}... */`);
                continue;
            }
            
            safeLines.push(line);
        }
        
        return safeLines.join('\n');
    },

    // Check if a CSS line contains dangerous patterns
    isDangerousCSS: function(trimmedLine) {
        const dangerousPatterns = [
            'position: fixed',
            'position: absolute',
            'z-index:',
            'transform:',
            'animation:',
            'transition:',
            '@import',
            'javascript:',
            'expression(',
            'behavior:',
            'binding:',
            'overflow: hidden',
            'width: 100vw',
            'height: 100vh',
            'width:100vw',  // No space variant
            'height:100vh', // No space variant
            'margin: -',    // Negative margins can break layouts
            'margin:-',     // No space variant
            'top: -',       // Negative positioning
            'left: -',
            'right: -',
            'bottom: -'
        ];
        
        return dangerousPatterns.some(pattern => trimmedLine.includes(pattern));
    },

    // Scope CSS styles to a specific container to prevent global conflicts
    scopeStyles: function(css, scopeSelector) {
        const lines = css.split('\n');
        const scopedLines = [];
        let inMediaQuery = false;
        let braceDepth = 0;
        
        for (let line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.endsWith('*/')) {
                scopedLines.push(line);
                continue;
            }
            
            // Handle media queries and other at-rules
            if (trimmedLine.startsWith('@')) {
                scopedLines.push(line);
                if (trimmedLine.includes('{')) {
                    inMediaQuery = true;
                    braceDepth++;
                }
                continue;
            }
            
            // Track brace depth for nested rules
            const openBraces = (line.match(/{/g) || []).length;
            const closeBraces = (line.match(/}/g) || []).length;
            braceDepth += openBraces - closeBraces;
            
            // Handle closing of media queries
            if (inMediaQuery && braceDepth === 0) {
                inMediaQuery = false;
                scopedLines.push(line);
                continue;
            }
            
            // Process CSS selector lines
            if (trimmedLine.includes('{')) {
                const parts = line.split('{');
                const selector = parts[0].trim();
                const rest = parts.slice(1).join('{');
                
                if (selector && !selector.startsWith('@') && !selector.includes(scopeSelector)) {
                    // Handle multiple selectors (comma-separated)
                    const selectors = selector.split(',').map(s => s.trim());
                    const scopedSelectors = selectors.map(sel => {
                        // Don't scope certain selectors
                        if (sel.includes(scopeSelector) || 
                            sel.startsWith(':') || 
                            sel.startsWith('@') ||
                            sel === 'html' || 
                            sel === 'body') {
                            return sel;
                        }
                        return `${scopeSelector} ${sel}`;
                    });
                    
                    const scopedLine = line.replace(selector, scopedSelectors.join(', '));
                    scopedLines.push(scopedLine);
                } else {
                    scopedLines.push(line);
                }
            } else {
                // Property lines or continuation
                scopedLines.push(line);
            }
        }
        
        return scopedLines.join('\n');
    },

    // Get baseline typography styles for imported content
    getBaselineStyles: function() {
        return `
/* Baseline styles for imported content */
h1, h2, h3, h4, h5, h6 { 
    margin: 1em 0 0.5em 0; 
    line-height: 1.2; 
}
p { 
    margin: 0.5em 0; 
    line-height: 1.6;
}
ul, ol { 
    margin: 0.5em 0; 
    padding-left: 2em; 
}
li {
    margin: 0.25em 0;
}
blockquote { 
    margin: 1em 0; 
    padding: 0.5em 1em; 
    border-left: 3px solid #ccc; 
    background: #f9f9f9; 
    font-style: italic;
}
code { 
    background: #f5f5f5; 
    padding: 0.2em 0.4em; 
    border-radius: 3px; 
    font-family: 'Courier New', monospace;
}
pre { 
    background: #f5f5f5; 
    padding: 1em; 
    border-radius: 5px; 
    overflow-x: auto; 
}
pre code {
    background: none;
    padding: 0;
}
img { 
    max-width: 100%; 
    height: auto; 
}
a {
    color: #2563eb;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
strong, b {
    font-weight: 600;
}
em, i {
    font-style: italic;
}
`;
    },

    // Generate a unique scoped container class name
    generateScopeId: function(baseUrl = '') {
        const timestamp = Date.now();
        const urlHash = baseUrl ? baseUrl.replace(/[^a-zA-Z0-9]/g, '') : 'imported';
        return `imported-content-${urlHash}-${timestamp}`.substring(0, 50);
    },

    // Main function to process and scope CSS for imported content
    processImportedStyles: function(doc, baseUrl, scopeContainer = true) {
        // Extract raw styles
        const rawStyles = this.extractStyles(doc, baseUrl);
        
        if (!rawStyles.trim()) {
            return { styles: '', scopeId: null };
        }
        
        // Generate scope if requested
        let scopeId = null;
        let processedStyles = rawStyles;
        
        if (scopeContainer) {
            scopeId = this.generateScopeId(baseUrl);
            processedStyles = this.scopeStyles(rawStyles, `.${scopeId}`);
        }
        
        return {
            styles: processedStyles,
            scopeId: scopeId,
            hasStyles: processedStyles.trim().length > 0
        };
    }
};