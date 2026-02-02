// API Book List JavaScript
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
});

function loadBooks(pageNo = 0, pageSize = 20, sortBy = 'id') {
    const url = `${API_BASE_URL}/books?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            return response.json();
        })
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            showError('Failed to load books. Please try again.');
        });
}

function displayBooks(books) {
    const tbody = document.getElementById('book-table-body');
    
    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No books found</td></tr>';
        return;
    }
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td><strong>${escapeHtml(book.title)}</strong></td>
            <td>${escapeHtml(book.author)}</td>
            <td>$${book.price.toFixed(2)}</td>
            <td><span class="badge bg-info">${escapeHtml(book.category)}</span></td>
            <td>
                <div class="btn-group" role="group">
                    <a href="/books/api-edit/${book.id}" class="btn btn-sm btn-warning">
                        <i class="bi bi-pencil"></i> Edit
                    </a>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    const url = `${API_BASE_URL}/books/${id}`;
    
    fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            showSuccess('Book deleted successfully!');
            loadBooks();
        } else if (response.status === 403) {
            showError('You do not have permission to delete books.');
        } else {
            throw new Error('Failed to delete book');
        }
    })
    .catch(error => {
        console.error('Error deleting book:', error);
        showError('Failed to delete book. Please try again.');
    });
}

function searchBooks(event) {
    event.preventDefault();
    const keyword = document.getElementById('searchKeyword').value.trim();
    
    if (!keyword) {
        loadBooks();
        return;
    }
    
    const url = `${API_BASE_URL}/books/search?keyword=${encodeURIComponent(keyword)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error searching books:', error);
            showError('Failed to search books. Please try again.');
        });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}
