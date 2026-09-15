/**
 * Devanagari Alphabet, Matras, Signs and Numerals Data
 * Pure Unicode definitions without any transformation or CSS hacks
 */

export const VOWELS = [
  { char: 'अ', display: 'अ', name: 'ह्रस्व अ', code: 'U+0905' },
  { char: 'आ', display: 'आ', name: 'दीर्घ आ', code: 'U+0906' },
  { char: 'इ', display: 'इ', name: 'ह्रस्व इ', code: 'U+0907' },
  { char: 'ई', display: 'ई', name: 'दीर्घ ई', code: 'U+0908' },
  { char: 'उ', display: 'उ', name: 'ह्रस्व उ', code: 'U+0909' },
  { char: 'ऊ', display: 'ऊ', name: 'दीर्घ ऊ', code: 'U+090A' },
  { char: 'ऋ', display: 'ऋ', name: 'ह्रस्व ऋ', code: 'U+090B' },
  { char: 'ॠ', display: 'ॠ', name: 'दीर्घ ॠ', code: 'U+0960' },
  { char: 'ऌ', display: 'ऌ', name: 'ह्रस्व ऌ', code: 'U+090C' },
  { char: 'ॡ', display: 'ॡ', name: 'दीर्घ ॡ', code: 'U+0961' },
  { char: 'ए', display: 'ए', name: 'ए', code: 'U+090F' },
  { char: 'ऐ', display: 'ऐ', name: 'ऐ', code: 'U+0910' },
  { char: 'ओ', display: 'ओ', name: 'ओ', code: 'U+0913' },
  { char: 'औ', display: 'औ', name: 'औ', code: 'U+0914' },
  // Vedic / dialectal vowels
  { char: 'ऎ', display: 'ऎ', name: 'ह्रस्व ए (द्रविड़/वैदिक)', code: 'U+090E' },
  { char: 'ऒ', display: 'ऒ', name: 'ह्रस्व ओ (द्रविड़/वैदिक)', code: 'U+0912' },
  { char: 'ऍ', display: 'ऍ', name: 'चन्द्र ए', code: 'U+090D' },
  { char: 'ऑ', display: 'ऑ', name: 'चन्द्र ओ', code: 'U+0911' }
];

export const CONSONANT_GROUPS = [
  {
    group: 'कवर्ग (कण्ठ्य - Guttural)',
    items: [
      { char: 'क', display: 'क', name: 'क', code: 'U+0915' },
      { char: 'ख', display: 'ख', name: 'ख', code: 'U+0916' },
      { char: 'ग', display: 'ग', name: 'ग', code: 'U+0917' },
      { char: 'घ', display: 'घ', name: 'घ', code: 'U+0918' },
      { char: 'ङ', display: 'ङ', name: 'ङ', code: 'U+0919' }
    ]
  },
  {
    group: 'चवर्ग (तालव्य - Palatal)',
    items: [
      { char: 'च', display: 'च', name: 'च', code: 'U+091A' },
      { char: 'छ', display: 'छ', name: 'छ', code: 'U+091B' },
      { char: 'ज', display: 'ज', name: 'ज', code: 'U+091C' },
      { char: 'झ', display: 'झ', name: 'झ', code: 'U+091D' },
      { char: 'ञ', display: 'ञ', name: 'ञ', code: 'U+091E' }
    ]
  },
  {
    group: 'टवर्ग (मूर्धन्य - Retroflex)',
    items: [
      { char: 'ट', display: 'ट', name: 'ट', code: 'U+091F' },
      { char: 'ठ', display: 'ठ', name: 'ठ', code: 'U+0920' },
      { char: 'ड', display: 'ड', name: 'ड', code: 'U+0921' },
      { char: 'ढ', display: 'ढ', name: 'ढ', code: 'U+0922' },
      { char: 'ण', display: 'ण', name: 'ण', code: 'U+0923' }
    ]
  },
  {
    group: 'तवर्ग (दन्त्य - Dental)',
    items: [
      { char: 'त', display: 'त', name: 'त', code: 'U+0924' },
      { char: 'थ', display: 'थ', name: 'थ', code: 'U+0925' },
      { char: 'द', display: 'द', name: 'द', code: 'U+0926' },
      { char: 'ध', display: 'ध', name: 'ध', code: 'U+0927' },
      { char: 'न', display: 'न', name: 'न', code: 'U+0928' }
    ]
  },
  {
    group: 'पवर्ग (ओष्ठ्य - Labial)',
    items: [
      { char: 'प', display: 'प', name: 'प', code: 'U+092A' },
      { char: 'फ', display: 'फ', name: 'फ', code: 'U+092B' },
      { char: 'ब', display: 'ब', name: 'ब', code: 'U+092C' },
      { char: 'भ', display: 'भ', name: 'भ', code: 'U+092D' },
      { char: 'म', display: 'म', name: 'म', code: 'U+092E' }
    ]
  },
  {
    group: 'अन्तःस्थ (Semivowels)',
    items: [
      { char: 'य', display: 'य', name: 'य', code: 'U+092F' },
      { char: 'र', display: 'र', name: 'र', code: 'U+0930' },
      { char: 'ल', display: 'ल', name: 'ल', code: 'U+0932' },
      { char: 'व', display: 'व', name: 'व', code: 'U+0935' }
    ]
  },
  {
    group: 'ऊष्मन् (Sibilants & Aspirate)',
    items: [
      { char: 'श', display: 'श', name: 'श (तालव्य)', code: 'U+0936' },
      { char: 'ष', display: 'ष', name: 'ष (मूर्धन्य)', code: 'U+0937' },
      { char: 'स', display: 'स', name: 'स (दन्त्य)', code: 'U+0938' },
      { char: 'ह', display: 'ह', name: 'ह', code: 'U+0939' }
    ]
  },
  {
    group: 'वैदिक व्यञ्जनानि (Vedic Consonants)',
    items: [
      { char: 'ळ', display: 'ळ', name: 'वैदिक ळकार (डस्य स्थाने)', code: 'U+0933' },
      { char: 'ऴ', display: 'ऴ', name: 'वैदिक ऴकार', code: 'U+0934' },
      { char: 'ळ्ह', display: 'ळ्ह', name: 'वैदिक ळ्ह (ढस्य स्थाने)', code: 'U+0933+094D+0939' }
    ]
  },
  {
    group: 'संयुक्ताक्षराणि (Common Conjuncts)',
    items: [
      { char: 'क्ष', display: 'क्ष', name: 'क्ष (क्+ष)', code: 'U+0915+094D+0937' },
      { char: 'त्र', display: 'त्र', name: 'त्र (त्+र)', code: 'U+0924+094D+0930' },
      { char: 'ज्ञ', display: 'ज्ञ', name: 'ज्ञ (ज्+ञ)', code: 'U+091C+094D+091E' },
      { char: 'श्र', display: 'श्र', name: 'श्र (श्+र)', code: 'U+0936+094D+0930' },
      { char: 'द्य', display: 'द्य', name: 'द्य (द्+य)', code: 'U+0926+094D+092F' },
      { char: 'द्व', display: 'द्व', name: 'द्व (द्+व)', code: 'U+0926+094D+0935' }
    ]
  }
];

export const MATRAS = [
  { char: '\u093E', display: '◌ा', name: 'आ-मात्रा', code: 'U+093E', isCombining: true },
  { char: '\u093F', display: '◌ि', name: 'इ-मात्रा', code: 'U+093F', isCombining: true },
  { char: '\u0940', display: '◌ी', name: 'ई-मात्रा', code: 'U+0940', isCombining: true },
  { char: '\u0941', display: '◌ु', name: 'उ-मात्रा', code: 'U+0941', isCombining: true },
  { char: '\u0942', display: '◌ू', name: 'ऊ-मात्रा', code: 'U+0942', isCombining: true },
  { char: '\u0943', display: '◌ृ', name: 'ऋ-मात्रा', code: 'U+0943', isCombining: true },
  { char: '\u0944', display: '◌ॄ', name: 'ॠ-मात्रा', code: 'U+0944', isCombining: true },
  { char: '\u0962', display: '◌ॢ', name: 'ऌ-मात्रा', code: 'U+0962', isCombining: true },
  { char: '\u0963', display: '◌ॣ', name: 'ॡ-मात्रा', code: 'U+0963', isCombining: true },
  { char: '\u0947', display: '◌े', name: 'ए-मात्रा', code: 'U+0947', isCombining: true },
  { char: '\u0948', display: '◌ै', name: 'ऐ-मात्रा', code: 'U+0948', isCombining: true },
  { char: '\u094B', display: '◌ो', name: 'ओ-मात्रा', code: 'U+094B', isCombining: true },
  { char: '\u094C', display: '◌ौ', name: 'औ-मात्रा', code: 'U+094C', isCombining: true },
  // Additional regional/vedic matras
  { char: '\u0946', display: '◌ॆ', name: 'ह्रस्व ए-मात्रा', code: 'U+0946', isCombining: true },
  { char: '\u094A', display: '◌ॊ', name: 'ह्रस्व ओ-मात्रा', code: 'U+094A', isCombining: true },
  { char: '\u0945', display: '◌ॅ', name: 'चन्द्र ए-मात्रा', code: 'U+0945', isCombining: true },
  { char: '\u0949', display: '◌ॉ', name: 'चन्द्र ओ-मात्रा', code: 'U+0949', isCombining: true }
];

export const SANSKRIT_SIGNS = [
  { char: '\u094D', display: '◌्', name: 'हलन्त / विराम (Virāma)', code: 'U+094D', isCombining: true },
  { char: '\u0902', display: '◌ं', name: 'अनुस्वार (Anusvāra)', code: 'U+0902', isCombining: true },
  { char: '\u0903', display: '◌ः', name: 'विसर्ग (Visarga)', code: 'U+0903', isCombining: true },
  { char: '\u0901', display: '◌ँ', name: 'चन्द्रबिन्दु (Candrabindu)', code: 'U+0901', isCombining: true },
  { char: '\u093D', display: 'ऽ', name: 'अवग्रह (Avagraha)', code: 'U+093D' },
  { char: '\u0964', display: '।', name: 'दण्ड (विराम चिह्न)', code: 'U+0964' },
  { char: '\u0965', display: '॥', name: 'द्विदण्ड (पूर्णविराम)', code: 'U+0965' },
  { char: '\u0950', display: 'ॐ', name: 'प्रणव (ॐ / Om)', code: 'U+0950' },
  { char: '\u093C', display: '◌़', name: 'नुक्ता (Nuktā)', code: 'U+093C', isCombining: true },
  { char: '\u0900', display: '◌ऀ', name: 'विपर्यस्त चन्द्रबिन्दु', code: 'U+0900', isCombining: true },
  { char: '\u0970', display: '॰', name: 'संक्षेप चिह्न (Abbreviation)', code: 'U+0970' }
];

export const DEVANAGARI_DIGITS = [
  { char: '०', display: '०', name: 'शून्य', code: 'U+0966' },
  { char: '१', display: '१', name: 'एक', code: 'U+0967' },
  { char: '२', display: '२', name: 'द्वि', code: 'U+0968' },
  { char: '३', display: '३', name: 'त्रि', code: 'U+0969' },
  { char: '४', display: '४', name: 'चतुर्', code: 'U+096A' },
  { char: '५', display: '५', name: 'पञ्च', code: 'U+096B' },
  { char: '६', display: '६', name: 'षष्', code: 'U+096C' },
  { char: '७', display: '७', name: 'सप्त', code: 'U+096D' },
  { char: '८', display: '८', name: 'अष्ट', code: 'U+096E' },
  { char: '९', display: '९', name: 'नव', code: 'U+096F' }
];
