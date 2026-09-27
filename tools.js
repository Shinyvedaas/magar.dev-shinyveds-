document.querySelectorAll('.tool-card-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const card = toggle.closest('.tool-card');
        const panel = card.querySelector('.tool-panel');
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        // Close other open tools (optional, good if you add more later)
        document.querySelectorAll('.tool-card-toggle[aria-expanded="true"]').forEach((openToggle) => {
            if (openToggle !== toggle) {
                openToggle.setAttribute('aria-expanded', 'false');
                openToggle.closest('.tool-card').querySelector('.tool-panel').hidden = true;
                openToggle.closest('.tool-card').classList.remove('is-open');
            }
        });

        toggle.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
        card.classList.toggle('is-open', !isOpen);
    });
});

const notebookInput = document.getElementById('notebook-input');
const addNoteButton = document.getElementById('add-note-btn');
const deleteNoteButton = document.getElementById('delete-note-btn');
const breadcrumbs = document.getElementById('note-breadcrumbs');

if (notebookInput && addNoteButton && deleteNoteButton && breadcrumbs) {
    let notes = JSON.parse(localStorage.getItem('portfolio-notebook-notes') || '[]');

    if (notes.length === 0) {
        notes = [''];
    }

    let currentNoteIndex = 0;

    function saveNotes() {
        localStorage.setItem('portfolio-notebook-notes', JSON.stringify(notes));
    }

    function renderNote() {
        notebookInput.value = notes[currentNoteIndex] || '';
        renderBreadcrumbs();
    }

    function renderBreadcrumbs() {
        breadcrumbs.innerHTML = '';

        notes.forEach((_, index) => {
            const crumb = document.createElement('button');
            crumb.type = 'button';
            crumb.textContent = `Note ${index + 1}`;
            crumb.classList.toggle('active', index === currentNoteIndex);
            crumb.addEventListener('click', () => {
                currentNoteIndex = index;
                renderNote();
            });
            breadcrumbs.appendChild(crumb);
        });
    }

    function addNote() {
        notes.push('');
        currentNoteIndex = notes.length - 1;
        renderNote();
        saveNotes();
    }

    function deleteNote() {
        if (notes.length <= 1) {
            notes = [''];
            currentNoteIndex = 0;
            renderNote();
            saveNotes();
            return;
        }

        notes.splice(currentNoteIndex, 1);
        currentNoteIndex = Math.max(0, Math.min(currentNoteIndex, notes.length - 1));
        renderNote();
        saveNotes();
    }

    addNoteButton.addEventListener('click', addNote);
    deleteNoteButton.addEventListener('click', deleteNote);

    notebookInput.addEventListener('input', () => {
        notes[currentNoteIndex] = notebookInput.value;
        saveNotes();
    });

    renderNote();
}