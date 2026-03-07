function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function displayResult(data) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="box">
            <div class="columns">
                <div class="column">
                    <div class="content">
                        <h3 class="title is-4">Quote</h3>
                        <blockquote class="is-family-monospace" style="font-size: 1rem; line-height: 1.6;">
                            "${escapeHtml(data.quote)}" <a href="${escapeHtml(data.source_url)}">${escapeHtml(data.citation)}</a>
                        </blockquote>
                    </div>
                </div>
            </div>
            
            <div class="columns">
                <div class="column">
                    <div class="notification is-light">
                        <p><strong>Source:</strong> ${escapeHtml(data.title || 'N/A')}</p>
                        <p><strong>Publisher:</strong> ${escapeHtml(data.publisher || 'N/A')}</p>
                        <p><strong>Year:</strong> ${escapeHtml(data.year || 'N/A')}</p>
                        ${data.author ? `<p><strong>Author:</strong> ${escapeHtml(data.author)}</p>` : ''}
                        <p><strong>URL:</strong> <a href="${escapeHtml(data.source_url)}" target="_blank">${escapeHtml(data.source_url)}</a></p>
                    </div>
                </div>
            </div>
            
            <div class="buttons">
                <button class="button" onclick="copyToClipboard('${escapeHtml(data.quote).replace(/'/g, "\\'")}')">
                    Copy Quote
                </button>
                <button class="button" onclick="copyToClipboard('${escapeHtml(data.quote)} ${escapeHtml(data.citation)}')">
                    Copy Quote + Citation
                </button>
                <button class="button" onclick="copyToClipboard('${escapeHtml(data.citation)}')">
                    Copy Citation
                </button>
            </div>
        </div>
    `;
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

async function searchEvidence() {
    const searchInput = document.getElementById('search-input');
    const contextInput = document.getElementById('context-input');
    const searchButton = document.getElementById('search-button');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    
    const query = searchInput.value.trim();
    const context = contextInput.value.trim();
    
    if (!query) {
        displayError('Please enter a search query');
        return;
    }
    
    searchButton.disabled = true;
    searchButton.classList.add('is-loading');
    loadingDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    errorDiv.style.display = 'none';
    
    try {
        const response = await fetch('/api/searchEvidence/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                query: query,
                context: context
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayResult(data);
    } catch (error) {
        displayError(`Search failed: ${error.message}`);
    } finally {
        searchButton.disabled = false;
        searchButton.classList.remove('is-loading');
        loadingDiv.style.display = 'none';
    }
}

document.getElementById('search-button').addEventListener('click', searchEvidence);

document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchEvidence();
    }
});

document.getElementById('context-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchEvidence();
    }
});
