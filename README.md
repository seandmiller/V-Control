# Machine Documentation Portal

A modern, web-based documentation management system with built-in change request workflow and approval process. Perfect for teams that need collaborative document editing with version control and approval workflows.

## Features

### Core Functionality
- **WYSIWYG Editor** - Rich text editing with formatting toolbar (bold, italic, headings, lists, links)
- **Multi-Page Management** - Create, edit, and organize multiple documentation pages
- **Change Request System** - Submit proposed changes for review and approval
- **Visual Diff Viewer** - See exactly what changed between versions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Web Import** - Import content directly from web pages with style preservation
- **Local Storage** - All data persists in your browser (no server required)
- **Modern UI** - Clean, professional interface with intuitive navigation
- **Fast Performance** - Pure client-side application, no loading delays
- **No Dependencies** - Runs entirely in the browser, no installation needed

## Perfect For

- **Technical Documentation** - API docs, user manuals, installation guides
- **Team Wikis** - Internal knowledge bases and process documentation  
- **Project Documentation** - Requirements, specifications, and project notes
- **Educational Content** - Course materials, tutorials, and learning resources
- **Standard Operating Procedures** - Company policies and workflow documentation

## How It Works

### 1. **View Mode**
- Browse through your documentation pages
- Clean, readable layout optimized for consumption
- Quick navigation between pages via sidebar

### 2. **Edit Mode** 
- WYSIWYG editor with familiar formatting tools
- Real-time preview as you type
- Support for headings, lists, links, and basic formatting

### 3. **Change Request Workflow**
- Submit proposed changes for review
- Visual diff shows additions, deletions, and modifications
- Approve or reject changes with one click
- Perfect for teams requiring document approval processes

### 4. **Web Import**
- Import content from any webpage
- Preserve original styling and formatting
- Quick demo mode for testing (just type "demo")

## Getting Started

### Option 1: GitHub Pages (Recommended)
1. Fork or download this repository
2. Enable GitHub Pages in repository settings
3. Visit your live site at `https://yourusername.github.io/repository-name`

### Option 2: Local Usage
1. Download all files
2. Open `index.html` in any modern web browser
3. Start creating and managing your documentation

### Option 3: Web Server
Upload all files to any web server that supports static HTML files.

## Project Structure

```
├── index.html              # Main application entry point
├── css/
│   ├── base.css           # Core styles and CSS variables
│   ├── components.css     # Reusable UI components
│   ├── layout.css         # Page layout and structure
│   ├── wysiwyg.css        # WYSIWYG editor styles
│   └── diff.css           # Diff viewer styling
├── js/
│   ├── app.js             # Main application controller
│   ├── pageManager.js     # Page creation and management
│   ├── requestManager.js  # Change request workflow
│   ├── editor.js          # WYSIWYG editor functionality
│   ├── diffViewer.js      # Visual diff comparison
│   └── data.js            # Sample data and initialization
└── assets/
    └── icons/             # SVG icons for UI elements
```

