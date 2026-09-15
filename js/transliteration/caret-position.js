/**
 * Caret Coordinate Calculator for Textarea
 * Accurately mirrors textarea styling to find the screen coordinates of the typing cursor.
 */

const PROPERTIES = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'whiteSpace',
  'wordBreak',
  'overflowWrap'
];

let mirrorDiv = null;

function getOrCreateMirror() {
  if (!mirrorDiv) {
    mirrorDiv = document.createElement('div');
    mirrorDiv.id = 'caretCoordinatesMirror';
    mirrorDiv.style.position = 'absolute';
    mirrorDiv.style.top = '-9999px';
    mirrorDiv.style.left = '-9999px';
    mirrorDiv.style.visibility = 'hidden';
    mirrorDiv.style.pointerEvents = 'none';
    document.body.appendChild(mirrorDiv);
  }
  return mirrorDiv;
}

/**
 * Get screen pixel position of the cursor in a textarea
 * @param {HTMLTextAreaElement} element 
 * @param {number} position 
 * @returns {{ top: number, left: number, lineHeight: number }}
 */
export function getCaretCoordinates(element, position) {
  const mirror = getOrCreateMirror();
  const style = window.getComputedStyle(element);

  // Transfer textarea styles to mirror
  for (const prop of PROPERTIES) {
    mirror.style[prop] = style[prop];
  }

  // Exact content width matching textarea client width
  mirror.style.width = `${element.clientWidth}px`;
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordBreak = 'break-word';

  // Substring before cursor
  const text = element.value.substring(0, position);
  mirror.textContent = text;

  // Insert marker span
  const marker = document.createElement('span');
  marker.textContent = '|';
  mirror.appendChild(marker);

  const markerOffsetTop = marker.offsetTop;
  const markerOffsetLeft = marker.offsetLeft;
  const markerHeight = marker.offsetHeight || parseFloat(style.lineHeight) || 24;

  const elementRect = element.getBoundingClientRect();

  const top = elementRect.top + markerOffsetTop - element.scrollTop;
  const left = elementRect.left + markerOffsetLeft - element.scrollLeft;

  return {
    top,
    left,
    lineHeight: markerHeight
  };
}
