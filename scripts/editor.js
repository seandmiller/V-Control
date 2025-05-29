// editor.js - WYSIWYG Editor for simplified content editing

const WYSIWYGEditor = {
    // Editor instance reference
    editorElement: null,
    toolbar: null,
    isInitialized: false,
    
    // Initialize the WYSIWYG editor
    init: function() {
        if (this.isInitialized) return;
        
        this.createEditor();
        this.setupToolbar();
        this.setupEventListeners();
        this.isInitialized = true;
    },
    
    // Create the editor container and toolbar
    createEditor: function() {
        const editArea = document.querySelector('.edit-area');
        const oldTextarea = document.getElementById('edit-textarea');
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'wysiwyg-toolbar';
        toolbar.innerHTML = `
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-command="bold" title="Bold (Ctrl+B)">
                    <strong>B</strong>
                </button>
                <button type="button" class="toolbar-btn" data-command="italic" title="Italic (Ctrl+I)">
                    <em>I</em>
                </button>
                <button type="button" class="toolbar-btn" data-command="underline" title="Underline (Ctrl+U)">
                    <u>U</u>
                </button>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-group">
                <select class="toolbar-select" data-command="formatBlock" title="Heading">
                    <option value="p">Normal Text</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">
                    • List
                </button>
                <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">
                    1. List
                </button>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-command="justifyLeft" title="Align Left">
                    ⬅
                </button>
                <button type="button" class="toolbar-btn" data-command="justifyCenter" title="Align Center">
                    ↔
                </button>
                <button type="button" class="toolbar-btn" data-command="justifyRight" title="Align Right">
                    ➡
                </button>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-command="createLink" title="Insert Link">
                    🔗 Link
                </button>
                <button type="button" class="toolbar-btn" data-command="insertHorizontalRule" title="Horizontal Line">
                    ─ Line
                </button>
            </div>
            <div class="toolbar-divider"></div>
            <div class="toolbar-group">
                <button type="button" class="toolbar-btn" data-command="undo" title="Undo (Ctrl+Z)">
                    ↶ Undo
                </button>
                <button type="button" class="toolbar-btn" data-command="redo" title="Redo (Ctrl+Y)">
                    ↷ Redo
                </button>
            </div>
        `;
        
        // Create editor
        const editor = document.createElement('div');
        editor.id = 'wysiwyg-editor';
        editor.className = 'wysiwyg-editor';
        editor.contentEditable = true;
        editor.innerHTML = '<p>Start typing here...</p>';
        
        // Replace the textarea
        editArea.innerHTML = '';
        editArea.appendChild(toolbar);
        editArea.appendChild(editor);
        
        this.toolbar = toolbar;
        this.editorElement = editor;
    },
    
    // Setup toolbar event listeners
    setupToolbar: function() {
        const toolbar = this.toolbar;
        
        // Handle toolbar button clicks
        toolbar.addEventListener('click', (e) => {
            e.preventDefault();
            
            const button = e.target.closest('.toolbar-btn');
            if (!button) return;
            
            const command = button.dataset.command;
            this.executeCommand(command);
        });
        
        // Handle dropdown changes
        toolbar.addEventListener('change', (e) => {
            if (e.target.classList.contains('toolbar-select')) {
                const command = e.target.dataset.command;
                const value = e.target.value;
                this.executeCommand(command, value);
                
                // Reset dropdown to show current selection
                setTimeout(() => this.updateToolbarState(), 10);
            }
        });
    },
    
    // Setup editor event listeners
    setupEventListeners: function() {
        const editor = this.editorElement;
        
        // Handle keyboard shortcuts
        editor.addEventListener('keydown', (e) => {
            // Handle common shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.executeCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.executeCommand('underline');
                        break;
                    case 'z':
                        e.preventDefault();
                        this.executeCommand('undo');
                        break;
                    case 'y':
                        e.preventDefault();
                        this.executeCommand('redo');
                        break;
                }
            }
            
            // Handle Enter key for better paragraph handling
            if (e.key === 'Enter' && !e.shiftKey) {
                // Let the browser handle it naturally for now
                // Could add custom logic here if needed
            }
        });
        
        // Update toolbar state when selection changes
        editor.addEventListener('keyup', () => this.updateToolbarState());
        editor.addEventListener('mouseup', () => this.updateToolbarState());
        
        // Handle paste events to clean up pasted content
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            
            // Get pasted content as plain text first
            const paste = e.clipboardData.getData('text/plain');
            
            // Insert as plain text and let the user format it
            document.execCommand('insertText', false, paste);
        });
        
        // Placeholder handling
        editor.addEventListener('focus', () => {
            if (editor.innerHTML === '<p>Start typing here...</p>') {
                editor.innerHTML = '<p><br></p>';
                this.focusEditor();
            }
        });
        
        editor.addEventListener('blur', () => {
            if (editor.innerHTML === '<p><br></p>' || editor.innerHTML === '') {
                editor.innerHTML = '<p>Start typing here...</p>';
            }
        });
    },
    
    // Execute formatting commands
    executeCommand: function(command, value = null) {
        // Focus the editor first
        this.editorElement.focus();
        
        // Special handling for certain commands
        if (command === 'createLink') {
            const url = prompt('Enter URL:', 'https://');
            if (url && url !== 'https://') {
                document.execCommand('createLink', false, url);
            }
            return;
        }
        
        // Execute the command
        document.execCommand(command, false, value);
        
        // Update toolbar state
        setTimeout(() => this.updateToolbarState(), 10);
    },
    
    // Update toolbar button states based on current selection
    updateToolbarState: function() {
        const toolbar = this.toolbar;
        
        // Update button active states
        const buttons = toolbar.querySelectorAll('.toolbar-btn');
        buttons.forEach(button => {
            const command = button.dataset.command;
            
            try {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } catch (e) {
                // Some commands don't support queryCommandState
                button.classList.remove('active');
            }
        });
        
        // Update format dropdown
        const formatSelect = toolbar.querySelector('select[data-command="formatBlock"]');
        if (formatSelect) {
            try {
                const currentFormat = document.queryCommandValue('formatBlock').toLowerCase();
                formatSelect.value = currentFormat || 'p';
            } catch (e) {
                formatSelect.value = 'p';
            }
        }
    },
    
    // Get the current content as HTML
    getContent: function() {
        if (!this.editorElement) return '';
        
        let content = this.editorElement.innerHTML;
        
        // Clean up the content
        content = this.cleanHTML(content);
        
        // If content is just placeholder, return empty
        if (content === '<p>Start typing here...</p>' || content === '<p><br></p>') {
            return '<p>New content...</p>';
        }
        
        return content;
    },
    
    // Set content in the editor
    setContent: function(html) {
        if (!this.editorElement) return;
        
        // Clean and set the content
        const cleanedHTML = this.cleanHTML(html);
        this.editorElement.innerHTML = cleanedHTML || '<p>Start typing here...</p>';
    },
    
    // Clean HTML content
    cleanHTML: function(html) {
        // Create a temporary div to clean the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Remove unwanted attributes but keep basic formatting
        const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'hr'];
        const allowedAttributes = ['href', 'target'];
        
        // Remove scripts, styles, and other dangerous elements
        const dangerousTags = temp.querySelectorAll('script, style, object, embed, iframe');
        dangerousTags.forEach(tag => tag.remove());
        
        // Clean attributes
        const allElements = temp.querySelectorAll('*');
        allElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            
            // Remove elements not in allowed list
            if (!allowedTags.includes(tagName)) {
                // Replace with div or p, preserving content
                const replacement = document.createElement('p');
                replacement.innerHTML = element.innerHTML;
                element.parentNode.replaceChild(replacement, element);
                return;
            }
            
            // Clean attributes
            const attributes = Array.from(element.attributes);
            attributes.forEach(attr => {
                if (!allowedAttributes.includes(attr.name.toLowerCase())) {
                    element.removeAttribute(attr.name);
                }
            });
            
            // Add target="_blank" to links
            if (tagName === 'a' && element.getAttribute('href')) {
                element.setAttribute('target', '_blank');
            }
        });
        
        return temp.innerHTML;
    },
    
    // Focus the editor
    focusEditor: function() {
        if (this.editorElement) {
            this.editorElement.focus();
            
            // Place cursor at end
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(this.editorElement);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    },
    
    // Check if editor has been modified
    hasChanges: function(originalContent) {
        const currentContent = this.getContent();
        return originalContent !== currentContent;
    }
};