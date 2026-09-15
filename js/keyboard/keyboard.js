/**
 * Sanskrit and Vedic Virtual Keyboard Component
 * Data-driven, categorized, and inserts directly at current cursor position.
 */

import { VOWELS, CONSONANT_GROUPS, MATRAS, SANSKRIT_SIGNS, DEVANAGARI_DIGITS } from '../data/devanagari.js';
import { VEDIC_SVARA_MARKS } from '../data/vedic-svara.js';

export class VirtualKeyboard {
  /**
   * @param {HTMLElement} containerElement 
   * @param {import('../editor/editor.js').SanskritEditor} editor 
   * @param {Object} options 
   */
  constructor(containerElement, editor, options = {}) {
    this.container = containerElement;
    this.editor = editor;
    this.currentCategory = 'vedic'; // default to Vedic Svaras as per user focus
    this.isVisible = true;

    this._init();
  }

  _init() {
    this.render();
  }

  toggle() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.container.classList.remove('hidden');
    } else {
      this.container.classList.add('hidden');
    }
    return this.isVisible;
  }

  show() {
    this.isVisible = true;
    this.container.classList.remove('hidden');
  }

  hide() {
    this.isVisible = false;
    this.container.classList.add('hidden');
  }

  setCategory(category) {
    this.currentCategory = category;
    this._updateActiveTab();
    this._renderKeys();
  }

  render() {
    this.container.innerHTML = `
      <!-- Keyboard Header: Tabs & Window Controls -->
      <div class="keyboard-header">
        <div class="keyboard-tabs" id="kbTabs">
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'vedic' ? 'active' : ''}" data-cat="vedic">
            वैदिक स्वराः (Vedic)
          </button>
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'matras' ? 'active' : ''}" data-cat="matras">
            मात्राः / चिह्नानि (Matras)
          </button>
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'vowels' ? 'active' : ''}" data-cat="vowels">
            स्वराः (Vowels)
          </button>
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'consonants' ? 'active' : ''}" data-cat="consonants">
            व्यञ्जनानि (Consonants)
          </button>
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'digits' ? 'active' : ''}" data-cat="digits">
            अङ्काः (Numerals)
          </button>
          <button type="button" class="kb-tab-btn ${this.currentCategory === 'all' ? 'active' : ''}" data-cat="all">
            सर्वम् (All)
          </button>
        </div>
        <div class="keyboard-controls">
          <button type="button" class="btn btn-icon" id="kbCloseBtn" title="Hide Keyboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Vedic Access Bar: Always visible above all tabs -->
      <div class="quick-vedic-bar" id="quickVedicBar">
        <span class="quick-bar-label">त्वरित-चिह्नानि:</span>
        <!-- Populated below -->
      </div>

      <!-- Main Keys Scroll Area -->
      <div class="keyboard-body" id="kbBody">
        <!-- Rendered based on current category -->
      </div>

      <!-- Action Row: Halanta, Space, Backspace, Enter -->
      <div class="keyboard-action-row" id="kbActionRow">
        <button type="button" class="kb-action-key" id="kbViramaKey" title="Virāma / Halanta (्) - suppress vowel">
          <span class="action-key-symbol" style="font-family: var(--font-devanagari); font-size: 15px; color: var(--accent-primary);">◌्</span>
          <span>हलन्त</span>
        </button>
        <button type="button" class="kb-action-key kb-action-space" id="kbSpaceKey" title="Insert Space">
          <span style="font-size: 14px; opacity: 0.75;">␣</span>
          <span>Space</span>
        </button>
        <button type="button" class="kb-action-key" id="kbBackspaceKey" title="Backspace">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
            <line x1="18" y1="9" x2="12" y2="15"></line>
            <line x1="12" y1="9" x2="18" y2="15"></line>
          </svg>
          <span>Backspace</span>
        </button>
        <button type="button" class="kb-action-key" id="kbEnterKey" title="New Line">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
          <span>Enter</span>
        </button>
      </div>
    `;

    // Bind category tabs
    const tabsContainer = this.container.querySelector('#kbTabs');
    tabsContainer?.addEventListener('click', (e) => {
      const btn = e.target.closest('.kb-tab-btn');
      if (btn && btn.dataset.cat) {
        this.setCategory(btn.dataset.cat);
      }
    });

    // Bind close button
    const closeBtn = this.container.querySelector('#kbCloseBtn');
    closeBtn?.addEventListener('click', () => {
      this.hide();
      // Notify parent toolbar if needed
      window.dispatchEvent(new CustomEvent('keyboard-visibility-changed', { detail: { isVisible: false } }));
    });

    // Populate Quick Vedic Bar
    this._renderQuickBar();

    // Bind action keys
    this._bindActionKeys();

    // Render active category keys
    this._renderKeys();
  }

  _updateActiveTab() {
    const tabs = this.container.querySelectorAll('.kb-tab-btn');
    tabs.forEach((tab) => {
      if (tab.dataset.cat === this.currentCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  _renderQuickBar() {
    const bar = this.container.querySelector('#quickVedicBar');
    if (!bar) return;

    // The most vital Vedic and Sanskrit marks for rapid composition
    const quickItems = [
      { char: '\u0951', display: '◌॑', name: 'स्वरित/उदात्त', code: 'U+0951' },
      { char: '\u0952', display: '◌॒', name: 'अनुदात्त', code: 'U+0952' },
      { char: '\u1CDA', display: '◌᳚', name: 'दीर्घ स्वरित', code: 'U+1CDA' },
      { char: '\u0951\u0951', display: '◌॑॑', name: 'द्वि-स्वरित', code: '2×U+0951' },
      { char: '\u094D', display: '◌्', name: 'हलन्त', code: 'U+094D' },
      { char: '\u0902', display: '◌ं', name: 'अनुस्वार', code: 'U+0902' },
      { char: '\u0903', display: '◌ः', name: 'विसर्ग', code: 'U+0903' },
      { char: '\u0901', display: '◌ँ', name: 'चन्द्रबिन्दु', code: 'U+0901' },
      { char: '\u093D', display: 'ऽ', name: 'अवग्रह', code: 'U+093D' },
      { char: '\u0964', display: '।', name: 'दण्ड', code: 'U+0964' },
      { char: '\u0965', display: '॥', name: 'द्विदण्ड', code: 'U+0965' },
      { char: '\u0950', display: 'ॐ', name: 'ॐ', code: 'U+0950' },
      { char: '\u1CF5', display: 'ᳵ', name: 'जिह्वामूलीय', code: 'U+1CF5' },
      { char: '\u1CF6', display: 'ᳶ', name: 'उपध्मानीय', code: 'U+1CF6' }
    ];

    let html = '<span class="quick-bar-label">त्वरित-चिह्नानि:</span>';
    quickItems.forEach((item) => {
      html += `
        <button type="button" class="kb-key key-vedic quick-key" 
                data-char="${item.char}" 
                title="${item.name} (${item.code})">
          <span class="key-char ${item.display.startsWith('◌') ? 'combining-char' : ''}">${item.display}</span>
        </button>
      `;
    });

    bar.innerHTML = html;

    // Attach click listeners
    bar.querySelectorAll('.quick-key').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const char = btn.dataset.char;
        if (char) {
          this.editor.insertText(char);
        }
      });
    });
  }

  _bindActionKeys() {
    const viramaBtn = this.container.querySelector('#kbViramaKey');
    viramaBtn?.addEventListener('click', () => {
      this.editor.insertText('\u094D');
    });

    const spaceBtn = this.container.querySelector('#kbSpaceKey');
    spaceBtn?.addEventListener('click', () => {
      this.editor.insertText(' ');
    });

    const backspaceBtn = this.container.querySelector('#kbBackspaceKey');
    backspaceBtn?.addEventListener('click', () => {
      const textarea = this.editor.textarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start === end) {
        if (start > 0) {
          // Check if previous character is a combining character
          // Deleting 1 Unicode code point or 1 UTF-16 code unit
          const val = textarea.value;
          // Look back 1 code point
          let deleteCount = 1;
          // If surrogate pair
          if (start >= 2 && /[\uD800-\uDBFF]/.test(val[start - 2])) {
            deleteCount = 2;
          }
          textarea.setRangeText('', start - deleteCount, start, 'end');
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.focus();
        }
      } else {
        textarea.setRangeText('', start, end, 'end');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    });

    const enterBtn = this.container.querySelector('#kbEnterKey');
    enterBtn?.addEventListener('click', () => {
      this.editor.insertText('\n');
    });
  }

  _renderKeys() {
    const body = this.container.querySelector('#kbBody');
    if (!body) return;

    let html = '';

    if (this.currentCategory === 'vedic' || this.currentCategory === 'all') {
      html += this._renderKeySection('वैदिक स्वराः एवं चिह्न-विशेषाः (Vedic Tone Marks & Extensions)', VEDIC_SVARA_MARKS, 'vedic-grid');
    }

    if (this.currentCategory === 'matras' || this.currentCategory === 'all') {
      html += this._renderKeySection('स्वरमात्राः (Dependent Vowel Signs - Mātrās)', MATRAS, 'wide-grid');
      html += this._renderKeySection('संस्कृत चिह्नानि (Virāma, Anusvāra, Visarga & Punctuation)', SANSKRIT_SIGNS, 'wide-grid');
    }

    if (this.currentCategory === 'vowels' || this.currentCategory === 'all') {
      html += this._renderKeySection('स्वतन्त्र स्वराः (Independent Vowels - Svaras)', VOWELS, 'wide-grid');
    }

    if (this.currentCategory === 'consonants' || this.currentCategory === 'all') {
      CONSONANT_GROUPS.forEach((group) => {
        html += this._renderKeySection(group.group, group.items, 'wide-grid');
      });
    }

    if (this.currentCategory === 'digits' || this.currentCategory === 'all') {
      html += this._renderKeySection('देवनागरी अङ्काः (Devanāgarī Numerals)', DEVANAGARI_DIGITS, 'wide-grid');
    }

    body.innerHTML = html;

    // Attach click listeners to all generated keys
    body.querySelectorAll('.kb-key').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const char = btn.dataset.char;
        if (char) {
          this.editor.insertText(char);
        }
      });
    });
  }

  _renderKeySection(title, items, gridClass = '') {
    let keysHtml = '';
    items.forEach((item) => {
      const isVedic = item.code && (item.code.startsWith('U+1C') || item.code.includes('U+0951') || item.code.includes('U+0952'));
      const isCombining = item.isCombining || item.display.startsWith('◌');

      keysHtml += `
        <button type="button" 
                class="kb-key ${isVedic ? 'key-vedic' : ''}" 
                data-char="${item.char}"
                title="${item.name} (${item.code})${item.description ? ' - ' + item.description : ''}">
          <span class="key-char ${isCombining ? 'combining-char' : ''}">${item.display}</span>
        </button>
      `;
    });

    return `
      <div class="key-section">
        <div class="key-section-header">${title}</div>
        <div class="key-grid ${gridClass}">
          ${keysHtml}
        </div>
      </div>
    `;
  }
}
