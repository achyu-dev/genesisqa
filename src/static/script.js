document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    updateDashboard();
    
    // Upload form handling
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFileUpload);
    }
    
    // Search functionality for test cases
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterTestCases);
    }
    
    // Compliance filter
    const filterCompliance = document.getElementById('filterCompliance');
    if (filterCompliance) {
        filterCompliance.addEventListener('change', filterTestCases);
    }
});

function updateDashboard() {
    // Update dashboard statistics
    fetch('/api/test_cases')
        .then(response => response.json())
        .then(data => {
            const totalTestCasesElement = document.getElementById('totalTestCases');
            if (totalTestCasesElement) {
                totalTestCasesElement.textContent = data.length;
            }
        })
        .catch(error => {
            console.log('Dashboard update not available on this page');
        });
    
    fetch('/api/upload_status')
        .then(response => response.json())
        .then(data => {
            const filesProcessedElement = document.getElementById('filesProcessed');
            if (filesProcessedElement) {
                filesProcessedElement.textContent = data.filter(f => f.processed).length;
            }
        })
        .catch(error => {
            console.log('Upload status not available on this page');
        });
}

function handleFileUpload(event) {
    event.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');
    
    if (!fileInput.files[0]) {
        showAlert('Please select a file to upload.', 'warning');
        return;
    }
    
    formData.append('file', fileInput.files[0]);
    
    // Show progress
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    uploadProgress.style.display = 'block';
    uploadResult.innerHTML = '';
    
    // Simulate progress
    let progress = 0;
    const progressBar = uploadProgress.querySelector('.progress-bar');
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = progress + '%';
    }, 500);
    
    fetch('/upload_file', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Process';
            
            if (data.success) {
                uploadResult.innerHTML = `
                    <div class="alert alert-success">
                        <h5><i class="fas fa-check-circle"></i> Success!</h5>
                        <p>${data.message}</p>
                        <ul class="mb-0">
                            <li>Requirements extracted: ${data.requirements_count}</li>
                            <li>Test cases generated: ${data.test_cases_count}</li>
                        </ul>
                        <div class="mt-3">
                            <a href="/test_cases" class="btn btn-primary">View Test Cases</a>
                            <a href="/compliance" class="btn btn-outline-info ms-2">View Compliance Report</a>
                        </div>
                    </div>
                `;
                
                // Reset form
                fileInput.value = '';
                
                // Update dashboard
                updateDashboard();
            } else {
                uploadResult.innerHTML = `
                    <div class="alert alert-danger">
                        <h5><i class="fas fa-exclamation-triangle"></i> Error</h5>
                        <p>${data.error}</p>
                    </div>
                `;
            }
        }, 1000);
    })
    .catch(error => {
        clearInterval(interval);
        uploadProgress.style.display = 'none';
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Process';
        
        uploadResult.innerHTML = `
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle"></i> Upload Failed</h5>
                <p>An error occurred while processing your file. Please try again.</p>
            </div>
        `;
    });
}

function filterTestCases() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const complianceFilter = document.getElementById('filterCompliance')?.value || '';
    const testCards = document.querySelectorAll('.test-case-card');
    
    testCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const complianceData = card.getAttribute('data-compliance') || '';
        
        const matchesSearch = !searchTerm || cardText.includes(searchTerm);
        const matchesCompliance = !complianceFilter || complianceData.includes(complianceFilter);
        
        card.style.display = matchesSearch && matchesCompliance ? 'block' : 'none';
    });
}

function exportToJira() {
    showAlert('Jira integration will be available in the full version. This is a demo prototype.', 'info');
}

function exportToAzure() {
    showAlert('Azure DevOps integration will be available in the full version. This is a demo prototype.', 'info');
}

function exportToCSV() {
    fetch('/api/test_cases')
        .then(response => response.json())
        .then(data => {
            const csvContent = generateCSV(data);
            downloadCSV(csvContent, 'genesis_qa_test_cases.csv');
        });
}

function generateCSV(testCases) {
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Expected Result', 'Compliance Tags', 'Created Date'];
    const rows = testCases.map(tc => [
        tc.id,
        tc.title,
        tc.description,
        tc.priority,
        tc.expected_result,
        tc.compliance_tags.join('; '),
        tc.created_date
    ]);
    
    return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container-fluid');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Add some interactivity for demo purposes
function addRecentActivity(message) {
    const activityList = document.getElementById('recentActivity');
    if (activityList) {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-info text-info"></i> ${message}`;
        activityList.insertBefore(li, activityList.firstChild);
        
        // Keep only last 5 activities
        while (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}