/**
 * Sanskrit & Vedic Text Editor Entry Point
 * Bootstraps editor, file manager, virtual keyboard, and toolbar
 */

import { SanskritEditor } from './editor/editor.js';
import { FileManager } from './files/file-manager.js';
import { VirtualKeyboard } from './keyboard/keyboard.js';
import { Toolbar } from './ui/toolbar.js';
import { PhoneticSuggester } from './transliteration/suggestion-popup.js';
import { getCaretCoordinates } from './transliteration/caret-position.js';

document.addEventListener('DOMContentLoaded', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isStandalone) {
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.overscrollBehavior = 'none';
    document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (event) => event.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (event) => event.preventDefault(), { passive: false });
  }

  // DOM references
  const textarea = document.getElementById('sanskritEditor');
  const lineGutter = document.getElementById('lineGutter');
  const keyboardContainer = document.getElementById('virtualKeyboard');
  const dropOverlay = document.getElementById('dropOverlay');
  const editorContainer = document.getElementById('editorContainer');
  const fileInput = document.getElementById('fileInput');
  const phoneticPopup = document.getElementById('phoneticPopup');
  const mobileCaret = document.getElementById('mobileCaret');

  if (!textarea || !lineGutter) {
    console.error('Core editor elements not found.');
    return;
  }

  const updateMobileCaret = () => {
    if (!mobileCaret || !window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    requestAnimationFrame(() => {
      const position = textarea.selectionStart ?? textarea.value.length;
      const caret = getCaretCoordinates(textarea, position);
      const wrapperRect = textarea.closest('.textarea-wrapper')?.getBoundingClientRect();

      if (!wrapperRect) {
        return;
      }

      mobileCaret.style.left = `${caret.left - wrapperRect.left + 2}px`;
      mobileCaret.style.top = `${caret.top - wrapperRect.top + 2}px`;
      mobileCaret.style.height = `${Math.max(caret.lineHeight || 24, 22)}px`;
      mobileCaret.classList.add('visible');
    });
  };

  // 1. Initialize Editor
  const isMobile = window.innerWidth <= 768;
  const defaultFontSize = isMobile ? 18 : 26;
  textarea.setAttribute('inputmode', 'none');

  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    textarea.style.caretColor = 'transparent';

    textarea.addEventListener('pointerdown', () => {
      const position = textarea.selectionStart ?? textarea.value.length;
      textarea.focus({ preventScroll: true });
      setTimeout(() => {
        textarea.setSelectionRange(position, position);
        updateMobileCaret();
      }, 0);
    });

    textarea.addEventListener('focus', updateMobileCaret);
    textarea.addEventListener('click', updateMobileCaret);
    textarea.addEventListener('keyup', updateMobileCaret);
    textarea.addEventListener('select', updateMobileCaret);
    textarea.addEventListener('scroll', updateMobileCaret);
    textarea.addEventListener('keydown', (event) => {
      if (isMobile) {
        event.preventDefault();
      }
    });

    textarea.addEventListener('beforeinput', (event) => {
      if (isMobile) {
        event.preventDefault();
      }
    });
  }

  const editor = new SanskritEditor(textarea, lineGutter, {
    defaultFontSize,
    minFontSize: 18,
    maxFontSize: 36
  });

  // 2. Initialize File Manager
  const fileManager = new FileManager(editor, {
    fileInput,
    dropTarget: editorContainer,
    dropOverlay
  });

  // 3. Initialize Virtual Keyboard
  const keyboard = new VirtualKeyboard(keyboardContainer, editor);

  // 4. Initialize Sanskrit Phonetic Suggester (Hinglish -> Sanskrit)
  const phoneticSuggester = new PhoneticSuggester(editor, phoneticPopup);

  // 5. Initialize Toolbar & UI
  const domElements = {
    newBtn: document.getElementById('newBtn'),
    openBtn: document.getElementById('openBtn'),
    saveBtn: document.getElementById('saveBtn'),
    undoBtn: document.getElementById('undoBtn'),
    redoBtn: document.getElementById('redoBtn'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    phoneticToggleBtn: document.getElementById('phoneticToggleBtn'),
    kbToggleBtn: document.getElementById('kbToggleBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    copyBtn: document.getElementById('copyBtn'),
    filenameInput: document.getElementById('filenameInput'),
    saveStatusBadge: document.getElementById('saveStatusBadge'),
    statLines: document.getElementById('statLines'),
    statWords: document.getElementById('statWords'),
    statChars: document.getElementById('statChars'),
    statBytes: document.getElementById('statBytes'),
    statCursor: document.getElementById('statCursor')
  };

  const toolbar = new Toolbar(editor, fileManager, keyboard, domElements, phoneticSuggester);

  // 6. Load initial Vedic Sanskrit text (Śrī Sūkta test verse requested by user)
  const initialVedicVerse = `ॐ हिर॑ण्यवर्णां॒ हरि॑णीं सु॒वर्ण॑रज॒तस्र॑जाम् ।
च॒न्द्रां हि॒रण्म॑यीं ल॒क्ष्मीं जात॑वेदो म॒ आव॑ह ॥ १ ॥

तां म॒ आव॑ह॒ जात॑वेदो ल॒क्ष्मीमन॑पगा॒मिनी॑म् ।
यस्यां॒ हिर॑ण्यं वि॒न्देयं॒ गामश्वं॒ पुरु॑षान॒हम् ॥ २ ॥`;

  editor.setText(initialVedicVerse, true);
  fileManager.setFileName('sri_suktam.txt');
  fileManager.setDirty(false);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  }

  // Expose to window for debugging if needed
  window.__sanskritEditor = editor;
  window.__fileManager = fileManager;
  window.__virtualKeyboard = keyboard;
  window.__phoneticSuggester = phoneticSuggester;
});
