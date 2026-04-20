// Language Switch
function switchToArabic() {
    window.location.href = "index_ar.html";
}

function switchToEnglish() {
    window.location.href = "index_en.html";
}

// Data
let books = {};
let loanQueue = [];
let returnStack = [];

// Helpers
function clearAddFields() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookCopies').value = '';
}

function clearLoanField() {
    document.getElementById('loanId').value = '';
}

// Add Book
function addBook() {
    const id = document.getElementById('bookId').value.trim();
    const title = document.getElementById('bookTitle').value.trim();
    const total = parseInt(document.getElementById('bookCopies').value);

    if (!id || !title || isNaN(total) || total <= 0) {
        alert("Invalid input");
        return;
    }

    books[id] = {
        title: title,
        totalCopies: total,
        availableCopies: total
    };

    clearAddFields();
    alert("Book added successfully");
    generateReport();
}

// Loan Book
function loanBook() {
    const id = document.getElementById('loanId').value.trim();

    if (!books[id]) {
        alert("Book not found");
        clearLoanField();
        return;
    }

    if (books[id].availableCopies <= 0) {
        loanQueue.push(id);
        alert("No copies available - added to queue");
    } else {
        books[id].availableCopies--;
        alert("Book loaned");
    }

    clearLoanField();
    generateReport();
}

// Return Book
function returnBook() {
    const id = document.getElementById('loanId').value.trim();

    if (!books[id]) {
        alert("Book not found");
        clearLoanField();
        return;
    }

    books[id].availableCopies++;
    returnStack.push(id);

    alert("Book returned");

    if (loanQueue.length > 0) {
        const queuedId = loanQueue.shift();
        if (books[queuedId]) {
            books[queuedId].availableCopies--;
            alert("Queued loan processed");
        }
    }

    clearLoanField();
    generateReport();
}

// Generate Report
function generateReport() {
    const report = document.getElementById('report');

    if (Object.keys(books).length === 0) {
        report.innerHTML = "<p>No books available</p>";
        return;
    }

    let html = "<h3>Inventory Report</h3><ul>";

    for (let id in books) {
        const b = books[id];
        html += `
            <li>
                <strong>ID:</strong> ${id} <br>
                <strong>Title:</strong> ${b.title} <br>
                <strong>Available:</strong> ${b.availableCopies} / ${b.totalCopies}
            </li>
        `;
    }

    html += "</ul>";
    report.innerHTML = html;
}

// View Last Returned
function viewLastReturned() {
    if (returnStack.length === 0) {
        alert("No returned books");
        return;
    }

    const lastId = returnStack[returnStack.length - 1];
    alert("Last returned: " + books[lastId].title);
}

// Delete All Books
function deleteAllBooks() {
    const confirmDelete = confirm("Delete ALL books?");

    if (!confirmDelete) return;

    books = {};
    loanQueue = [];
    returnStack = [];

    document.getElementById('report').innerHTML = "";
    clearAddFields();
    clearLoanField();

    alert("All books deleted");
}

// Init
generateReport();