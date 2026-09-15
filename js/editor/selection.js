/**
 * Selection & Cursor Management Utilities for Sanskrit/Vedic Textarea
 */

/**
 * Get current selection info from a textarea
 * @param {HTMLTextAreaElement} textarea 
 * @returns {{ start: number, end: number, text: string, value: string }}
 */
export function getSelectionRange(textarea) {
  if (!textarea) return { start: 0, end: 0, text: '', value: '' };
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const text = value.substring(start, end);
  return { start, end, text, value };
}

/**
 * Set selection in textarea and restore focus
 * @param {HTMLTextAreaElement} textarea 
 * @param {number} start 
 * @param {number} end 
 */
export function setSelectionRange(textarea, start, end = start) {
  if (!textarea) return;
  textarea.focus();
  textarea.setSelectionRange(start, end);
}

/**
 * Insert text at the current cursor/selection position in textarea
 * Preserves the exact Unicode characters without modification.
 * @param {HTMLTextAreaElement} textarea 
 * @param {string} textToInsert 
 * @param {boolean} selectInserted 
 */
export function insertAtCursor(textarea, textToInsert, selectInserted = false) {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Insert the exact raw text at the selection
  textarea.setRangeText(textToInsert, start, end, selectInserted ? 'select' : 'end');

  // Trigger 'input' event so undo managers, line counters, and change listeners fire
  const event = new Event('input', { bubbles: true, cancelable: true });
  textarea.dispatchEvent(event);

  // Focus the editor back
  textarea.focus();
}

/**
 * Inspect Unicode code points of a given character or cluster
 * @param {string} str 
 * @returns {Array<{ char: string, hex: string, codePoint: number }>}
 */
export function inspectUnicode(str) {
  if (!str) return [];
  const results = [];
  for (const char of str) {
    const cp = char.codePointAt(0);
    if (cp !== undefined) {
      results.push({
        char,
        codePoint: cp,
        hex: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0')
      });
    }
  }
  return results;
}

/**
 * Retrieve surrounding context around the current cursor position
 * @param {HTMLTextAreaElement} textarea 
 */
export function getCursorContext(textarea) {
  if (!textarea) return { line: 1, col: 1, beforeCluster: '', inspectList: [] };

  const pos = textarea.selectionStart;
  const val = textarea.value;

  // Calculate line and col
  const beforeText = val.substring(0, pos);
  const lines = beforeText.split(/\r\n|\r|\n/);
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;

  // Find characters around cursor for Unicode inspection (up to 4 code points backwards)
  let scanStart = Math.max(0, pos - 4);
  const clusterStr = val.substring(scanStart, pos);
  const inspectList = inspectUnicode(clusterStr);

  return {
    line,
    col,
    beforeCluster: clusterStr,
    inspectList
  };
}
