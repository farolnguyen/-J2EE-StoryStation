// Fetch and display books on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

function loadBooks(pageNo = 0, pageSize = 20, sortBy = 'id') {
    const url = `http://localhost:8080/api/v1/books?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            document.getElementById('book-table-body').innerHTML = 
                '<tr><td colspan="6" class="text-center text-danger">Error loading books. Please try again.</td></tr>';
        });
}

function displayBooks(books) {
    const tbody = document.getElementById('book-table-body');
    
    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No books found</td></tr>';
        return;
    }
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price}</td>
            <td>${book.category}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    const url = `http://localhost:8080/api/v1/books/${id}`;
    
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Book deleted successfully');
            loadBooks(); // Reload the list
        } else {
            throw new Error('Failed to delete book');
        }
    })
    .catch(error => {
        console.error('Error deleting book:', error);
        alert('Error deleting book. Please try again.');
    });
}

function searchBooks(event) {
    event.preventDefault();
    const keyword = document.getElementById('searchKeyword').value;
    
    if (!keyword.trim()) {
        loadBooks(); // Load all books if search is empty
        return;
    }
    
    const url = `http://localhost:8080/api/v1/books/search?keyword=${encodeURIComponent(keyword)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error searching books:', error);
            alert('Error searching books. Please try again.');
        });
}
