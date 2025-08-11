// Main application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    });

    // Initialize form validations
    initializeFormValidation();
}

function confirmExit() {
    if (confirm('Are you sure you want to exit the application?')) {
        window.close();
        // If window.close() doesn't work, redirect to a logout or exit page
        window.location.href = '/';
    }
}

function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// API Helper Functions
async function submitRequest(formData) {
    try {
        const response = await fetch('/api/submit-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFlashMessage('Request submitted successfully!', 'success');
            return true;
        } else {
            showFlashMessage(result.message || 'An error occurred', 'error');
            return false;
        }
    } catch (error) {
        showFlashMessage('Network error occurred', 'error');
        return false;
    }
}

async function updateRequestStatus(requestId, status) {
    try {
        const response = await fetch(`/api/requests/${requestId}/update-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFlashMessage('Status updated successfully!', 'success');
            // Refresh the page to show updated data
            setTimeout(() => location.reload(), 1000);
            return true;
        } else {
            showFlashMessage(result.message || 'An error occurred', 'error');
            return false;
        }
    } catch (error) {
        showFlashMessage('Network error occurred', 'error');
        return false;
    }
}

function showFlashMessage(message, type = 'info') {
    const flashContainer = document.querySelector('.flash-messages') || createFlashContainer();
    
    const flashDiv = document.createElement('div');
    flashDiv.className = `flash-message flash-${type}`;
    flashDiv.innerHTML = `
        ${message}
        <button class="flash-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    flashContainer.appendChild(flashDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (flashDiv.parentNode) {
            flashDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => flashDiv.remove(), 300);
        }
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}

// Form submission handlers
function handleRequestForm(event, requestType) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const requestData = {
        type: requestType,
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority') || 'medium',
        created_by: formData.get('created_by') || 'System'
    };
    
    submitRequest(requestData).then(success => {
        if (success) {
            form.reset();
            setTimeout(() => {
                window.location.href = '/view-all-requests';
            }, 2000); // Increased delay to show success message
        }
    }).catch(error => {
        console.error('Form submission error:', error);
        showFlashMessage('Failed to submit request. Please try again.', 'error');
    });
}

// Status update handler
function handleStatusUpdate(requestId, newStatus) {
    if (confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
        updateRequestStatus(requestId, newStatus);
    }
}

// Search and filter functionality
function filterRequests(searchTerm, statusFilter = '') {
    const rows = document.querySelectorAll('.requests-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = searchTerm === '' || text.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || status.includes(statusFilter.toLowerCase());
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style); 