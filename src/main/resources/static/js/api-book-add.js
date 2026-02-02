// API Book Add JavaScript
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

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

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        categoryId: parseInt(document.getElementById('categoryId').value)
    };
    
    fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.status === 201 || response.ok) {
            alert('Book added successfully!');
            window.location.href = '/books/api-list';
        } else if (response.status === 403) {
            throw new Error('You do not have permission to add books.');
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to add book');
            });
        }
    })
    .catch(error => {
        console.error('Error adding book:', error);
        alert('Error: ' + error.message);
    });
}
