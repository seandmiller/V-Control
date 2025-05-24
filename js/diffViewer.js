// Diff Viewer - Handles comparing and highlighting differences
const DiffViewer = {
    // Compare original and proposed content and generate HTML with highlighted differences
    generateDiffHtml: function(original, proposed) {
        // Simple line-by-line diff implementation
        const originalLines = this.prepareLines(original);
        const proposedLines = this.prepareLines(proposed);
        
        let diffHtml = '<div class="diff-content">';
        
        // Process each line in the proposed content
        proposedLines.forEach(line => {
            if (line.trim()) {
                if (!originalLines.includes(line)) {
                    // This is a new or modified line
                    diffHtml += `<div class="added">${line}</div>`;
                } else {
                    // This is an unchanged line
                    diffHtml += `<div class="unchanged">${line}</div>`;
                }
            }
        });
        
        // Find removed lines (in original but not in proposed)
        originalLines.forEach(line => {
            if (line.trim() && !proposedLines.includes(line)) {
                diffHtml += `<div class="removed">${line}</div>`;
            }
        });
        
        diffHtml += '</div>';
        return diffHtml;
    },
    
    // Helper function to prepare lines for comparison
    prepareLines: function(content) {
        // Split by HTML tags and line breaks to identify changes more precisely
        return content.split(/(<[^>]+>)|(\n)/)
            .filter(line => line && line.trim())
            .map(line => line.trim());
    },
    
    // Simplified diff for a real application - just checks if the content has changed
    hasChanges: function(original, proposed) {
        return original !== proposed;
    }
};