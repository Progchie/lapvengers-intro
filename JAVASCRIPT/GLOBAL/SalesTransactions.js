// /JAVASCRIPT/GLOBAL/SalesTransactions.js
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/HTML/GLOBAL/Header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            if (typeof initHeaderNavigation === "function") {
                initHeaderNavigation();
            }
        });

    // Load Footer
    fetch('/HTML/GLOBAL/Footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        });

    // Load Main Transactions Template
    fetch('/HTML/TEMPLATE/Transactions.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content-container').innerHTML = html;

            // Now initialize all JS functions for this page
            loadTransactions();
            initSalesTransactions();
        });
});

// ===================================
// MAIN INITIALIZATION
// ===================================
function initSalesTransactions() {
    initSearchFunctionality();
    initTableSorting();
    initExportFunctionality();
    highlightNewTransaction();
}

// ===================================
// LOAD SAVED TRANSACTIONS FROM LOCAL STORAGE
// ===================================
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('salesTransactions')) || [];
    const tbody = document.getElementById('transactionsBody');

    if (!tbody) return;

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="empty-state">
                        <i class="fas fa-database"></i>
                        <h4>No Transactions Available</h4>
                        <p>Complete a purchase to see transactions here.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = transactions
        .map(t => `
            <tr class="transaction-row">
                <td><strong>${t.id}</strong></td>
                <td>${t.date}</td>
                <td>${t.customer}</td>
                <td>${t.product}</td>
                <td>${t.quantity}</td>
                <td>${t.unitPrice}</td>
                <td>${t.payment}</td>
                <td>${t.delivery}</td>
                <td><strong>${t.total}</strong></td>
                <td>
                    <span class="status-badge status-${t.status.toLowerCase()}">
                        ${t.status}
                    </span>
                </td>
            </tr>
        `)
        .join('');
}

// ===================================
// SEARCH FUNCTION
// ===================================
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const rows = document.querySelectorAll('#salesTable tbody tr');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const term = searchInput.value.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    });
}

// ===================================
// TABLE SORTING
// ===================================
function initTableSorting() {
    const headers = document.querySelectorAll('#salesTable th');

    headers.forEach((header, i) => {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => sortTable(i));
    });
}

let sortDirection = true; // true = asc, false = desc

function sortTable(columnIndex) {
    const table = document.getElementById("salesTable");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        let x = a.children[columnIndex].innerText.trim();
        let y = b.children[columnIndex].innerText.trim();

        // Try numeric sort
        const numX = parseFloat(x.replace(/[^0-9.-]+/g, ""));
        const numY = parseFloat(y.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(numX) && !isNaN(numY)) {
            return sortDirection ? numX - numY : numY - numX;
        }

        // String sort
        return sortDirection
            ? x.localeCompare(y)
            : y.localeCompare(x);
    });

    sortDirection = !sortDirection;

    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// ===================================
// EXPORT TO CSV
// ===================================
function initExportFunctionality() {
    const btn = document.getElementById("exportBtn");
    if (!btn) return;

    btn.addEventListener("click", exportToCSV);
}

function exportToCSV() {
    const rows = document.querySelectorAll("table tr");
    let csv = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll("td, th");
        let data = [];
        cols.forEach(col => data.push(`"${col.innerText.trim()}"`));
        csv.push(data.join(","));
    });

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = "sales_transactions.csv";
    downloadLink.click();
}

// ===================================
// HIGHLIGHT NEWEST TRANSACTION
// ===================================
function highlightNewTransaction() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("newTransaction")) return;

    setTimeout(() => {
        const firstRow = document.querySelector(".transaction-row");
        if (!firstRow) return;

        firstRow.style.backgroundColor = "#e8f4ff";

        setTimeout(() => {
            firstRow.style.backgroundColor = "";
        }, 2500);
    }, 400);
}
