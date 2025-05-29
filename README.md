# Documentation Portal

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
- **CSS Processing** - Advanced security and scoping for imported styles
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
- Advanced CSS processing with security filtering
- Automatic style scoping to prevent conflicts
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
├── app.js                  # Main application controller
├── css/
│   ├── base.css           # Core styles and CSS variables
│   ├── components.css     # Reusable UI components
│   ├── layout.css         # Page layout and structure
│   ├── wysiwyg.css        # WYSIWYG editor styles
│   └── diff.css           # Diff viewer styling
├── scripts/
│   ├── data.js            # Sample data and initialization
│   ├── diffViewer.js      # Visual diff comparison utilities
│   ├── editor.js          # WYSIWYG editor functionality
│   ├── requestManager.js  # Change request workflow
│   └── pagejs/            # Page-related modules
│       ├── cssProcessor.js    # CSS processing & security
│       ├── webImporter.js     # Web content importing
│       └── pageManager.js     # Page creation and management
└── assets/
    └── icons/             # SVG icons for UI elements
```

## Architecture

### Modular Design
The application follows a modular architecture with clear separation of concerns:

- **`app.js`** - Main application controller and event coordination
- **`scripts/pagejs/`** - All page-related functionality grouped together
  - **`pageManager.js`** - Core page CRUD operations and state management
  - **`webImporter.js`** - Web content fetching with CORS handling
  - **`cssProcessor.js`** - CSS security, sanitization, and scoping
- **`scripts/requestManager.js`** - Change request workflow and approval process
- **`scripts/editor.js`** - WYSIWYG editing functionality
- **`scripts/diffViewer.js`** - Content comparison and visualization

### Security Features
- **CSS Sanitization** - Removes dangerous CSS patterns that could break layout or inject scripts
- **Content Filtering** - Cleans imported HTML content while preserving formatting
- **Style Scoping** - Automatically scopes imported CSS to prevent conflicts with the main application
- **XSS Prevention** - Escapes HTML content and filters potentially malicious code

### Dependency Management
```
app.js
├── requestManager.js
├── editor.js
├── diffViewer.js
└── pagejs/
    ├── pageManager.js     # Uses webImporter
    ├── webImporter.js     # Uses cssProcessor
    └── cssProcessor.js    # No dependencies
```

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features Used**: ES6 modules, Fetch API, Local Storage, CSS Grid
- **Mobile Support**: Responsive design works on iOS Safari and Android Chrome

## Development

### Adding New Features
1. **Page-related features** → Add to `scripts/pagejs/`
2. **Editor features** → Extend `scripts/editor.js`
3. **Request workflow features** → Extend `scripts/requestManager.js`
4. **UI components** → Add to appropriate CSS files

### Testing
The modular structure makes testing easier:
- Each module can be tested independently
- Clear dependencies make mocking straightforward
- Focused functionality reduces test complexity

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing architectural patterns
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Technical Highlights

### Performance
- **Client-side only** - No server dependencies or API calls
- **Lazy loading** - Features load only when needed
- **Efficient DOM updates** - Minimal re-rendering for smooth UX
- **Local storage** - Fast data persistence without network overhead

### Accessibility
- **Keyboard navigation** - Full keyboard support for all features
- **Screen reader support** - Semantic HTML and ARIA labels
- **High contrast** - Readable color scheme meeting WCAG guidelines
- **Focus management** - Clear focus indicators and logical tab order

### Maintainability
- **Separation of concerns** - Each module has a single responsibility
- **Clear naming** - Functions and variables use descriptive names
- **Consistent patterns** - Similar functionality follows the same patterns
- **Documentation** - Code comments explain complex logic and architectural decisions

## License

MIT License - see LICENSE file for details

## Changelog

### v2.0.0 - Architecture Refactor
- Separated page management into focused modules
- Added CSS processor for enhanced security
- Improved web import functionality
- Better error handling and user feedback

### v1.0.0 - Initial Release
- Basic page management and editing
- Change request workflow
- Web import functionality
- Responsive design