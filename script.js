let books = {};
let loanQueue = [];
let returnStack = [];

// Load data from localStorage
if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books')) || {};
    loanQueue = JSON.parse(localStorage.getItem('loanQueue')) || [];
    returnStack = JSON.parse(localStorage.getItem('returnStack')) || [];
}

function saveData() {
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('loanQueue', JSON.stringify(loanQueue));
    localStorage.setItem('returnStack', JSON.stringify(returnStack));
}

function clearAddFields() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookCopies').value = '';
}

function clearLoanField() {
    document.getElementById('loanId').value = '';
}

function addBook() {
    const id = document.getElementById('bookId').value.trim();
    const title = document.getElementById('bookTitle').value.trim();
    const total = parseInt(document.getElementById('bookCopies').value);

    if (!id || !title || isNaN(total) || total <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }

    books[id] = {
        title: title,
        totalCopies: total,
        availableCopies: total
    };

    saveData();
    clearAddFields();
    alert("Book added successfully.");
    generateReport();
}

function loanBook() {
    const id = document.getElementById('loanId').value.trim();

    if (!books[id]) {
        alert("Book not found.");
        clearLoanField();
        return;
    }

    if (books[id].availableCopies <= 0) {
        loanQueue.push(id);
        alert("No copies available. Book added to queue.");
    } else {
        books[id].availableCopies--;
        alert(`Book '${books[id].title}' loaned successfully.`);
    }

    saveData();
    clearLoanField();
    generateReport();
}

function returnBook() {
    const id = document.getElementById('loanId').value.trim();

    if (!books[id]) {
        alert("Book not found.");
        clearLoanField();
        return;
    }

    if (books[id].availableCopies >= books[id].totalCopies) {
        alert("All copies are already in the library.");
        clearLoanField();
        return;
    }

    books[id].availableCopies++;
    returnStack.push(id);
    alert(`Book '${books[id].title}' returned successfully.`);

    if (loanQueue.length > 0) {
        const queuedId = loanQueue[0];

        if (books[queuedId] && books[queuedId].availableCopies > 0) {
            loanQueue.shift();
            books[queuedId].availableCopies--;
            alert(`Queued loan processed: '${books[queuedId].title}' loaned.`);
        }
    }

    saveData();
    clearLoanField();
    generateReport();
}

function generateReport() {
    const report = document.getElementById('report');

    if (Object.keys(books).length === 0) {
        report.innerHTML = "<p>No books in the system yet.</p>";
        return;
    }

    let html = "<h3>Inventory Report</h3><ul>";

    for (let id in books) {
        const b = books[id];
        html += `
            <li>
                <strong>Book ID:</strong> ${id}<br>
                <strong>Title:</strong> ${b.title}<br>
                <strong>Available:</strong> ${b.availableCopies} / ${b.totalCopies}
            </li>
        `;
    }

    html += "</ul>";
    report.innerHTML = html;
}

function viewLastReturned() {
    if (returnStack.length === 0) {
        alert("No returned books yet.");
        return;
    }

    const lastId = returnStack[returnStack.length - 1];
    alert(`Last returned book: '${books[lastId].title}'`);
}

function deleteAllBooks() {
    const confirmDelete = confirm("Are you sure you want to delete ALL books? This action cannot be undone.");

    if (!confirmDelete) {
        return;
    }

    books = {};
    loanQueue = [];
    returnStack = [];

    saveData();
    clearAddFields();
    clearLoanField();
    document.getElementById('report').innerHTML = "<p>No books in the system.</p>";
    alert("All books deleted successfully.");
}

// Generate initial report on page load
generateReport();