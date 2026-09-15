# वेदलिपि (Vedalipi) — Sanskrit & Vedic Text Editor

A web-based text editor for Sanskrit and Vedic literature, crafted with a **modern scholarly + traditional manuscript** visual aesthetic. Built with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- **Vedic Svara & Combining Marks**: Full Unicode support for Vedic accents (`उदात्त / स्वरित`, `अनुदात्त`, `दीर्घ स्वरित`, `द्वि-स्वरित`, `जिह्वामूलीय`, `उपध्मानीय`, and more) without automatic or lossy normalization.
- **Phonetic Transliteration (`Ctrl+M`)**: Type phonetically in Roman letters (e.g., `namaste`, `agnim`, `shri`) with an interactive Devanagari suggestion menu.
- **Virtual Vedic Keyboard**: On-screen palette organized by Vedic marks, mātrās, vowels, consonants, and numerals, plus a quick-access Vedic svara bar.
- **Synchronized Line Gutter**: Custom line numbering with baseline offset alignment matching Devanagari manuscript proportions.
- **Real-Time Unicode Inspector**: Live status bar displaying character code points (`U+09xx`, `U+1CDx`), word count, line count, and byte size.
- **File Management**: Open local `.txt` files, drag-and-drop text files into the editor, rename documents, and export exact UTF-8 files.
- **Manuscript Themes**: Warm Ivory light mode and Charcoal/Near-Black dark mode with muted saffron accents.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + M` / `⌘ + M` | Toggle Phonetic Sanskrit Transliteration |
| `Ctrl + S` / `⌘ + S` | Save file as UTF-8 `.txt` |
| `Ctrl + O` / `⌘ + O` | Open local text file |
| `Ctrl + N` / `⌘ + N` | Create new document |
| `Ctrl + Z` / `⌘ + Z` | Undo |
| `Ctrl + Y` / `⌘ + Y` | Redo |
| `1`–`9` *(in phonetic popup)* | Select transliteration candidate |
| `Space` / `Enter` *(in popup)* | Select active candidate |
| `Escape` | Dismiss suggestion popup |

---

## 🚀 Getting Started

1. Open the editor in your browser.
2. Type directly in Devanagari using your system keyboard, or toggle **Phonetic (EN→सं)** (`Ctrl+M`) to type using phonetic Roman input.
3. Use the **Virtual Keyboard** at the bottom to insert specialized Vedic accents and rare combining marks.
4. Save your work anytime with **Save UTF-8** (`Ctrl+S`).
