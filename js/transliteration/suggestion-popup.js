/**
 * Sanskrit Phonetic Suggestion Popup Controller
 * Intercepts English typing in the textarea and displays a floating suggestion box
 * offering Sanskrit/Devanagari replacements (Hinglish -> Sanskrit).
 */

import { getSanskritSuggestions } from './phonetic-engine.js';
import { getCaretCoordinates } from './caret-position.js';

export class PhoneticSuggester {
  /**
   * @param {Object} editor - Instance of SanskritEditor
   * @param {HTMLElement} popupContainer - DOM container for the floating popup
   * @param {Object} options
   */
  constructor(editor, popupContainer, options = {}) {
    this.editor = editor;
    this.textarea = editor.textarea;
    this.popup = popupContainer;
    this.options = Object.assign({
      enabled: true,
      maxSuggestions: 5
    }, options);

    this.enabled = this.options.enabled;
    this.visible = false;
    this.suggestions = [];
    this.selectedIndex = 0;
    this.currentWord = '';
    this.wordRange = { start: 0, end: 0 };
    this.stateListeners = new Set();

    this._init();
  }

  _init() {
    // 1. Keydown event interception (capture phase to handle Space, Enter, Arrows, Numbers before native behavior)
    this.textarea.addEventListener('keydown', (e) => this._handleKeyDown(e));

    // 2. Input event to detect typed Latin words and show suggestions
    this.textarea.addEventListener('input', () => this._handleInput());

    // 3. Dismiss or reposition on click, selection change, or scroll
    this.textarea.addEventListener('click', () => this._checkCaretWord());
    this.textarea.addEventListener('scroll', () => {
      if (this.visible) this._updatePopupPosition();
    });
    window.addEventListener('resize', () => {
      if (this.visible) this._updatePopupPosition();
    });

    // 4. Click outside to dismiss
    document.addEventListener('mousedown', (e) => {
      if (this.visible && !this.popup.contains(e.target) && e.target !== this.textarea) {
        this.hide();
      }
    });

    // 5. Global shortcut Ctrl+M / Cmd+M to toggle Phonetic Mode
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Toggle Phonetic mode On/Off
   */
  toggle() {
    this.setEnabled(!this.enabled);
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (!this.enabled) {
      this.hide();
    }
    this.stateListeners.forEach((fn) => fn(this.enabled));
  }

  onStateChange(fn) {
    this.stateListeners.add(fn);
    return () => this.stateListeners.delete(fn);
  }

  /**
   * Check if a Latin word is currently at the cursor
   */
  _extractCurrentWord() {
    const text = this.textarea.value;
    const pos = this.textarea.selectionStart;
    if (pos === 0 || this.textarea.selectionEnd !== pos) return null;

    const charBefore = text[pos - 1];
    // Must be an English letter [a-zA-Z]
    if (!/[a-zA-Z]/.test(charBefore)) return null;

    let start = pos - 1;
    while (start >= 0 && /[a-zA-Z]/.test(text[start])) {
      start--;
    }
    start++; // First character of the English word

    const word = text.substring(start, pos);
    return { word, start, end: pos };
  }

  _handleInput() {
    if (!this.enabled) return;

    const extracted = this._extractCurrentWord();
    if (!extracted || extracted.word.length === 0) {
      this.hide();
      return;
    }

    this.currentWord = extracted.word;
    this.wordRange = { start: extracted.start, end: extracted.end };

    const candidates = getSanskritSuggestions(this.currentWord, this.options.maxSuggestions);
    if (!candidates || candidates.length === 0) {
      this.hide();
      return;
    }

    this.suggestions = candidates;
    this.selectedIndex = 0;
    this.show();
  }

  _checkCaretWord() {
    if (!this.enabled || !this.visible) return;
    const extracted = this._extractCurrentWord();
    if (!extracted) {
      this.hide();
    }
  }

  _handleKeyDown(e) {
    if (!this.enabled || !this.visible || this.suggestions.length === 0) {
      return;
    }

    // Space: accept selected suggestion and append space
    if (e.key === ' ') {
      e.preventDefault();
      this.acceptSuggestion(this.selectedIndex, true);
      return;
    }

    // Enter or Tab: accept selected suggestion without newline
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      this.acceptSuggestion(this.selectedIndex, false);
      return;
    }

    // Number keys 1-9: accept that specific suggestion
    if (e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < this.suggestions.length) {
        e.preventDefault();
        this.acceptSuggestion(idx, true);
        return;
      }
    }

    // Navigation: Down / Right
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.suggestions.length;
      this._renderSuggestions();
      return;
    }

    // Navigation: Up / Left
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.suggestions.length) % this.suggestions.length;
      this._renderSuggestions();
      return;
    }

    // Escape: close popup and retain raw English word
    if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
      return;
    }
  }

  /**
   * Replace the current English word with the chosen Sanskrit word
   * @param {number} index 
   * @param {boolean} appendSpace 
   */
  acceptSuggestion(index, appendSpace = false) {
    if (index < 0 || index >= this.suggestions.length) return;
    const chosen = this.suggestions[index];

    const fullText = this.textarea.value;
    const before = fullText.substring(0, this.wordRange.start);
    const after = fullText.substring(this.wordRange.end);

    const insertion = chosen + (appendSpace ? ' ' : '');
    const newText = before + insertion + after;
    const newCursor = before.length + insertion.length;

    this.textarea.value = newText;
    this.textarea.selectionStart = newCursor;
    this.textarea.selectionEnd = newCursor;

    // Trigger editor updates
    this.editor.updateLineNumbers();
    this.editor._queueHistorySnapshot();
    this.editor._notifyChange();
    this.editor._notifyCursor();

    this.hide();
    this.textarea.focus();
  }

  /**
   * Render and display the suggestion popup
   */
  show() {
    this.visible = true;
    this.popup.classList.add('visible');
    this._renderSuggestions();
    this._updatePopupPosition();
  }

  hide() {
    this.visible = false;
    this.popup.classList.remove('visible');
    this.suggestions = [];
    this.selectedIndex = 0;
  }

  _renderSuggestions() {
    let itemsHtml = '';
    for (let i = 0; i < this.suggestions.length; i++) {
      const item = this.suggestions[i];
      const isSelected = i === this.selectedIndex;
      const isDevanagari = /[\u0900-\u097F]/.test(item);

      itemsHtml += `
        <button
          type="button"
          class="phonetic-candidate ${isSelected ? 'active' : ''}"
          data-index="${i}"
          title="Press ${i + 1} or Click to select"
        >
          <span class="candidate-badge">${i + 1}</span>
          <span class="candidate-text ${isDevanagari ? 'devanagari' : 'latin'}">${item}</span>
        </button>
      `;
    }

    this.popup.innerHTML = `
      <div class="phonetic-popup-header">
        <span class="phonetic-popup-title">संस्कृत-लिप्यन्तरणम् (Phonetic)</span>
        <span class="phonetic-popup-shortcut">Ctrl+M to toggle</span>
      </div>
      <div class="phonetic-candidates-list">
        ${itemsHtml}
      </div>
      <div class="phonetic-popup-footer">
        <span><kbd>Space</kbd> / <kbd>Enter</kbd> to insert</span>
        <span><kbd>1</kbd>-<kbd>${this.suggestions.length}</kbd> select</span>
        <span><kbd>Esc</kbd> cancel</span>
      </div>
    `;

    // Add click listeners to candidate buttons
    const buttons = this.popup.querySelectorAll('.phonetic-candidate');
    buttons.forEach((btn) => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent losing textarea focus prematurely
        const idx = parseInt(btn.dataset.index, 10);
        this.acceptSuggestion(idx, true);
      });
    });
  }

  _updatePopupPosition() {
    if (!this.visible) return;

    try {
      const coords = getCaretCoordinates(this.textarea, this.textarea.selectionStart);
      const popupRect = this.popup.getBoundingClientRect();
      const popupWidth = popupRect.width || 280;
      const popupHeight = popupRect.height || 120;

      let top = coords.top + coords.lineHeight + 6;
      let left = coords.left;

      // Ensure popup doesn't overflow right viewport edge
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + popupWidth > viewportWidth - 16) {
        left = Math.max(16, viewportWidth - popupWidth - 16);
      }

      // If overflowing bottom edge, flip above the line
      if (top + popupHeight > viewportHeight - 16) {
        top = Math.max(16, coords.top - popupHeight - 6);
      }

      this.popup.style.top = `${Math.round(top)}px`;
      this.popup.style.left = `${Math.round(left)}px`;
    } catch (err) {
      console.warn('Could not position phonetic popup:', err);
    }
  }
}
