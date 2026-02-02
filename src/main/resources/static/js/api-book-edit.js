// API Book Edit JavaScript
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    const bookId = getBookIdFromUrl();
    if (bookId) {
        loadCategories();
        loadBook(bookId);
    }
});

function getBookIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

function loadCategories() {
    fetch('http://localhost:8080/api/v1/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load categories (Status: ${response.status})`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned HTML instead of JSON. Please check if you are logged in.');
            }
            
            return response.json();
        })
        .then(categories => {
            const select = document.getElementById('categoryId');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            alert('Failed to load categories: ' + error.message);
        });
}

function loadBook(id) {
    console.log('Loading book with ID:', id);
    fetch(`${API_BASE_URL}/books/${id}`)
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response content-type:', response.headers.get('content-type'));
            
            if (!response.ok) {
                throw new Error(`Book not found (Status: ${response.status})`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned HTML instead of JSON. Please check if you are logged in.');
            }
            
            return response.json();
        })
        .then(book => {
            console.log('Book loaded:', book);
            if (!book) {
                throw new Error('Book data is empty');
            }
            
            document.getElementById('bookId').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('price').value = book.price;
            
            setTimeout(() => {
                const categorySelect = document.getElementById('categoryId');
                for (let option of categorySelect.options) {
                    if (option.textContent === book.category) {
                        option.selected = true;
                        break;
                    }
                }
            }, 500);
        })
        .catch(error => {
            console.error('Error loading book:', error);
            alert('Error: ' + error.message + '\n\nPlease make sure you are logged in and have access to this book.');
            window.location.href = '/books/api-list';
        });
}

function handleSubmit(event) {
    event.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        categoryId: parseInt(document.getElementById('categoryId').value)
    };
    
    fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert('Book updated successfully!');
            window.location.href = '/books/api-list';
        } else if (response.status === 403) {
            throw new Error('You do not have permission to edit books.');
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to update book');
            });
        }
    })
    .catch(error => {
        console.error('Error updating book:', error);
        alert('Error: ' + error.message);
    });
}
