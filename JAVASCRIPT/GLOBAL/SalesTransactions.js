// /JAVASCRIPT/GLOBAL/SalesTransactions.js
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/HTML/GLOBAL/Header.html')
        .then(response => {
            if (!response.ok) throw new Error('Header not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // Initialize header navigation
            initHeaderNavigation();
        })
        .catch(error => console.error('Header loading error:', error));

    // Load Footer
    fetch('/HTML/GLOBAL/Footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        })
        .catch(error => console.error('Footer loading error:', error));

    // Load Sales Transactions Content
    fetch('/HTML/TEMPLATE/Transactions.html')  // ITO YUNG SEPARATED TRANSACTIONS FILE
        .then(response => {
            if (!response.ok) throw new Error('Transactions content not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            initSalesTransactions();
        })
        .catch(error => console.error('Transactions content loading error:', error));
});

function initSalesTransactions() {
    // Sales Transactions page specific functionality
    console.log('Sales Transactions page initialized');
    
    // Initialize transactions functionality
    initSearchFunctionality();
    initTableSorting();
    initExportFunctionality();
}

function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#salesTable tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

function initTableSorting() {
    // Add sorting functionality to table headers
    const headers = document.querySelectorAll('#salesTable th');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            sortTable(index);
        });
    });
}

function sortTable(columnIndex) {
    console.log(`Sorting by column ${columnIndex}`);
    // Add your table sorting logic here
}

function initExportFunctionality() {
    // Add export to CSV/Excel functionality
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToCSV();
        });
    }
}

function exportToCSV() {
    console.log('Exporting to CSV...');
    // Add CSV export logic here
}