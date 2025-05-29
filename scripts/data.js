// Sample data for the application
const initialPages = [
    {
        id: 1,
        title: 'Machine Overview',
        content: `
<h1>Machine Overview</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
<h2>Specifications</h2>
<p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
<h2>Safety Guidelines</h2>
<p>Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non. Curabitur lobortis nisl a enim congue semper.</p>
        `,
        lastUpdated: '2025-05-01',
        author: 'System Admin'
    },
    {
        id: 2,
        title: 'Operating Instructions',
        content: `
<h1>Operating Instructions</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
<h2>Startup Procedure</h2>
<p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
<h2>Shutdown Procedure</h2>
<p>Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non.</p>
        `,
        lastUpdated: '2025-05-05',
        author: 'Technical Writer'
    },
    {
        id: 3,
        title: 'Maintenance Schedule',
        content: `
<h1>Maintenance Schedule</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
<h2>Daily Checks</h2>
<p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
<h2>Monthly Maintenance</h2>
<p>Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non.</p>
<h2>Annual Servicing</h2>
<p>Mauris tempor ligula sit amet magna. Suspendisse potenti. Ut a nunc id a magna ornare volutpat. Vestibulum eget lectus.</p>
        `,
        lastUpdated: '2025-04-28',
        author: 'Maintenance Engineer'
    }
];

const initialChangeRequests = [
    {
        id: 101,
        pageId: 2,
        originalContent: `
<h1>Operating Instructions</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
<h2>Startup Procedure</h2>
<p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
<h2>Shutdown Procedure</h2>
<p>Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non.</p>
        `,
        proposedContent: `
<h1>Operating Instructions</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
<h2>Startup Procedure - UPDATED</h2>
<p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
<p>ADDITIONAL IMPORTANT SAFETY INFORMATION: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<h2>Shutdown Procedure</h2>
<p>Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non.</p>
<h2>Emergency Shutdown</h2>
<p>NEW SECTION: In case of emergency, press the red button located on the front panel.</p>
        `,
        requestDate: '2025-05-14',
        requester: 'Safety Officer',
        status: 'pending' // pending, approved, rejected
    }
];

// Initial comments for demo purposes
const initialComments = [
    {
        id: 1,
        pageId: 1, // Machine Overview
        content: "We should add more technical specifications here. Current specs are too general for our engineering team.",
        author: "Engineering Lead",
        timestamp: "5/28/2025, 2:30 PM",
        elementSelector: "h2:nth-of-type(1)", // Links to "Specifications" heading
        status: "active"
    },
    {
        id: 2,
        pageId: 1, // Machine Overview  
        content: "The safety guidelines section needs to be expanded with OSHA compliance information.",
        author: "Safety Officer",
        timestamp: "5/27/2025, 4:15 PM",
        elementSelector: "h2:nth-of-type(2)", // Links to "Safety Guidelines" heading
        status: "active"
    },
    {
        id: 3,
        pageId: 1, // Machine Overview
        content: "Overall this page looks good, but we need to add model numbers and serial number ranges.",
        author: "Documentation Manager",
        timestamp: "5/26/2025, 9:45 AM",
        elementSelector: null, // General page comment
        status: "active"
    },
    {
        id: 4,
        pageId: 2, // Operating Instructions
        content: "The startup procedure is missing the pre-flight checklist steps. This could be dangerous.",
        author: "Operations Manager",
        timestamp: "5/28/2025, 10:20 AM",
        elementSelector: "h2:nth-of-type(1)", // Links to "Startup Procedure" heading
        status: "active"
    },
    {
        id: 5,
        pageId: 2, // Operating Instructions
        content: "We need to add troubleshooting steps for common startup failures.",
        author: "Field Technician",
        timestamp: "5/27/2025, 1:30 PM",
        elementSelector: "p:nth-of-type(2)", // Links to startup procedure paragraph
        status: "active"
    },
    {
        id: 6,
        pageId: 2, // Operating Instructions
        content: "Please verify these instructions with the latest firmware version 2.1.4",
        author: "Software Engineer",
        timestamp: "5/25/2025, 3:45 PM",
        elementSelector: null, // General page comment
        status: "active"
    },
    {
        id: 7,
        pageId: 3, // Maintenance Schedule
        content: "Daily checks should include oil level verification - this is critical for engine longevity.",
        author: "Maintenance Supervisor",
        timestamp: "5/28/2025, 8:15 AM",
        elementSelector: "h2:nth-of-type(1)", // Links to "Daily Checks" heading
        status: "active"
    },
    {
        id: 8,
        pageId: 3, // Maintenance Schedule
        content: "We're missing the quarterly calibration schedule in this document.",
        author: "Quality Assurance",
        timestamp: "5/26/2025, 11:30 AM",
        elementSelector: null, // General page comment
        status: "active"
    },
    {
        id: 9,
        pageId: 3, // Maintenance Schedule
        content: "Annual servicing costs should be included for budget planning purposes.",
        author: "Finance Manager",
        timestamp: "5/24/2025, 2:20 PM", 
        elementSelector: "h2:nth-of-type(3)", // Links to "Annual Servicing" heading
        status: "active"
    },
    {
        id: 10,
        pageId: 1, // Machine Overview - Resolved comment example
        content: "The machine weight specification was incorrect - this has been fixed.",
        author: "Technical Writer",
        timestamp: "5/20/2025, 4:00 PM",
        elementSelector: "h2:nth-of-type(1)", // Links to "Specifications" heading
        status: "resolved"
    }
];