/**
 * Sanskrit & Vedic Text Editor Entry Point
 * Bootstraps editor, file manager, virtual keyboard, and toolbar
 */

import { SanskritEditor } from './editor/editor.js';
import { FileManager } from './files/file-manager.js';
import { VirtualKeyboard } from './keyboard/keyboard.js';
import { Toolbar } from './ui/toolbar.js';
import { PhoneticSuggester } from './transliteration/suggestion-popup.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM references
  const textarea = document.getElementById('sanskritEditor');
  const lineGutter = document.getElementById('lineGutter');
  const keyboardContainer = document.getElementById('virtualKeyboard');
  const dropOverlay = document.getElementById('dropOverlay');
  const editorContainer = document.getElementById('editorContainer');
  const fileInput = document.getElementById('fileInput');
  const phoneticPopup = document.getElementById('phoneticPopup');

  if (!textarea || !lineGutter) {
    console.error('Core editor elements not found.');
    return;
  }

  // 1. Initialize Editor
  const isMobile = window.innerWidth <= 768;
  const editor = new SanskritEditor(textarea, lineGutter, {
    defaultFontSize: isMobile ? 24 : 26,
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
    statCursor: document.getElementById('statCursor'),
    unicodeInspector: document.getElementById('unicodeInspector')
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

  // Expose to window for debugging if needed
  window.__sanskritEditor = editor;
  window.__fileManager = fileManager;
  window.__virtualKeyboard = keyboard;
  window.__phoneticSuggester = phoneticSuggester;
});
