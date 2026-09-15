/**
 * Toolbar & UI State Controller
 * Manages buttons, menus, stats displays, and Unicode inspector
 */

import { VEDIC_SAMPLE_TEXTS } from '../data/vedic-svara.js';

export class Toolbar {
  /**
   * @param {import('../editor/editor.js').SanskritEditor} editor 
   * @param {import('../files/file-manager.js').FileManager} fileManager 
   * @param {import('../keyboard/keyboard.js').VirtualKeyboard} keyboard 
   * @param {Object} domElements 
   * @param {import('../transliteration/suggestion-popup.js').PhoneticSuggester} [phoneticSuggester]
   */
  constructor(editor, fileManager, keyboard, domElements, phoneticSuggester = null) {
    this.editor = editor;
    this.fileManager = fileManager;
    this.keyboard = keyboard;
    this.dom = domElements;
    this.phoneticSuggester = phoneticSuggester;

    this.currentTheme = localStorage.getItem('sanskrit_editor_theme') || 'light';

    this._init();
  }

  _init() {
    this._applyTheme(this.currentTheme);
    this._bindEvents();
    this._updateStats();
    this._updateSaveBadge();
  }

  _applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sanskrit_editor_theme', theme);

    if (this.dom.themeToggleBtn) {
      const isDark = theme === 'dark';
      this.dom.themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      this.dom.themeToggleBtn.innerHTML = isDark
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
    }
  }

  _bindEvents() {
    // Theme toggle
    this.dom.themeToggleBtn?.addEventListener('click', () => {
      const next = this.currentTheme === 'dark' ? 'light' : 'dark';
      this._applyTheme(next);
    });

    // File action buttons
    this.dom.newBtn?.addEventListener('click', () => {
      this.fileManager.createNewFile();
    });

    this.dom.openBtn?.addEventListener('click', () => {
      this.fileManager.promptOpenFile();
    });

    this.dom.saveBtn?.addEventListener('click', () => {
      this.fileManager.saveFile();
    });

    // Filename editing
    this.dom.filenameInput?.addEventListener('change', (e) => {
      this.fileManager.setFileName(e.target.value);
    });

    // Undo / Redo
    this.dom.undoBtn?.addEventListener('click', () => {
      this.editor.undo();
    });

    this.dom.redoBtn?.addEventListener('click', () => {
      this.editor.redo();
    });

    // Zoom controls
    this.dom.zoomInBtn?.addEventListener('click', () => {
      this.editor.zoomIn();
    });

    this.dom.zoomOutBtn?.addEventListener('click', () => {
      this.editor.zoomOut();
    });

    // Keyboard toggle
    this.dom.kbToggleBtn?.addEventListener('click', () => {
      const isVisible = this.keyboard.toggle();
      this._updateKeyboardToggleBtn(isVisible);
    });

    window.addEventListener('keyboard-visibility-changed', (e) => {
      this._updateKeyboardToggleBtn(e.detail.isVisible);
    });

    // Copy to clipboard
    this.dom.copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.editor.getText());
        const originalText = this.dom.copyBtn.innerHTML;
        this.dom.copyBtn.innerHTML = `✓ Copied`;
        setTimeout(() => {
          this.dom.copyBtn.innerHTML = originalText;
        }, 1500);
      } catch (err) {
        // Fallback
        this.editor.textarea.select();
        document.execCommand('copy');
      }
    });

    // Listen to editor changes
    this.editor.onChange(() => {
      this._updateStats();
    });

    // Listen to cursor changes
    this.editor.onCursorChange((ctx) => {
      this._updateCursorInfo(ctx);
    });

    // Listen to undo/redo history state
    this.editor.onHistoryChange(({ canUndo, canRedo }) => {
      if (this.dom.undoBtn) this.dom.undoBtn.disabled = !canUndo;
      if (this.dom.redoBtn) this.dom.redoBtn.disabled = !canRedo;
    });

    // Listen to file manager status
    this.fileManager.onStateChange(({ fileName, isDirty }) => {
      if (this.dom.filenameInput && this.dom.filenameInput.value !== fileName) {
        this.dom.filenameInput.value = fileName;
      }
      this._updateSaveBadge(isDirty);
    });

    // Phonetic Suggestions Toggle
    if (this.dom.phoneticToggleBtn && this.phoneticSuggester) {
      this.dom.phoneticToggleBtn.addEventListener('click', () => {
        this.phoneticSuggester.toggle();
      });

      this.phoneticSuggester.onStateChange((isEnabled) => {
        this._updatePhoneticToggleBtn(isEnabled);
      });
      this._updatePhoneticToggleBtn(this.phoneticSuggester.enabled);
    }
  }

  _updatePhoneticToggleBtn(isEnabled) {
    if (!this.dom.phoneticToggleBtn) return;
    if (isEnabled) {
      this.dom.phoneticToggleBtn.classList.add('active');
      this.dom.phoneticToggleBtn.setAttribute('title', 'Phonetic Sanskrit Typing: Active (Type English words to suggest Sanskrit) — Shortcut: Ctrl+M');
    } else {
      this.dom.phoneticToggleBtn.classList.remove('active');
      this.dom.phoneticToggleBtn.setAttribute('title', 'Phonetic Sanskrit Typing: Disabled — Click or press Ctrl+M to enable');
    }
  }

  _updateKeyboardToggleBtn(isVisible) {
    if (!this.dom.kbToggleBtn) return;
    if (isVisible) {
      this.dom.kbToggleBtn.classList.add('btn-active');
    } else {
      this.dom.kbToggleBtn.classList.remove('btn-active');
    }
  }

  _updateSaveBadge(isDirty = this.fileManager.isDirty) {
    if (!this.dom.saveStatusBadge) return;
    if (isDirty) {
      this.dom.saveStatusBadge.className = 'save-status-badge unsaved';
      this.dom.saveStatusBadge.innerHTML = `<span class="status-dot"></span>Unsaved`;
    } else {
      this.dom.saveStatusBadge.className = 'save-status-badge saved';
      this.dom.saveStatusBadge.innerHTML = `<span class="status-dot"></span>Saved`;
    }
  }

  _updateStats() {
    const { lines, words, characters, bytes } = this.editor.getMetrics();
    if (this.dom.statLines) this.dom.statLines.textContent = lines.toString();
    if (this.dom.statWords) this.dom.statWords.textContent = words.toString();
    if (this.dom.statChars) this.dom.statChars.textContent = characters.toString();
    if (this.dom.statBytes) {
      this.dom.statBytes.textContent = bytes > 1024 
        ? (bytes / 1024).toFixed(1) + ' KB'
        : bytes + ' B';
    }
  }

  _updateCursorInfo(ctx) {
    if (this.dom.statCursor) {
      this.dom.statCursor.textContent = `Ln ${ctx.line}, Col ${ctx.col}`;
    }

    if (this.dom.unicodeInspector) {
      if (ctx.inspectList && ctx.inspectList.length > 0) {
        const itemsHtml = ctx.inspectList.map((item) => {
          return `<span>[<span class="char-preview">${item.char}</span> ${item.hex}]</span>`;
        }).join(' ');
        this.dom.unicodeInspector.innerHTML = `<span style="color: var(--text-tertiary);">Cursor:</span> ${itemsHtml}`;
      } else {
        this.dom.unicodeInspector.innerHTML = `<span style="color: var(--text-tertiary);">Unicode:</span> U+0000`;
      }
    }
  }
}
