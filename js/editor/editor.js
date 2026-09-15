/**
 * Sanskrit/Vedic Text Editor Core Class
 * Handles raw Unicode content, line numbers gutter with exact baseline alignment,
 * undo/redo history, and metrics.
 */

import { insertAtCursor, getCursorContext, getSelectionRange, setSelectionRange } from './selection.js';

export class SanskritEditor {
  /**
   * @param {HTMLTextAreaElement} textarea 
   * @param {HTMLElement} gutterElement 
   * @param {Object} options 
   */
  constructor(textarea, gutterElement, options = {}) {
    this.textarea = textarea;
    this.gutter = gutterElement;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    this.options = Object.assign({
      minFontSize: 18,
      maxFontSize: 36,
      defaultFontSize: isMobile ? 24 : 26,
      maxHistory: 100
    }, options);

    this.fontSize = this.options.defaultFontSize;
    this.lineHeightRatio = 1.9;
    this.lineHeight = Math.round(this.fontSize * this.lineHeightRatio);
    this.baselineOffset = Math.max(1, Math.round((this.fontSize - 13) * 0.28));
    
    // History stack for programmatic and virtual keyboard undo/redo
    this.history = [];
    this.historyIndex = -1;
    this.historyDebounceTimer = null;
    this.isHistoryAction = false;

    // Listeners
    this.changeListeners = new Set();
    this.cursorListeners = new Set();
    this.historyListeners = new Set();

    this._init();
  }

  _init() {
    this.setFontSize(this.fontSize);

    // Initial snapshot
    this._saveHistorySnapshot(true);

    // Sync line numbers and gutter scroll
    this.textarea.addEventListener('scroll', () => this._syncScroll());
    window.addEventListener('resize', () => this.updateLineNumbers());

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        this.updateLineNumbers();
      });
      ro.observe(this.textarea);
    }

    // Input events
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      if (!this.isHistoryAction) {
        this._queueHistorySnapshot();
      }
      this._notifyChange();
      this._notifyCursor();
    });

    // Cursor movement events
    ['keyup', 'mouseup', 'touchend', 'click', 'select'].forEach((evt) => {
      this.textarea.addEventListener(evt, () => {
        this._notifyCursor();
        this._highlightActiveLine();
      });
    });

    // Native key handling
    this.textarea.addEventListener('keydown', (e) => {
      // Support Tab key indentation cleanly
      if (e.key === 'Tab') {
        e.preventDefault();
        insertAtCursor(this.textarea, '    ');
        this.updateLineNumbers();
      }
      // Handle Ctrl+Z / Ctrl+Y to ensure virtual keyboard insertions are also in undo stack
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        if (this.canUndo()) {
          e.preventDefault();
          this.undo();
        }
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (this.canRedo()) {
          e.preventDefault();
          this.redo();
        }
      }
    });

    this.updateLineNumbers();
  }

  /**
   * Get raw text exactly as typed / loaded (NO NORMALIZATION)
   * @returns {string}
   */
  getText() {
    return this.textarea.value;
  }

  /**
   * Set raw text without normalization and reset history
   * @param {string} text 
   * @param {boolean} resetHistory 
   */
  setText(text, resetHistory = true) {
    this.textarea.value = text;
    this.updateLineNumbers();

    if (resetHistory) {
      this.history = [];
      this.historyIndex = -1;
      this._saveHistorySnapshot(true);
    } else {
      this._saveHistorySnapshot(true);
    }

    this._notifyChange();
    this._notifyCursor();
  }

  /**
   * Insert text at the current cursor position
   * @param {string} char 
   */
  insertText(char) {
    insertAtCursor(this.textarea, char);
    this.updateLineNumbers();
  }

  /**
   * Line numbers gutter update with exact pixel height and baseline synchronization
   */
  updateLineNumbers() {
    if (!this.gutter) return;
    const text = this.textarea.value;
    const lines = text.split(/\r\n|\r|\n/);
    const lineCount = lines.length || 1;
    const lineHeight = this.lineHeight;
    const baselineOffset = this.baselineOffset;

    // Apply CSS variables to gutter
    this.gutter.style.setProperty('--line-height', `${lineHeight}px`);
    this.gutter.style.setProperty('--baseline-offset', `${baselineOffset}px`);

    // Determine if any line is long enough to wrap
    const textareaWidth = this.textarea.clientWidth;
    const cs = window.getComputedStyle(this.textarea);
    const pl = parseFloat(cs.paddingLeft) || 24;
    const pr = parseFloat(cs.paddingRight) || 24;
    const contentWidth = Math.max(50, textareaWidth - pl - pr);

    // Approximate character threshold for wrap detection
    const approxCharsPerLine = contentWidth / (this.fontSize * 0.55);
    let needsMeasurement = false;
    for (let i = 0; i < lineCount; i++) {
      if (lines[i].length > approxCharsPerLine) {
        needsMeasurement = true;
        break;
      }
    }

    let html = '';
    if (needsMeasurement && contentWidth > 80) {
      const mirror = this._getOrCreateMirror();
      mirror.style.width = `${contentWidth}px`;
      mirror.style.fontSize = `${this.fontSize}px`;
      mirror.style.fontFamily = cs.fontFamily;
      mirror.style.lineHeight = `${lineHeight}px`;
      mirror.style.letterSpacing = cs.letterSpacing;
      mirror.style.whiteSpace = 'pre-wrap';
      mirror.style.wordBreak = 'break-word';

      let mirrorHtml = '';
      for (let i = 0; i < lineCount; i++) {
        const line = lines[i];
        const safeLine = line.length === 0 ? '&nbsp;' : this._escapeHtml(line);
        mirrorHtml += `<div class="mirror-line" style="margin:0;padding:0;box-sizing:border-box;line-height:${lineHeight}px;">${safeLine}</div>`;
      }
      mirror.innerHTML = mirrorHtml;

      const mirrorDivs = mirror.children;
      for (let i = 0; i < lineCount; i++) {
        const measuredH = mirrorDivs[i] ? mirrorDivs[i].offsetHeight : lineHeight;
        const h = Math.max(lineHeight, measuredH);
        html += `<div class="line-number" style="height:${h}px;"><span class="line-number-text" style="line-height:${lineHeight}px;">${i + 1}</span></div>`;
      }
    } else {
      for (let i = 1; i <= lineCount; i++) {
        html += `<div class="line-number" style="height:${lineHeight}px;"><span class="line-number-text" style="line-height:${lineHeight}px;">${i}</span></div>`;
      }
    }

    this.gutter.innerHTML = html;
    this._syncScroll();
    this._highlightActiveLine();
  }

  _getOrCreateMirror() {
    if (!this._mirror) {
      this._mirror = document.createElement('div');
      this._mirror.id = 'editorLineMirror';
      this._mirror.style.position = 'absolute';
      this._mirror.style.visibility = 'hidden';
      this._mirror.style.pointerEvents = 'none';
      this._mirror.style.left = '-9999px';
      this._mirror.style.top = '-9999px';
      this._mirror.style.boxSizing = 'border-box';
      document.body.appendChild(this._mirror);
    }
    return this._mirror;
  }

  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  _highlightActiveLine() {
    if (!this.gutter) return;
    const textBeforeCursor = this.textarea.value.substring(0, this.textarea.selectionStart);
    const activeIndex = textBeforeCursor.split(/\r\n|\r|\n/).length - 1;
    const items = this.gutter.children;
    for (let i = 0; i < items.length; i++) {
      if (i === activeIndex) {
        items[i].classList.add('active');
      } else {
        items[i].classList.remove('active');
      }
    }
  }

  _syncScroll() {
    if (!this.gutter) return;
    this.gutter.scrollTop = this.textarea.scrollTop;
  }

  /**
   * History Management (Undo / Redo)
   */
  _queueHistorySnapshot() {
    clearTimeout(this.historyDebounceTimer);
    this.historyDebounceTimer = setTimeout(() => {
      this._saveHistorySnapshot();
    }, 250);
  }

  _saveHistorySnapshot(immediate = false) {
    const val = this.textarea.value;
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;

    // Avoid duplicate state at top of stack
    if (this.historyIndex >= 0 && this.history[this.historyIndex]?.value === val) {
      return;
    }

    // Truncate any redo branch if we typed anew
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push({ value: val, start, end });
    if (this.history.length > this.options.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this._notifyHistoryChange();
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (!this.canUndo()) return;
    this.historyIndex--;
    const state = this.history[this.historyIndex];
    if (state) {
      this.isHistoryAction = true;
      this.textarea.value = state.value;
      setSelectionRange(this.textarea, state.start, state.end);
      this.updateLineNumbers();
      this._notifyChange();
      this._notifyCursor();
      this._notifyHistoryChange();
      this.isHistoryAction = false;
    }
  }

  redo() {
    if (!this.canRedo()) return;
    this.historyIndex++;
    const state = this.history[this.historyIndex];
    if (state) {
      this.isHistoryAction = true;
      this.textarea.value = state.value;
      setSelectionRange(this.textarea, state.start, state.end);
      this.updateLineNumbers();
      this._notifyChange();
      this._notifyCursor();
      this._notifyHistoryChange();
      this.isHistoryAction = false;
    }
  }

  /**
   * Metrics calculation: Lines, Words, Characters, Bytes
   */
  getMetrics() {
    const text = this.textarea.value;
    const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

    // Split words: whitespace and standard danda punctuation
    const wordsArray = text.trim().split(/[\s।॥]+/);
    const words = (text.trim().length === 0 || wordsArray[0] === '') ? 0 : wordsArray.length;

    // Unicode code points count (handles astral plane and multi-byte properly)
    const characters = [...text].length;

    // UTF-8 byte count
    const bytes = new TextEncoder().encode(text).length;

    return { lines, words, characters, bytes };
  }

  /**
   * Font size adjustment with automatic line height and baseline recalculation
   */
  setFontSize(size) {
    this.fontSize = Math.min(Math.max(size, this.options.minFontSize), this.options.maxFontSize);
    this.lineHeight = Math.round(this.fontSize * this.lineHeightRatio);
    this.baselineOffset = Math.max(1, Math.round((this.fontSize - 13) * 0.28));

    this.textarea.style.fontSize = `${this.fontSize}px`;
    this.textarea.style.lineHeight = `${this.lineHeight}px`;
    this.textarea.style.setProperty('--line-height', `${this.lineHeight}px`);

    if (this.gutter) {
      this.gutter.style.setProperty('--line-height', `${this.lineHeight}px`);
      this.gutter.style.setProperty('--baseline-offset', `${this.baselineOffset}px`);
    }

    const editorContainer = this.textarea.closest('.editor-container');
    if (editorContainer) {
      editorContainer.style.setProperty('--line-height', `${this.lineHeight}px`);
      editorContainer.style.setProperty('--baseline-offset', `${this.baselineOffset}px`);
    }

    this.updateLineNumbers();
  }

  zoomIn() {
    this.setFontSize(this.fontSize + 2);
  }

  zoomOut() {
    this.setFontSize(this.fontSize - 2);
  }

  resetZoom() {
    this.setFontSize(this.options.defaultFontSize);
  }

  /**
   * Focus textarea
   */
  focus() {
    this.textarea.focus();
  }

  /**
   * Subscribe to events
   */
  onChange(fn) {
    this.changeListeners.add(fn);
    return () => this.changeListeners.delete(fn);
  }

  onCursorChange(fn) {
    this.cursorListeners.add(fn);
    return () => this.cursorListeners.delete(fn);
  }

  onHistoryChange(fn) {
    this.historyListeners.add(fn);
    return () => this.historyListeners.delete(fn);
  }

  _notifyChange() {
    const metrics = this.getMetrics();
    this.changeListeners.forEach((fn) => fn(this.textarea.value, metrics));
  }

  _notifyCursor() {
    const context = getCursorContext(this.textarea);
    this.cursorListeners.forEach((fn) => fn(context));
    this._highlightActiveLine();
  }

  _notifyHistoryChange() {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    this.historyListeners.forEach((fn) => fn({ canUndo, canRedo }));
  }
}
