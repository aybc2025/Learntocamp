// script.js

// Store checklist state in memory (for artifact compatibility)
let checklistState = {};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChecklist();
    initializeSmoothScrolling();
    initializeChecklistControls();
    loadChecklistState();
});

// Initialize checklist functionality
function initializeChecklist() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach((checkbox, index) => {
        // Give each checkbox a unique ID for state management
        checkbox.id = `item-${index}`;
        
        // Add event listener for checkbox changes
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this);
            saveChecklistState();
        });
    });
}

// Handle checkbox state changes
function handleCheckboxChange(checkbox) {
    const checklistItem = checkbox.closest('.checklist-item');
    
    if (checkbox.checked) {
        checklistItem.classList.add('completed');
        checklistState[checkbox.id] = true;
    } else {
        checklistItem.classList.remove('completed');
        checklistState[checkbox.id] = false;
    }
    
    updateProgress();
}

// Initialize smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                updateActiveNavItem(this);
            }
        });
    });
}

// Update active navigation item
function updateActiveNavItem(activeLink) {
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Initialize checklist control buttons
function initializeChecklistControls() {
    const checkAllBtn = document.getElementById('checkAll');
    const uncheckAllBtn = document.getElementById('uncheckAll');
    const resetBtn = document.getElementById('resetChecklist');
    
    if (checkAllBtn) {
        checkAllBtn.addEventListener('click', checkAllItems);
    }
    
    if (uncheckAllBtn) {
        uncheckAllBtn.addEventListener('click', uncheckAllItems);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChecklist);
    }
}

// Check all checklist items
function checkAllItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        handleCheckboxChange(checkbox);
    });
    
    saveChecklistState();
    showNotification('All items checked!', 'success');
}

// Uncheck all checklist items
function uncheckAllItems() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        handleCheckboxChange(checkbox);
    });
    
    saveChecklistState();
    showNotification('All items unchecked!', 'info');
}

// Reset checklist to initial state
function resetChecklist() {
    if (confirm('Are you sure you want to reset the entire checklist? This will uncheck all items.')) {
        checklistState = {};
        uncheckAllItems();
        showNotification('Checklist reset!', 'warning');
    }
}

// Save checklist state to memory
function saveChecklistState() {
    // In a real implementation, you could save to localStorage:
    // localStorage.setItem('campingChecklistState', JSON.stringify(checklistState));
    
    // For artifact compatibility, we just keep it in memory
    console.log('Checklist state saved:', checklistState);
}

// Load checklist state from memory
function loadChecklistState() {
    // In a real implementation, you could load from localStorage:
    // const saved = localStorage.getItem('campingChecklistState');
    // if (saved) {
    //     checklistState = JSON.parse(saved);
    //     
    //     Object.keys(checklistState).forEach(checkboxId => {
    //         const checkbox = document.getElementById(checkboxId);
    //         if (checkbox) {
    //             checkbox.checked = checklistState[checkboxId];
    //             handleCheckboxChange(checkbox);
    //         }
    //     });
    // }
    
    // For artifact, we start with empty state
    console.log('Checklist state loaded from memory');
}

// Update progress indicator
function updateProgress() {
    const totalItems = document.querySelectorAll('.item-checkbox').length;
    const checkedItems = document.querySelectorAll('.item-checkbox:checked').length;
    const percentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    
    // Update progress display if element exists
    let progressDisplay = document.getElementById('progress-display');
    if (!progressDisplay) {
        // Create progress display if it doesn't exist
        progressDisplay = createProgressDisplay();
    }
    
    progressDisplay.textContent = `Progress: ${checkedItems}/${totalItems} items (${percentage}%)`;
    
    // Change color based on progress
    if (percentage === 100) {
        progressDisplay.style.color = '#4a7c29';
        progressDisplay.style.fontWeight = 'bold';
    } else if (percentage >= 75) {
        progressDisplay.style.color = '#6ba644';
        progressDisplay.style.fontWeight = 'normal';
    } else {
        progressDisplay.style.color = '#666';
        progressDisplay.style.fontWeight = 'normal';
    }
}

// Create progress display element
function createProgressDisplay() {
    const progressDisplay = document.createElement('div');
    progressDisplay.id = 'progress-display';
    progressDisplay.style.cssText = `
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
        font-size: 1.1rem;
        border: 2px solid #e0e0e0;
    `;
    
    const checklistContainer = document.querySelector('.checklist-container');
    const controls = document.querySelector('.checklist-controls');
    checklistContainer.insertBefore(progressDisplay, controls.nextSibling);
    
    return progressDisplay;
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
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
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Handle intersection observer for nav highlighting
function initializeIntersectionObserver() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeNavLink = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
                if (activeNavLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    activeNavLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Export checklist data as text
function exportChecklistAsText() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let exportText = 'Learn-to Camp Packing Checklist\n';
    exportText += '=====================================\n\n';
    
    const categories = document.querySelectorAll('.checklist-category');
    
    categories.forEach(category => {
        const categoryName = category.querySelector('h3').textContent;
        exportText += `${categoryName}\n`;
        exportText += '-'.repeat(categoryName.length) + '\n';
        
        const items = category.querySelectorAll('.checklist-item');
        items.forEach(item => {
            const checkbox = item.querySelector('.item-checkbox');
            const text = item.querySelector('span').textContent;
            const status = checkbox.checked ? '[✓]' : '[ ]';
            exportText += `${status} ${text}\n`;
        });
        
        exportText += '\n';
    });
    
    // Create download link
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'camping-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Text checklist exported!', 'success');
}

// Export checklist data as Excel
function exportChecklistToExcel() {
    try {
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        
        // Prepare data for Excel
        const excelData = [];
        
        // Add header row
        excelData.push(['Category', 'Item', 'Status', 'Notes']);
        
        // Get all categories
        const categories = document.querySelectorAll('.checklist-category');
        
        categories.forEach(category => {
            const categoryName = category.querySelector('h3').textContent.trim();
            const items = category.querySelectorAll('.checklist-item');
            
            items.forEach(item => {
                const checkbox = item.querySelector('.item-checkbox');
                const text = item.querySelector('span').textContent.trim();
                const status = checkbox.checked ? 'Packed' : 'Not Packed';
                
                excelData.push([categoryName, text, status, '']);
            });
            
            // Add empty row between categories
            excelData.push(['', '', '', '']);
        });
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        
        // Set column widths
        ws['!cols'] = [
            { width: 20 }, // Category
            { width: 50 }, // Item
            { width: 15 }, // Status
            { width: 30 }  // Notes
        ];
        
        // Style the header row
        const headerRange = XLSX.utils.decode_range(ws['!ref']);
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!ws[cellAddress]) continue;
            
            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4a7c29" } },
                alignment: { horizontal: "center" }
            };
        }
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Camping Checklist');
        
        // Generate filename with current date
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const filename = `Learn-to-Camp-Checklist-${dateStr}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, filename);
        
        showNotification('Excel checklist exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('Error exporting to Excel. Please try again.', 'error');
    }
}

// Print functionality
function printChecklist() {
    window.print();
}

// Add export and print buttons to checklist controls
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.querySelector('.checklist-controls');
    if (controls) {
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export as Text';
        exportBtn.addEventListener('click', exportChecklistAsText);
        controls.appendChild(exportBtn);
        
        const exportExcelBtn = document.createElement('button');
        exportExcelBtn.textContent = 'Export to Excel';
        exportExcelBtn.addEventListener('click', exportChecklistToExcel);
        controls.appendChild(exportExcelBtn);
        
        const printBtn = document.createElement('button');
        printBtn.textContent = 'Print Checklist';
        printBtn.addEventListener('click', printChecklist);
        controls.appendChild(printBtn);
    }
});

// Initialize intersection observer when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeIntersectionObserver, 100);
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        updateProgress();
        showNotification('Welcome to Learn-to Camp! Use the checklist to track your packing progress.', 'info');
    }, 500);
});

// Note about localStorage for users who want to implement it
console.log(`
🏕️ Learn-to Camp Checklist Website

Note: This website currently stores checklist state in memory only.
If you want to persist your checklist between browser sessions, 
you can implement localStorage by uncommenting the relevant lines
in the saveChecklistState() and loadChecklistState() functions.

This website includes:
✅ Interactive packing checklist
✅ Complete event information
✅ Smooth navigation
✅ Progress tracking
✅ Export functionality (Text & Excel)
✅ Print support
✅ Mobile responsive design

Enjoy your camping adventure! 🌲⛺
`);