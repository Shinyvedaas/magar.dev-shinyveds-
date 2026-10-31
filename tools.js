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
    const notesStorageKey = 'portfolio-notebook-notes';
    let notes = loadNotes();
    let currentNoteIndex = 0;

    // Keep a blank note available if browser storage is empty, invalid, or unavailable.
    function loadNotes() {
        let savedNotes;
        try {
            savedNotes = localStorage.getItem(notesStorageKey);
        } catch (error) {
            console.error('Could not read saved notebook notes.', error);
            return [''];
        }

        if (savedNotes === null) return [''];

        try {
            const parsedNotes = JSON.parse(savedNotes);
            if (Array.isArray(parsedNotes) && parsedNotes.every((note) => typeof note === 'string')) {
                return parsedNotes.length > 0 ? parsedNotes : [''];
            }
            console.error('Saved notebook data is invalid; starting with a blank note.');
        } catch (error) {
            console.error('Could not parse saved notebook notes; starting with a blank note.', error);
        }

        return [''];
    }

    function saveNotes() {
        try {
            localStorage.setItem(notesStorageKey, JSON.stringify(notes));
        } catch (error) {
            console.error('Could not save notebook notes.', error);
        }
    }

    function renderNote() {
        notebookInput.value = notes[currentNoteIndex] || '';
        renderBreadcrumbs();
    }

    function renderBreadcrumbs() {
        breadcrumbs.replaceChildren();

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