const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const booksContainer = document.getElementById('booksContainer');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) return;

    await searchBooks(query);
});

async function searchBooks(query) {
    showLoading(true);
    hideError();
    clearResults();

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        showLoading(false);

        if (data.items && data.items.length > 0) {
            displayBooks(data.items);
        } else {
            showNoResults();
        }
    } catch (error) {
        showLoading(false);
        showError('Ett fel uppstod när böckerna hämtades.');
        console.error('Fetch error:', error);
    }
}

function displayBooks(books) {
    const booksHTML = books.map(book => {
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo.title || 'Okänd titel';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Okänd författare';
        const thumbnail = volumeInfo.imageLinks?.thumbnail || '';

        return `
            <div class="book-card">
                ${thumbnail ? 
                    `<img src="${thumbnail}" alt="Bokomslag för ${title}" class="book-cover">` :
                    `<div class="no-cover">Inget omslag</div>`
                }
                <div>
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">${authors}</p>
                </div>
            </div>
        `;
    }).join('');

    booksContainer.innerHTML = booksHTML;
}

function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
    searchButton.disabled = show;
    searchButton.textContent = show ? 'Söker...' : 'Sök böcker';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function clearResults() {
    booksContainer.innerHTML = '';
}

function showNoResults() {
    booksContainer.innerHTML = '<div class="no-results">Inga böcker hittades. Försök med andra sökord.</div>';
}

window.addEventListener('load', () => {
    searchInput.focus();
});
