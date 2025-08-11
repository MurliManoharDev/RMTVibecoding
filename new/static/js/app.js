// Main application JavaScript for RMT New
const ICONS = {
    Home: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    ListFilter: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>`,
    UserPlus: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>`,
    ArrowRightLeft: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
    UserMinus: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="22" x2="16" y1="11" y2="11"></line></svg>`,
    LogOut: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    CalendarDays: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    Search: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    FilePlus: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>`,
    Edit3: () => `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
    Maximize: () => `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
    Minimize: () => `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`,
    ChevronDown: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    ChevronRight: () => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    FileText: () => `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>`,
};

let currentPage = 'home';
let selectedRequestType = 'All';
let requests = [];
let expandedRows = {};
let sortBy = 'start_date';
let sortOrder = 'desc';

// API Functions
async function fetchRequests(type = 'all') {
    try {
        const response = await fetch(`/api/requests/${type}`);
        const data = await response.json();
        if (data.success) {
            requests = data.requests;
            return requests;
        } else {
            console.error('Failed to fetch requests:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
}

async function submitRequestToAPI(requestType, formData) {
    try {
        const response = await fetch('/api/submit-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: requestType,
                formData: formData
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting request:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

async function updateRequestStatus(requestId, newStatus) {
    try {
        const response = await fetch(`/api/requests/${requestId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

function navigateTo(pageId, type = 'All') {
    currentPage = pageId.replace('-screen', '');
    selectedRequestType = type;
    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error("Target page not found:", pageId);
        const homeScreenEl = document.getElementById('home-screen');
        if (homeScreenEl) homeScreenEl.classList.add('active');
        currentPage = 'home';
    }
    renderSidebar();
    if (currentPage === 'viewRequests') renderViewRequestsScreen();
    if (currentPage === 'addForm') renderRequestForm('Add', addRequestFields, 'addForm-screen', fillAddFormSampleData);
    if (currentPage === 'transferForm') renderRequestForm('Transfer', transferRequestFields, 'transferForm-screen', fillTransferFormSampleData);
    if (currentPage === 'termForm') renderRequestForm('Terminate', terminateRequestFields, 'termForm-screen', fillTermFormSampleData);
}

function renderSidebar() {
    const sidebarEl = document.getElementById('sidebar');
    if (!sidebarEl) { console.error("Sidebar element (#sidebar) not found."); return; }
    const commonLinks = [{ name: 'Home', icon: ICONS.Home(), page: 'home-screen' }];
    const viewRequestLinks = [
        { name: 'All Requests', icon: ICONS.ListFilter(), page: 'viewRequests-screen', type: 'All' },
        { name: 'Add Requests', icon: ICONS.UserPlus(), page: 'viewRequests-screen', type: 'Add' },
        { name: 'Transfer Requests', icon: ICONS.ArrowRightLeft(), page: 'viewRequests-screen', type: 'Transfer' },
        { name: 'Terminate Requests', icon: ICONS.UserMinus(), page: 'viewRequests-screen', type: 'Terminate' },
    ];
    const reportsLinks = [{ name: 'Reports', icon: ICONS.FileText(), page: 'reports-screen' }];
    const allLinks = [...commonLinks, ...viewRequestLinks, ...reportsLinks];
    
    sidebarEl.innerHTML = allLinks.map(link => {
        const isActive = (currentPage === link.page.replace('-screen', '')) && 
                        (link.type === undefined || selectedRequestType === link.type);
        return `<div class="sidebar-link ${isActive ? 'sidebar-link-active' : 'text-gray-700 hover:text-sky-600'} flex items-center p-2 rounded-md cursor-pointer text-sm transition-colors duration-150" 
                     onclick="navigateTo('${link.page}'${link.type ? `, '${link.type}'` : ''})">
                  <span class="mr-3">${link.icon}</span>
                  <span>${link.name}</span>
                </div>`;
    }).join('');
}

function renderHomeScreen() {
    const containerEl = document.getElementById('home-screen-options-container');
    if (!containerEl) { console.error("Home screen options container not found."); return; }
    
    const homeItems = [
        { title: 'Add Employee Request', description: 'Request to add a new employee to the system', icon: ICONS.UserPlus(), page: 'addForm-screen', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'Transfer Employee Request', description: 'Request to transfer an existing employee', icon: ICONS.ArrowRightLeft(), page: 'transferForm-screen', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { title: 'Terminate Employee Request', description: 'Request to terminate an employee', icon: ICONS.UserMinus(), page: 'termForm-screen', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { title: 'View All Requests', description: 'View and manage all submitted requests', icon: ICONS.ListFilter(), page: 'viewRequests-screen', type: 'All', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        { title: 'View Add Requests', description: 'View all add employee requests', icon: ICONS.UserPlus(), page: 'viewRequests-screen', type: 'Add', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'View Transfer Requests', description: 'View all transfer employee requests', icon: ICONS.ArrowRightLeft(), page: 'viewRequests-screen', type: 'Transfer', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { title: 'View Terminate Requests', description: 'View all terminate employee requests', icon: ICONS.UserMinus(), page: 'viewRequests-screen', type: 'Terminate', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { title: 'Reports', description: 'Generate and view reports', icon: ICONS.FileText(), page: 'reports-screen', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    ];
    
    containerEl.innerHTML = homeItems.map(item => `
        <div class="card cursor-pointer hover:shadow-xl transition-shadow duration-200 ${item.bgColor}" 
             onclick="navigateTo('${item.page}'${item.type ? `, '${item.type}'` : ''})">
            <div class="flex items-center">
                <div class="flex-shrink-0 ${item.iconColor} mr-4">
                    ${item.icon}
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
                    <p class="text-gray-600 text-sm mt-1">${item.description}</p>
                </div>
                <div class="ml-auto text-gray-400">
                    ${ICONS.ChevronRight()}
                </div>
            </div>
        </div>
    `).join('');
}

async function renderViewRequestsScreen() {
    const screenEl = document.getElementById('viewRequests-screen');
    if (!screenEl) { console.error("View requests screen element not found."); return; }
    
    // Fetch requests from API
    await fetchRequests(selectedRequestType.toLowerCase());
    
    const filteredRequests = selectedRequestType === 'All' ? 
        requests : requests.filter(req => req.type === selectedRequestType);
    
    screenEl.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 class="text-3xl font-semibold text-sky-700">${selectedRequestType} Requests</h2>
                <div class="mt-4 sm:mt-0 flex space-x-3">
                    <div class="relative">
                        <input type="text" id="searchInput" placeholder="Search requests..." 
                               class="input-field pl-10 pr-4 py-2 w-64" oninput="filterRequests()">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            ${ICONS.Search()}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('id')">
                                    Request ID
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('type')">
                                    Type
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('user_name')">
                                    Employee Name
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('company')">
                                    Company
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('status')">
                                    Status
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortRequests('start_date')">
                                    Date
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody id="requestsTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    renderRequestsTable(filteredRequests);
}

function renderRequestsTable(requestsToRender) {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = requestsToRender.map(req => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${req.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${req.type === 'Add' ? 'bg-green-100 text-green-800' : 
                      req.type === 'Transfer' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}">
                    ${req.type}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${req.user_name || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${req.company || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <select class="text-sm border-gray-300 rounded-md" onchange="handleStatusChange('${req.id}', this.value)">
                    <option value="${req.status}" selected>${req.status}</option>
                    ${req.status !== 'Pending' ? '<option value="Pending">Pending</option>' : ''}
                    ${req.status !== 'PMO Review' ? '<option value="PMO Review">PMO Review</option>' : ''}
                    ${req.status !== 'Approved' ? '<option value="Approved">Approved</option>' : ''}
                    ${req.status !== 'Rejected' ? '<option value="Rejected">Rejected</option>' : ''}
                    ${req.status !== 'Pending HR' ? '<option value="Pending HR">Pending HR</option>' : ''}
                </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${req.start_date || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-sky-600 hover:text-sky-900" onclick="toggleRowExpansion('${req.id}')">
                    ${expandedRows[req.id] ? 'Hide' : 'View'} Details
                </button>
            </td>
        </tr>
        ${expandedRows[req.id] ? `
        <tr class="bg-gray-50">
            <td colspan="7" class="px-6 py-4">
                <div class="text-sm text-gray-900">
                    <div class="grid grid-cols-2 gap-4">
                        <div><strong>RACF ID:</strong> ${req.racf_id || 'N/A'}</div>
                        <div><strong>Location:</strong> ${req.location || 'N/A'}</div>
                        ${req.details && typeof req.details === 'object' ? 
                            Object.entries(req.details).map(([key, value]) => 
                                `<div><strong>${key}:</strong> ${value}</div>`
                            ).join('') : ''
                        }
                    </div>
                </div>
            </td>
        </tr>
        ` : ''}
    `).join('');
}

async function handleStatusChange(requestId, newStatus) {
    const result = await updateRequestStatus(requestId, newStatus);
    if (result.success) {
        showCustomAlert('Success', 'Status updated successfully', 'success');
        // Refresh the requests view
        await renderViewRequestsScreen();
    } else {
        showCustomAlert('Error', result.message || 'Failed to update status', 'error');
    }
}

function toggleRowExpansion(requestId) {
    expandedRows[requestId] = !expandedRows[requestId];
    renderViewRequestsScreen();
}

function filterRequests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRequests = requests.filter(req => 
        (selectedRequestType === 'All' || req.type === selectedRequestType) &&
        (req.id.toLowerCase().includes(searchTerm) ||
         req.user_name?.toLowerCase().includes(searchTerm) ||
         req.company?.toLowerCase().includes(searchTerm) ||
         req.status.toLowerCase().includes(searchTerm))
    );
    renderRequestsTable(filteredRequests);
}

function sortRequests(field) {
    if (sortBy === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy = field;
        sortOrder = 'asc';
    }
    
    requests.sort((a, b) => {
        let aVal = a[field] || '';
        let bVal = b[field] || '';
        
        if (field === 'start_date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderViewRequestsScreen();
}

// Form fields definitions (from original RTMNew.html)
const commonResourceFields = [
    { label: 'Company', id: 'company', type: 'select', required: true, options: ['Cognizant', 'Infosys', 'TCS', 'Wipro', 'HCL', 'Other'], placeholder: 'Select Company' },
    { label: 'First Name', id: 'firstName', required: true, placeholder: 'First Name' },
    { label: 'Middle Initial', id: 'middleInitial', placeholder: 'M.I.' },
    { label: 'Last Name', id: 'lastName', required: true, placeholder: 'Last Name' },
    { label: 'RACF ID', id: 'racfId', required: true, placeholder: 'RACF ID' },
];

const addRequestFields = [
    { label: 'Start Date', id: 'startDate', type: 'date', required: true },
    ...commonResourceFields,
    { label: 'Cognizant Employee ID', id: 'cognizantEmployeeId', placeholder: 'Employee ID (if Cognizant)' },
    { label: 'Contractor Phone', id: 'contractorPhone', type: 'tel', placeholder: 'e.g., (555) 123-4567' },
    { label: 'Contractor Phone Ext', id: 'contractorPhoneExt', placeholder: 'Extension' },
    { label: 'Reporting Manager', id: 'reportingManager', required: true, placeholder: 'Full Name' },
    { label: 'Reporting Manager\'s Manager', id: 'reportingManagersManager', required: true, placeholder: 'Full Name' },
    { label: 'Secondary Contact Name', id: 'secondaryContactName', placeholder: 'Full Name' },
    { label: 'Model After Name', id: 'modelAfterName', placeholder: 'Existing employee to model access after' },
    { label: 'Workspace Location', id: 'workspaceLocation', type: 'radio', required: true, options: [ {value: 'onsite', label: 'Onsite'}, {value: 'remote', label: 'Remote'} ], defaultValue: 'onsite' },
    { label: 'Is Softphone Required?', id: 'softphoneRequired', type: 'radio', required: true, options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'no' },
    { label: 'PC Model', id: 'pcModel', type: 'select', options: ['laptop', 'desktop', 'thin client'], defaultValue: 'laptop', placeholder: 'Select PC Model' },
    { label: 'Is this related to a project?', id: 'relatedToProject', type: 'radio', required: true, options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'yes' },
    { label: 'Project Name', id: 'projectName', placeholder: 'Project Name (if applicable)' },
    { label: 'Project Manager', id: 'projectManager', placeholder: 'Full Name' },
    { label: 'EPPIC Project Number', id: 'eppicProjectNumber', placeholder: 'EPPIC Number' },
    { label: 'Project Type', id: 'projectType', type: 'select', options: ['Development', 'Maintenance', 'Consulting', 'Enhancement', 'Other'], placeholder: 'Select Project Type' },
    { label: 'Contract Workspace #', id: 'contractWorkspaceNo', placeholder: 'CW Number' },
    { label: 'SOW Name', id: 'sowName', placeholder: 'Statement of Work Name' },
    { label: 'Cost Center', id: 'costCenter', placeholder: 'Cost Center Code' },
    { label: 'Fixed Bid or T&M', id: 'bidType', type: 'select', options: ['Fixed Bid', 'T&M'], defaultValue: 'Fixed Bid' },
    { label: 'Role', id: 'role', type: 'select', options: ['Developer', 'QA Analyst', 'Project Manager', 'Business Analyst', 'Architect', 'Consultant'], placeholder: 'Select Role' },
    { label: 'Skill', id: 'skill', type: 'select', options: ['Java', 'React', 'Angular', 'SQL', '.NET', 'Python', 'Project Management', 'Business Analysis'], placeholder: 'Select Skill' },
    { label: 'Rate / HR', id: 'rateHr', type: 'number', placeholder: 'e.g., 75.00' },
    { label: 'Resource Type', id: 'resourceType', type: 'select', options: ['Active', 'Inactive', 'Contingent'], defaultValue: 'Active' },
    { label: 'EPPIC Timesheet Approver', id: 'eppicTimesheetApprover', placeholder: 'Full Name' },
    { label: 'Additional Comments', id: 'additionalCommentsAdd', type: 'textarea', placeholder: 'Any additional information...' },
];

const transferRequestFields = [
    { label: 'Name (As in system)', id: 'name', required: true, placeholder: 'Current Full Name of Resource' },
    ...commonResourceFields,
    { label: 'Key Employee ID', id: 'keyEmployeeId', required: true, placeholder: 'KeyBank Employee ID (if applicable)' },
    { label: 'Current Location', id: 'currentLocation', required: true, placeholder: 'Current Location' },
    { label: 'Current Reporting Manager', id: 'currentReportingManager', required: true, placeholder: 'Full Name' },
    { label: 'Current Reporting Manager\'s Manager', id: 'currentReportingManagersManager', required: true, placeholder: 'Full Name' },
    { label: 'Current Job Title', id: 'currentJobTitle', required: true, placeholder: 'Current Job Title' },
    { label: 'Current Cost Center', id: 'currentCostCenter', required: true, placeholder: 'Current Cost Center' },
    { label: 'Current Cube/Office Number', id: 'currentCubeNo', placeholder: 'e.g., KT-12-105A' },
    { label: 'Current Phone No.', id: 'currentPhoneNo', type: 'tel', placeholder: 'e.g., (555) 123-4567' },
    { label: 'Transfer Date', id: 'transferDate', type: 'date', required: true },
    { label: 'Items to update', id: 'itemsToUpdate', type: 'checkboxGroup', required: true, options: [ {value: 'manager', label: 'Manager', name: 'itemsToUpdate_manager'}, {value: 'costCenter', label: 'Cost Center', name: 'itemsToUpdate_costCenter'}, {value: 'roleSkillRate', label: 'Role/Skill/Rate', name: 'itemsToUpdate_roleSkillRate'}, {value: 'location', label: 'Location', name: 'itemsToUpdate_location'}, {value: 'engagementInfo', label: 'Engagement Info (SOW, CW#)', name: 'itemsToUpdate_engagementInfo'} ], info: "Check all that apply" },
    { label: 'New Reporting Manager', id: 'newReportingManager', placeholder: 'Full Name (if changing)' },
    { label: 'New Cost Center', id: 'newCostCenter', placeholder: 'New Cost Center' },
    { label: 'New Location', id: 'newLocation', placeholder: 'If Location is changing' },
    { label: 'New Project Type', id: 'newProjectType', type: 'select', options: ['Development', 'Maintenance', 'Consulting', 'Enhancement', 'Other'], placeholder: 'Select New Project Type' },
    { label: 'New Contract Workspace #', id: 'newContractWorkspaceNo', placeholder: 'New CW Number' },
    { label: 'New SOW Name', id: 'newSowName', placeholder: 'New SOW Name' },
    { label: 'New Fixed Bid or T&M', id: 'newBidType', type: 'select', options: ['Fixed Bid', 'T&M'], defaultValue: 'Fixed Bid' },
    { label: 'New Role', id: 'newRole', type: 'select', options: ['Developer', 'QA Analyst', 'Project Manager', 'Business Analyst', 'Architect', 'Consultant'], placeholder: 'Select New Role' },
    { label: 'New Skill', id: 'newSkill', type: 'select', options: ['Java', 'React', 'Angular', 'SQL', '.NET', 'Python', 'Project Management', 'Business Analysis'], placeholder: 'Select New Skill' },
    { label: 'New Rate / HR', id: 'newRateHr', type: 'number', placeholder: 'e.g., 80.00' },
    { label: 'EPPIC change needed?', id: 'eppicChangeNeeded', type: 'checkboxGroup', required: true, options: [ {value: 'addToEPPIC', label: 'Add to EPPIC', name: 'eppicChangeNeeded_addToEPPIC'}, {value: 'rateChange', label: 'Rate Change', name: 'eppicChangeNeeded_rateChange'}, {value: 'costCenterChange', label: 'Cost Center Change', name: 'eppicChangeNeeded_costCenterChange'}, {value: 'timeCardApproverChange', label: 'Time Card Approver Change', name: 'eppicChangeNeeded_timeCardApproverChange'}, {value: 'noChange', label: 'No EPPIC change needed', name: 'eppicChangeNeeded_noChange'} ], info: "Provide explanation in comments if 'No Change'" },
    { label: 'EPPIC Timesheet Approver', id: 'eppicTimesheetApproverTransfer', placeholder: 'Full Name' },
    { label: 'Additional Comments', id: 'additionalCommentsTransfer', type: 'textarea', placeholder: 'Reason for transfer, EPPIC explanation, etc.' },
];

const terminateRequestFields = [
    { label: 'Name (As in system)', id: 'name', required: true, placeholder: 'Current Full Name of Resource' },
    ...commonResourceFields,
    { label: 'Key Employee ID', id: 'keyEmployeeId', required: true, placeholder: 'KeyBank Employee ID (if applicable)' },
    { label: 'Project Type', id: 'projectTypeTerminate', type: 'select', options: ['Development SOW', 'Maintenance SOW', 'Consulting', 'Enhancement', 'Other'], defaultValue: 'Development SOW', placeholder: 'Select Project Type' },
    { label: 'Current Reporting Manager', id: 'currentReportingManagerTerm', required: true, placeholder: 'Full Name' },
    { label: 'Current Reporting Manager\'s Manager', id: 'currentReportingManagersManagerTerm', required: true, placeholder: 'Full Name' },
    { label: 'Effective Date of Termination', id: 'effectiveDate', type: 'date', required: true },
    { label: 'Reason/Description', id: 'reasonDescription', type: 'select', required: true, options: ['Contract End', 'Resignation', 'Performance Issue', 'Project Completion', 'Budget Cuts', 'Other'], placeholder: 'Select Reason' },
    { label: 'Is EPPIC separation needed?', id: 'eppicSeparationNeeded', type: 'radio', required: true, options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'no' },
    { label: 'Current Location - Site', id: 'currentLocationSite', type: 'select', required: true, options: ['Key Tower - Cleveland', 'Higgings Road - Chicago', 'Tech Hub - Austin', 'Remote', 'Other'], placeholder: 'Select Site' },
    { label: 'Will contractor workspace be released or reserved?', id: 'workspaceStatus', type: 'radio', options: [ {value: 'none', label: 'None'}, {value: 'release', label: 'Release'}, {value: 'reserve', label: 'Reserve'} ], defaultValue: 'none' },
    { label: 'Current workspace number (if applicable)', id: 'currentWorkspaceNumber', placeholder: 'e.g., KT-12-105A' },
    { label: 'Existing Phone Number', id: 'existingPhoneNumber', type: 'tel', placeholder: 'e.g., (555) 123-4567' },
    { label: 'Will phone be reassigned within 90 days?', id: 'phoneReassigned', type: 'radio', options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'no' },
    { label: 'Person collecting equipment (laptop, badge, etc.)', id: 'equipmentCollector', placeholder: 'Full Name of KeyBank Employee' },
    { label: 'Equipment Location:', id: 'equipmentLocation', placeholder: 'Where equipment will be stored/returned' },
    { label: 'Does contractor use a mobile device to access Key\'s network?', id: 'mobileDeviceAccess', type: 'radio', options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'no' },
    { label: 'Enable email \'Out of Office\' message?', id: 'outOfOffice', type: 'radio', options: [ {value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'} ], defaultValue: 'no', info: "If yes, provide message in comments." },
    { label: 'Additional Comments', id: 'additionalCommentsTerminate', type: 'textarea', placeholder: 'Details for \'Other\' reason, OOO message, etc.' },
];

function renderRequestForm(requestType, fields, screenId, fillSampleDataFunc) {
    const screenEl = document.getElementById(screenId);
    if (!screenEl) { console.error(`Screen element #${screenId} not found.`); return; }
    
    const formId = `${requestType.toLowerCase()}Form`;
    
    screenEl.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-3xl font-semibold text-sky-700">${requestType} Employee Request</h2>
                <button type="button" class="btn btn-outline-primary" onclick="${fillSampleDataFunc.name}('${formId}')">
                    Fill Sample Data
                </button>
            </div>
            
            <form id="${formId}" class="form-section-card space-y-6" onsubmit="handleFormSubmit(event, '${requestType}')">
                ${renderFormFields(fields)}
                
                <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button type="button" class="btn btn-secondary" onclick="navigateTo('home-screen')">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Submit ${requestType} Request
                    </button>
                </div>
            </form>
        </div>
    `;
}

function renderFormFields(fields) {
    return fields.map(field => {
        switch (field.type) {
            case 'select':
                return `
                    <div class="form-group">
                        <label for="${field.id}" class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <select id="${field.id}" name="${field.id}" class="input-field" ${field.required ? 'required' : ''}>
                            <option value="">${field.placeholder || `Select ${field.label}`}</option>
                            ${field.options.map(option => 
                                `<option value="${option}" ${field.defaultValue === option ? 'selected' : ''}>${option}</option>`
                            ).join('')}
                        </select>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group">
                        <label for="${field.id}" class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <textarea id="${field.id}" name="${field.id}" rows="4" class="input-field" 
                                  placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            case 'date':
                return `
                    <div class="form-group">
                        <label for="${field.id}" class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="date" id="${field.id}" name="${field.id}" class="input-field" 
                               ${field.required ? 'required' : ''}>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            case 'radio':
                return `
                    <div class="form-group">
                        <label class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <div class="mt-2 space-y-2">
                            ${field.options.map(option => `
                                <div class="flex items-center">
                                    <input type="radio" id="${field.id}_${option.value}" name="${field.id}" 
                                           value="${option.value}" class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                                           ${field.defaultValue === option.value ? 'checked' : ''} ${field.required ? 'required' : ''}>
                                    <label for="${field.id}_${option.value}" class="ml-3 text-sm text-gray-700">${option.label}</label>
                                </div>
                            `).join('')}
                        </div>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            case 'checkboxGroup':
                return `
                    <div class="form-group">
                        <label class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <div class="mt-2 space-y-2">
                            ${field.options.map(option => `
                                <div class="flex items-center">
                                    <input type="checkbox" id="${option.name || field.id + '_' + option.value}" 
                                           name="${option.name || field.id}" value="${option.value}"
                                           class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded">
                                    <label for="${option.name || field.id + '_' + option.value}" 
                                           class="ml-3 text-sm text-gray-700">${option.label}</label>
                                </div>
                            `).join('')}
                        </div>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            case 'number':
            case 'tel':
                return `
                    <div class="form-group">
                        <label for="${field.id}" class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="${field.type}" id="${field.id}" name="${field.id}" class="input-field" 
                               placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
            default:
                return `
                    <div class="form-group">
                        <label for="${field.id}" class="label-text">${field.label} ${field.required ? '*' : ''}</label>
                        <input type="text" id="${field.id}" name="${field.id}" class="input-field" 
                               placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                        ${field.info ? `<p class="text-xs text-gray-500 mt-1">${field.info}</p>` : ''}
                    </div>
                `;
        }
    }).join('');
}

async function handleFormSubmit(event, requestType) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Handle checkboxes as objects
    const checkboxGroups = ['itemsToUpdate', 'eppicChangeNeeded'];
    checkboxGroups.forEach(group => {
        const groupData = {};
        Object.keys(data).forEach(key => {
            if (key.startsWith(group + '_')) {
                const option = key.replace(group + '_', '');
                groupData[option] = true;
            }
        });
        if (Object.keys(groupData).length > 0) {
            data[group] = groupData;
        }
        // Remove individual checkbox entries
        Object.keys(data).forEach(key => {
            if (key.startsWith(group + '_')) {
                delete data[key];
            }
        });
    });
    
    const result = await submitRequestToAPI(requestType, data);
    
    if (result.success) {
        showCustomAlert('Success', `${requestType} request submitted successfully! Request ID: ${result.request_id}`, 'success');
        event.target.reset();
        setTimeout(() => {
            navigateTo('viewRequests-screen', 'All');
        }, 2000);
    } else {
        showCustomAlert('Error', result.message || 'Failed to submit request', 'error');
    }
}

// Sample data functions
function fillAddFormSampleData(formId) {
    const today = new Date();
    const futureDate = new Date(new Date().setDate(today.getDate() + 14)).toISOString().split('T')[0];
    const sample = {
        startDate: futureDate,
        company: 'Cognizant',
        cognizantEmployeeId: 'EMP789012',
        firstName: 'Rajesh',
        middleInitial: 'K',
        lastName: 'Kumar',
        racfId: 'RK12345',
        contractorPhone: '(555) 987-6543',
        contractorPhoneExt: '101',
        reportingManager: 'Priya Sharma',
        reportingManagersManager: 'Amit Singh',
        secondaryContactName: 'Vijay Mehta',
        modelAfterName: 'Anjali Rao',
        workspaceLocation: 'onsite',
        softphoneRequired: 'yes',
        pcModel: 'laptop',
        relatedToProject: 'yes',
        projectName: 'Phoenix Initiative',
        projectManager: 'Deepak Ahuja',
        eppicProjectNumber: 'EPP789',
        projectType: 'Development',
        contractWorkspaceNo: 'CW-2025-005',
        sowName: 'Phoenix SOW Phase 1',
        costCenter: 'CCDEV01',
        bidType: 'T&M',
        role: 'Developer',
        skill: 'React',
        rateHr: '85.50',
        resourceType: 'Active',
        eppicTimesheetApprover: 'Priya Sharma',
        additionalCommentsAdd: 'Experienced React developer for frontend tasks.'
    };
    fillSampleData(formId, sample);
    showCustomAlert('Sample Data Filled', 'Add Request form has been populated with sample data.', 'info');
}

function fillTransferFormSampleData(formId) {
    const today = new Date();
    const transferDateValue = new Date(new Date().setDate(today.getDate() + 7)).toISOString().split('T')[0];
    const sample = {
        name: 'Hemalatha Sivakumar',
        company: 'Cognizant',
        firstName: 'Hemalatha',
        lastName: 'Sivakumar',
        racfId: 'HS67890',
        keyEmployeeId: 'KEY002',
        currentLocation: 'Chennai',
        currentReportingManager: 'Anitha Raj',
        currentReportingManagersManager: 'Sunil Varma',
        currentJobTitle: 'Software Engineer',
        currentCostCenter: 'CC456',
        currentCubeNo: 'CHN-05-E21',
        currentPhoneNo: '(555) 222-3333',
        transferDate: transferDateValue,
        newReportingManager: 'Vikram Rathod',
        newCostCenter: 'CCFIN03',
        newLocation: '',
        newProjectType: 'Enhancement',
        newContractWorkspaceNo: 'CW-2025-008',
        newSowName: 'Omega SOW Enhancements',
        newBidType: 'Fixed Bid',
        newRole: 'Senior Developer',
        newSkill: 'Java',
        newRateHr: '95.00',
        eppicTimesheetApproverTransfer: 'Vikram Rathod',
        additionalCommentsTransfer: 'Transferring to finance project for senior Java role. Rate and cost center updated.'
    };
    fillSampleData(formId, sample);
    showCustomAlert('Sample Data Filled', 'Transfer Request form has been populated.', 'info');
}

function fillTermFormSampleData(formId) {
    const today = new Date();
    const effectiveDateValue = new Date(new Date().setDate(today.getDate() + 30)).toISOString().split('T')[0];
    const sample = {
        name: 'Neelima Nimmagadda',
        company: 'Wipro',
        firstName: 'Neelima',
        lastName: 'Nimmagadda',
        racfId: 'NN33445',
        keyEmployeeId: 'KEY004',
        projectTypeTerminate: 'Maintenance SOW',
        currentReportingManagerTerm: 'Ravi Teja',
        currentReportingManagersManagerTerm: 'Lakshmi Devi',
        effectiveDate: effectiveDateValue,
        reasonDescription: 'Contract End',
        eppicSeparationNeeded: 'yes',
        currentLocationSite: 'Tech Hub - Austin',
        workspaceStatus: 'release',
        currentWorkspaceNumber: 'AUS-02-A12',
        existingPhoneNumber: '(555) 444-5555',
        phoneReassigned: 'no',
        equipmentCollector: 'Admin Department',
        equipmentLocation: 'IT Storage Room B',
        mobileDeviceAccess: 'no',
        outOfOffice: 'yes',
        additionalCommentsTerminate: 'Contract ending as per schedule. OOO Message: "I am no longer with KeyBank. Please contact Ravi Teja for assistance."'
    };
    fillSampleData(formId, sample);
    showCustomAlert('Sample Data Filled', 'Terminate Request form has been populated.', 'info');
}

function fillSampleData(formId, sampleData) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID ${formId} not found in fillSampleData.`);
        return;
    }
    
    for (const [key, value] of Object.entries(sampleData)) {
        const fieldElements = form.elements[key];
        if (fieldElements) {
            if (fieldElements.constructor.name === "RadioNodeList") {
                let foundRadio = false;
                Array.from(fieldElements).forEach(rb => {
                    if (rb.value === String(value)) {
                        rb.checked = true;
                        foundRadio = true;
                    } else {
                        rb.checked = false;
                    }
                });
                if (!foundRadio) console.warn(`Radio value "${value}" for group "${key}" not found.`);
            } else if (fieldElements.type === 'checkbox') {
                if (typeof value === 'object' && value !== null && value.hasOwnProperty(fieldElements.value)) {
                    fieldElements.checked = Boolean(value[fieldElements.value]);
                } else {
                    fieldElements.checked = Boolean(value);
                }
            } else if (fieldElements.tagName === 'SELECT') {
                fieldElements.value = value;
            } else {
                fieldElements.value = value;
            }
        }
    }
}

function showCustomAlert(title, message, type = 'info') {
    const existingAlert = document.getElementById('custom-alert-modal');
    if (existingAlert) existingAlert.remove();
    
    let bgColorClass, textColorClass, iconSvg;
    switch (type) {
        case 'success':
            bgColorClass = 'bg-green-100';
            textColorClass = 'text-green-700';
            iconSvg = `<svg class="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            break;
        case 'error':
            bgColorClass = 'bg-red-100';
            textColorClass = 'text-red-700';
            iconSvg = `<svg class="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
            break;
        default:
            bgColorClass = 'bg-sky-100';
            textColorClass = 'text-sky-700';
            iconSvg = `<svg class="h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }
    
    const alertModal = document.createElement('div');
    alertModal.id = 'custom-alert-modal';
    alertModal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[100] p-4';
    alertModal.innerHTML = `
        <div class="relative mx-auto py-5 px-6 border w-full max-w-sm shadow-xl rounded-xl bg-white">
            <div class="flex flex-col items-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full ${bgColorClass} mb-4">
                    ${iconSvg}
                </div>
                <h3 class="text-xl leading-6 font-semibold ${textColorClass} mb-2">${title}</h3>
                <div class="text-center">
                    <p class="text-sm text-gray-600">${message}</p>
                </div>
                <div class="mt-6 w-full">
                    <button id="ok-btn" class="btn btn-primary w-full py-2.5">OK</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertModal);
    const okButton = document.getElementById('ok-btn');
    if (okButton) okButton.focus();
    
    const closeAlert = () => {
        if (alertModal.parentNode) {
            alertModal.parentNode.removeChild(alertModal);
        }
    };
    
    if (okButton) okButton.onclick = closeAlert;
    alertModal.onclick = (e) => {
        if (e.target === alertModal) closeAlert();
    };
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderHomeScreen();
    navigateTo('home-screen');
}); 