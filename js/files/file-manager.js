/**
 * File Manager for Sanskrit/Vedic Documents
 * Handles client-side UTF-8 text file loading, saving, and drag-and-drop
 * Strict requirement: ZERO Unicode normalization or modification.
 */

export class FileManager {
  /**
   * @param {import('../editor/editor.js').SanskritEditor} editor 
   * @param {Object} elements UI elements
   */
  constructor(editor, elements = {}) {
    this.editor = editor;
    this.elements = elements;
    this.currentFileName = 'vedic_document.txt';
    this.isDirty = false;
    this.listeners = new Set();

    this._init();
  }

  _init() {
    // When editor text changes, mark dirty
    this.editor.onChange(() => {
      this.setDirty(true);
    });

    // File input picker
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.loadFile(file);
        }
        // Reset input value so re-selecting same file triggers change
        this.elements.fileInput.value = '';
      });
    }

    // Drag and drop onto editor area
    if (this.elements.dropTarget && this.elements.dropOverlay) {
      this._setupDragAndDrop(this.elements.dropTarget, this.elements.dropOverlay);
    }
  }

  setDirty(dirty) {
    if (this.isDirty !== dirty) {
      this.isDirty = dirty;
      this._notify();
    }
  }

  setFileName(name) {
    if (!name || name.trim() === '') {
      name = 'untitled.txt';
    }
    // Ensure .txt extension if not present
    if (!name.endsWith('.txt')) {
      name += '.txt';
    }
    this.currentFileName = name.trim();
    this._notify();
  }

  /**
   * Create a new document
   * @param {boolean} force bypass unsaved warning
   */
  createNewFile(force = false) {
    if (this.isDirty && !force) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to create a new file and discard current changes?');
      if (!confirmDiscard) return false;
    }

    this.editor.setText('', true);
    this.currentFileName = 'untitled.txt';
    this.setDirty(false);
    this._notify();
    return true;
  }

  /**
   * Trigger open file picker
   */
  promptOpenFile() {
    if (this.isDirty) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to open a new file and discard current changes?');
      if (!confirmDiscard) return;
    }

    if (this.elements.fileInput) {
      this.elements.fileInput.click();
    }
  }

  /**
   * Read file content with UTF-8 encoding (no normalization)
   * @param {File} file 
   */
  loadFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        // Load exact raw string into editor without any normalization
        this.editor.setText(content, true);
        this.currentFileName = file.name;
        this.setDirty(false);
        this._notify();
      }
    };

    reader.onerror = () => {
      alert(`Error reading file "${file.name}". Please ensure it is a valid text file.`);
    };

    // Explicitly read as UTF-8
    reader.readAsText(file, 'UTF-8');
  }

  /**
   * Save / Download the current file as UTF-8 .txt
   */
  saveFile() {
    const rawText = this.editor.getText();

    // Create Blob strictly as UTF-8 text/plain
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = this.currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(downloadUrl);

    this.setDirty(false);
    this._notify();
  }

  /**
   * Setup Drag and drop handling
   */
  _setupDragAndDrop(target, overlay) {
    let dragCounter = 0;

    const showOverlay = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      overlay.classList.add('active');
    };

    const hideOverlay = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        overlay.classList.remove('active');
      }
    };

    target.addEventListener('dragenter', showOverlay);
    target.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    target.addEventListener('dragleave', hideOverlay);

    target.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      overlay.classList.remove('active');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        if (this.isDirty) {
          const confirmDiscard = window.confirm('You have unsaved changes. Discard and open dropped file?');
          if (!confirmDiscard) return;
        }
        this.loadFile(files[0]);
      }
    });
  }

  onStateChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _notify() {
    this.listeners.forEach((fn) => fn({
      fileName: this.currentFileName,
      isDirty: this.isDirty
    }));
  }
}
