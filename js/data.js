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