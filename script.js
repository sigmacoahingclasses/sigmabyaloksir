// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('contentArea');
    const classButtons = document.querySelectorAll('.class-btn');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close-btn');
    const pdfIframe = document.getElementById('pdfIframe');
    const modalTitle = document.getElementById('modalTitle');

    let currentClass = 'class9';

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Render Logic
    function renderContent(classKey, searchQuery = '') {
        contentArea.innerHTML = '';
        const classData = library[classKey];

        if (!classData) {
            contentArea.innerHTML = '<p>No content available for this class yet.</p>';
            return;
        }

        searchQuery = searchQuery.toLowerCase();

        for (const [subjectKey, subject] of Object.entries(classData)) {
            for (const [chapterKey, chapter] of Object.entries(subject.notes)) {
                
                // Search Filter Logic
                const matchClass = classKey.toLowerCase().includes(searchQuery);
                const matchSubject = subject.name.toLowerCase().includes(searchQuery);
                const matchChapter = chapter.title.toLowerCase().includes(searchQuery);

                if (searchQuery && !matchClass && !matchSubject && !matchChapter) continue;

                // Create Card
                const card = document.createElement('div');
                card.className = 'card glass';
                card.innerHTML = `
                    <div class="card-header">
                        <div>
                            <span style="color: var(--primary-color); font-weight: bold; font-size: 0.9rem;">${subject.name}</span>
                            <h3>${chapter.title}</h3>
                        </div>
                        <i class="far fa-bookmark" title="Bookmark" style="cursor:pointer;"></i>
                    </div>
                    <div class="meta-info">
                        <p><i class="fas fa-file-pdf"></i> Size: ${chapter.size || 'Unknown'}</p>
                        <p><i class="far fa-calendar-alt"></i> Uploaded: ${chapter.uploadDate || 'N/A'}</p>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-secondary preview-btn" data-link="${chapter.previewLink}" data-title="${chapter.title}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <a href="${chapter.downloadLink}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                `;
                contentArea.appendChild(card);
            }
        }

        if(contentArea.innerHTML === '') {
            contentArea.innerHTML = '<p>No results found for your search.</p>';
        }

        attachPreviewListeners();
    }

    // Modal Logic
    function attachPreviewListeners() {
        const previewBtns = document.querySelectorAll('.preview-btn');
        previewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const link = e.currentTarget.getAttribute('data-link');
                const title = e.currentTarget.getAttribute('data-title');
                modalTitle.textContent = `Preview: ${title}`;
                pdfIframe.src = link;
                modal.style.display = 'flex';
            });
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        pdfIframe.src = ''; // Stop loading when closed
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            pdfIframe.src = '';
        }
    });

    // Event Listeners for Tabs and Search
    classButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            classButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentClass = e.target.getAttribute('data-class');
            renderContent(currentClass, searchInput.value);
        });
    });

    searchInput.addEventListener('input', (e) => {
        renderContent(currentClass, e.target.value);
    });

    // Initial Render
    renderContent(currentClass);
});