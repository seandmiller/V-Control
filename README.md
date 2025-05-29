# Documentation Portal

A modern, web-based documentation management system with built-in change request workflow, approval process, and collaborative commenting. Perfect for teams that need collaborative document editing with version control, approval workflows, and real-time feedback.

## Features

### Core Functionality
- **WYSIWYG Editor** - Rich text editing with formatting toolbar (bold, italic, headings, lists, links)
- **Multi-Page Management** - Create, edit, and organize multiple documentation pages
- **Change Request System** - Submit proposed changes for review and approval
- **Visual Diff Viewer** - See exactly what changed between versions
- **Comment System** - Add contextual comments to specific sections or general page feedback
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Web Import** - Import content directly from web pages with style preservation
- **CSS Processing** - Advanced security and scoping for imported styles
- **Interactive Comments** - Hover over commented sections to see feedback instantly
- **Comment Management** - Resolve comments and track feedback progress
- **Local Storage** - All data persists in your browser (no server required)
- **Modern UI** - Clean, professional interface with intuitive navigation
- **Fast Performance** - Pure client-side application, no loading delays
- **No Dependencies** - Runs entirely in the browser, no installation needed

## Perfect For

- **Technical Documentation** - API docs, user manuals, installation guides with team feedback
- **Team Wikis** - Internal knowledge bases and process documentation with collaborative review
- **Project Documentation** - Requirements, specifications, and project notes with stakeholder comments
- **Educational Content** - Course materials, tutorials, and learning resources with instructor feedback
- **Standard Operating Procedures** - Company policies and workflow documentation with approval workflow

## How It Works

### 1. **View Mode**
- Browse through your documentation pages
- See highlighted sections with comments from team members
- Hover over commented sections for instant feedback preview
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

### 4. **Comment System**
- Add comments to specific sections or entire pages
- Visual indicators show which content has feedback
- Resolve comments when issues are addressed
- Track comment history and author information

### 5. **Web Import**
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
│   ├── diff.css           # Diff viewer styling
│   └── comments.css       # Comment system styling
├── scripts/
│   ├── data.js            # Sample data and initialization
│   ├── diffViewer.js      # Visual diff comparison utilities
│   ├── editor.js          # WYSIWYG editor functionality
│   ├── requestManager.js  # Change request workflow
│   └── pagejs/            # Page-related modules
│       ├── cssProcessor.js    # CSS processing & security
│       ├── webimporter.js     # Web content importing
│       ├── pageManager.js     # Page creation and management
│       └── comments.js        # Comment system functionality
└── assets/
    └── icons/             # SVG icons for UI elements
        ├── alert-circle.svg   # Alert/warning icon
        ├── check.svg          # Checkmark/success icon
        ├── edit.svg           # Edit/pencil icon
        ├── globe.svg          # Web/internet icon
        ├── plus-circle.svg    # Add/create icon
        ├── save.svg           # Save/disk icon
        ├── trash.svg          # Delete/trash icon
        └── x-circle.svg       # Close/cancel icon
```

## Architecture

### Modular Design
The application follows a modular architecture with clear separation of concerns:

- **`app.js`** - Main application controller and event coordination
- **`scripts/pagejs/`** - All page-related functionality grouped together
  - **`pageManager.js`** - Core page CRUD operations and state management
  - **`webimporter.js`** - Web content fetching with CORS handling
  - **`cssProcessor.js`** - CSS security, sanitization, and scoping
  - **`comments.js`** - Comment system with contextual feedback and resolution
- **`scripts/requestManager.js`** - Change request workflow and approval process
- **`scripts/editor.js`** - WYSIWYG editing functionality
- **`scripts/diffViewer.js`** - Content comparison and visualization

### Security Features
- **CSS Sanitization** - Removes dangerous CSS patterns that could break layout or inject scripts
- **Content Filtering** - Cleans imported HTML content while preserving formatting
- **Style Scoping** - Automatically scopes imported CSS to prevent conflicts with the main application
- **XSS Prevention** - Escapes HTML content and filters potentially malicious code

### Comment System Features
- **Contextual Comments** - Link comments to specific sections of content
- **Visual Indicators** - Highlighted sections show where feedback exists
- **Hover Tooltips** - Quick preview of comments without opening sidebar
- **Comment Resolution** - Track and resolve feedback systematically
- **Author Attribution** - Track who made which comments and when

### Dependency Management
```
app.js
├── requestManager.js
├── editor.js
├── diffViewer.js
└── pagejs/
    ├── pageManager.js     # Uses webimporter, integrates with comments
    ├── webimporter.js     # Uses cssProcessor
    ├── cssProcessor.js    # No dependencies
    └── comments.js        # Integrates with pageManager
```

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features Used**: ES6 modules, Fetch API, Local Storage, CSS Grid, DOM manipulation
- **Mobile Support**: Responsive design works on iOS Safari and Android Chrome
- **Touch Support**: Comment system works with touch interactions on mobile devices

## Development

### Adding New Features
1. **Page-related features** → Add to `scripts/pagejs/`
2. **Editor features** → Extend `scripts/editor.js`
3. **Request workflow features** → Extend `scripts/requestManager.js`
4. **Comment features** → Extend `scripts/pagejs/comments.js`
5. **UI components** → Add to appropriate CSS files

### Testing
The modular structure makes testing easier:
- Each module can be tested independently
- Clear dependencies make mocking straightforward
- Focused functionality reduces test complexity
- Comment system can be tested separately from core functionality

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
- **Optimized comment rendering** - Only active comments are processed and displayed

### Accessibility
- **Keyboard navigation** - Full keyboard support for all features including comments
- **Screen reader support** - Semantic HTML and ARIA labels throughout
- **High contrast** - Readable color scheme meeting WCAG guidelines
- **Focus management** - Clear focus indicators and logical tab order
- **Comment accessibility** - Tooltips and sidebar navigation work with assistive technologies

### Maintainability
- **Separation of concerns** - Each module has a single responsibility
- **Clear naming** - Functions and variables use descriptive names
- **Consistent patterns** - Similar functionality follows the same patterns
- **Documentation** - Code comments explain complex logic and architectural decisions
- **Modular comments** - Comment system is self-contained and easily extensible

## User Experience Features

### Comment System UX
- **Visual Feedback** - Commented sections are clearly highlighted
- **Instant Preview** - Hover tooltips show comment content immediately
- **Contextual Linking** - Comments can be linked to specific headings or paragraphs
- **Sidebar Management** - Dedicated comment sidebar for full management
- **Resolution Tracking** - Comments can be resolved when addressed
- **Mobile Optimization** - Comment system adapts to mobile interfaces

### Workflow Integration
- **Seamless Integration** - Comments work alongside change requests
- **Page-Specific Comments** - Comments automatically filter by active page
- **Author Attribution** - Track who provided which feedback
- **Timestamp Tracking** - See when comments were made
- **Status Management** - Active and resolved comments are handled separately

## License

MIT License - see LICENSE file for details

## Changelog

### v2.1.0 - Comment System Integration
- Added comprehensive comment system with contextual feedback
- Implemented comment sidebar with full management interface
- Added visual indicators for commented content sections
- Integrated hover tooltips for instant comment preview
- Added comment resolution and status tracking
- Enhanced mobile responsiveness for comment features
- Improved accessibility for comment interactions

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