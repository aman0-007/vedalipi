/**
 * Sanskrit & Vedic Phonetic Transliteration Engine (Hinglish / Roman -> Devanagari Sanskrit)
 * Provides smart dictionary lookup + algorithmic phonetic fallback for Sanskrit words.
 */

// 1. Curated Sanskrit Lexicon for common greetings, philosophical terms, Vedic concepts, pronouns, verbs
export const SANSKRIT_DICT = {
  // Greetings & Conversational
  'namaste': ['नमस्ते', 'नमस् ते', 'नमः'],
  'namaskar': ['नमस्कारः', 'नमस्कार'],
  'namaskara': ['नमस्कारः', 'नमस्कार'],
  'namaskaram': ['नमस्कारम्'],
  'pranam': ['प्रणामः', 'प्रणाम'],
  'pranama': ['प्रणामः', 'प्रणाम'],
  'swagatam': ['स्वागतम्'],
  'svagatam': ['स्वागतम्'],
  'dhanyavad': ['धन्यवादः', 'धन्यवाद'],
  'dhanyavada': ['धन्यवादः', 'धन्यवाद'],
  'kripa': ['कृपया', 'कृपा'],
  'kripaya': ['कृपया'],
  'shubham': ['शुभम्', 'शुभ'],
  'suprabhatam': ['सुप्रभातम्'],
  'shubharatri': ['शुभरात्रिः', 'शुभरात्रि'],
  'punarmilana': ['पुनर्मीलनाय', 'पुनर्मिलनम्'],
  'kushalam': ['कुशलम्'],
  'katham': ['कथम्'],
  'asti': ['अस्ति'],
  'nasti': ['नास्ति'],
  'am': ['आम्'],
  'na': ['न'],

  // Sacred & Vedic Terms
  'om': ['ॐ', 'ओम्'],
  'aum': ['ॐ', 'ओम्'],
  'shanti': ['शान्तिः', 'शान्ति'],
  'shaanti': ['शान्तिः', 'शान्ति'],
  'shantih': ['शान्तिः'],
  'sanskrit': ['संस्कृतम्', 'संस्कृत'],
  'samskrit': ['संस्कृतम्', 'संस्कृत'],
  'samskritam': ['संस्कृतम्'],
  'dharma': ['धर्मः', 'धर्म'],
  'karma': ['कर्म', 'कर्मन्'],
  'moksha': ['मोक्षः', 'मोक्ष'],
  'yoga': ['योगः', 'योग'],
  'veda': ['वेदः', 'वेद'],
  'vedah': ['वेदः'],
  'rigveda': ['ऋग्वेदः', 'ऋग्वेद'],
  'samaveda': ['सामवेदः', 'सामवेद'],
  'yajurveda': ['यजुर्वेदः', 'यजुर्वेद'],
  'atharvaveda': ['अथर्ववेदः', 'अथर्ववेद'],
  'upanishad': ['उपनिषद्', 'उपनिषत्'],
  'sukta': ['सूक्तम्', 'सूक्त'],
  'suktam': ['सूक्तम्'],
  'mantra': ['मन्त्रः', 'मन्त्रम्', 'मन्त्र'],
  'mantram': ['मन्त्रम्'],
  'gayatri': ['गायत्री'],
  'stotra': ['स्तोत्रम्', 'स्तोत्र'],
  'sloka': ['श्लोकः', 'श्लोक'],
  'shloka': ['श्लोकः', 'श्लोक'],
  'sutra': ['सूत्रम्', 'सूत्र'],
  'brahman': ['ब्रह्म', 'ब्रह्मा'],
  'brahma': ['ब्रह्मा', 'ब्रह्म'],
  'atman': ['आत्मा', 'आत्मन्'],
  'atma': ['आत्मा'],
  'paramatman': ['परमात्मा', 'परमात्मन्'],
  'purusha': ['पुरुषः', 'पुरुष'],
  'prakriti': ['प्रकृतिः', 'प्रकृति'],
  'maya': ['माया'],
  'satya': ['सत्यम्', 'सत्य'],
  'satyam': ['सत्यम्'],
  'ananda': ['आनन्दः', 'आनन्द'],
  'jnana': ['ज्ञानम्', 'ज्ञान'],
  'gyan': ['ज्ञानम्', 'ज्ञान'],
  'vidya': ['विद्या'],
  'avidya': ['अविद्या'],
  'guru': ['गुरुः', 'गुरु'],
  'guruh': ['गुरुः'],
  'shishya': ['शिष्यः', 'शिष्य'],
  'acharya': ['आचार्यः', 'आचार्य'],
  'rishi': ['ऋषिः', 'ऋषि'],
  'muni': ['मुनिः', 'मुनि'],
  'ashrama': ['आश्रमः', 'आश्रम'],
  'ashram': ['आश्रमः', 'आश्रम'],
  'yajna': ['यज्ञः', 'यज्ञ'],
  'homa': ['होमः', 'होम'],
  'havan': ['हवनम्', 'हवन'],
  'ahuti': ['आहुतिः', 'आहुति'],
  'tapas': ['तपः', 'तपस्या'],
  'dhyana': ['ध्यानम्', 'ध्यान'],
  'samadhi': ['समाधिः', 'समाधि'],
  'pranayama': ['प्राणायामः', 'प्राणायाम'],
  'ahimsa': ['अहिंसा'],

  // Deities & Personalities
  'krishna': ['कृष्णः', 'कृष्ण'],
  'ram': ['रामः', 'राम'],
  'rama': ['रामः', 'राम'],
  'shiva': ['शिवः', 'शिव'],
  'siva': ['शिवः', 'शिव'],
  'vishnu': ['विष्णुः', 'विष्णु'],
  'ganesha': ['गणेशः', 'गणेश'],
  'ganapati': ['गणपतिः', 'गणपति'],
  'hanuman': ['हनुमान्', 'हनुमत्'],
  'durga': ['दुर्गा'],
  'lakshmi': ['लक्ष्मीः', 'लक्ष्मी'],
  'saraswati': ['सरस्वती'],
  'parvati': ['पार्वती'],
  'kali': ['काली'],
  'surya': ['सूर्यः', 'सूर्य'],
  'chandra': ['चन्द्रः', 'चन्द्र'],
  'agni': ['अग्निः', 'अग्नि'],
  'agnim': ['अग्निम्'],
  'indra': ['इन्द्रः', 'इन्द्र'],
  'varuna': ['वरुणः', 'वरुण'],
  'vayu': ['वायुः', 'वायु'],
  'soma': ['सोमः', 'सोम'],
  'yama': ['यमः', 'यम'],
  'arjuna': ['अर्जुनः', 'अर्जुन'],
  'sita': ['सीता'],
  'radha': ['राधा'],
  'radhe': ['राधे'],
  'bhagavan': ['भगवान्'],
  'ishwara': ['ईश्वरः', 'ईश्वर'],
  'deva': ['देवः', 'देव'],
  'devi': ['देवी'],
  'devata': ['देवता'],

  // Pronouns & Particles
  'aham': ['अहम्'],
  'tvam': ['त्वम्'],
  'sah': ['सः'],
  'saa': ['सा'],
  'tat': ['तत्'],
  'vayam': ['वयम्'],
  'yuyam': ['यूयम्'],
  'te': ['ते'],
  'etad': ['एतत्'],
  'ayam': ['अयम्'],
  'iyam': ['इयम्'],
  'idam': ['इदम्'],
  'cha': ['च'],
  'api': ['अपि'],
  'eva': ['एव'],
  'iti': ['इति'],
  'iva': ['इव'],
  'yatha': ['यथा'],
  'tatha': ['तथा'],
  'yada': ['यदा'],
  'tada': ['तदा'],
  'kada': ['कदा'],
  'atra': ['अत्र'],
  'tatra': ['तत्र'],
  'kutra': ['कुत्र'],
  'sarvatra': ['सर्वत्र'],
  'kim': ['किम्'],
  'sarve': ['सर्वे'],
  'sarvam': ['सर्वम्', 'सर्व'],

  // Common Verbs
  'bhavati': ['भवति'],
  'bhavanti': ['भवन्ति'],
  'bhavasi': ['भवसि'],
  'bhavami': ['भवामि'],
  'karoti': ['करोति'],
  'kurvanti': ['कुर्वन्ति'],
  'karosi': ['करोषि'],
  'karomi': ['करोमि'],
  'kuru': ['कुरु'],
  'gacchati': ['गच्छति'],
  'agacchati': ['आगच्छति'],
  'pathati': ['पठति'],
  'likhati': ['लिखति'],
  'vadati': ['वदति'],
  'pashyati': ['पश्यति'],
  'shrinoti': ['शृणोति'],
  'janati': ['जानाति'],
  'dadati': ['ददाति'],
  'icfhati': ['इच्छति'],
  'namami': ['नमामि'],

  // Nouns & Entities
  'mitra': ['मित्रम्', 'मित्रः', 'मित्र'],
  'mitram': ['मित्रम्'],
  'desha': ['देशः', 'देश'],
  'bharat': ['भारतम्', 'भारत'],
  'bharata': ['भारतम्', 'भारत'],
  'mata': ['माता'],
  'pita': ['पिता'],
  'janani': ['जननी'],
  'bhrata': ['भ्राता'],
  'putra': ['पुत्रः', 'पुत्र'],
  'putri': ['पुत्री'],
  'kanya': ['कन्या'],
  'nari': ['नारी'],
  'raja': ['राजा'],
  'griha': ['गृहम्', 'गृह'],
  'griham': ['गृहम्'],
  'vanam': ['वनम्', 'वन'],
  'jalam': ['जलम्', 'जल'],
  'pushpam': ['पुष्पम्', 'पुष्प'],
  'phalam': ['फलम्', 'फल'],
  'vriksha': ['वृक्षः', 'वृक्ष'],
  'nadI': ['नदी'],
  'nadi': ['नदी'],
  'sagara': ['सागरः', 'सागर'],
  'parvata': ['पर्वतः', 'पर्वत'],
  'surabhi': ['सुरभिः'],
  'dhenu': ['धेनुः'],
  'ashwa': ['अश्वः', 'अश्व'],
  'gaja': ['गजः', 'गज']
};

// 2. Algorithmic Phonetic Transliteration Rules
const CONSONANTS = [
  ['ksh', 'क्ष'], ['shh', 'ष'], ['chh', 'छ'], ['dny', 'ज्ञ'], ['jny', 'ज्ञ'], ['shr', 'श्र'],
  ['kh', 'ख'], ['gh', 'घ'], ['ng', 'ङ'], ['ch', 'च'], ['jh', 'झ'], ['ny', 'ञ'],
  ['th', 'थ'], ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'], ['tr', 'त्र'],
  ['gy', 'ज्ञ'], ['jn', 'ज्ञ'],
  ['k', 'क'], ['g', 'ग'], ['c', 'च'], ['j', 'ज'],
  ['t', 'त'], ['d', 'द'], ['n', 'न'], ['p', 'प'], ['f', 'फ'], ['b', 'ब'], ['m', 'म'],
  ['y', 'य'], ['r', 'र'], ['l', 'ल'], ['v', 'व'], ['w', 'व'], ['s', 'स'], ['h', 'ह'],
  ['x', 'क्ष']
];

const VOWELS = [
  ['aa', 'आ', 'ा'], ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'], ['oo', 'ऊ', 'ू'], ['uu', 'ऊ', 'ू'],
  ['ri', 'ऋ', 'ृ'], ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'], ['ou', 'औ', 'ौ'],
  ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'], ['e', 'ए', 'े'], ['o', 'ओ', 'ो']
];

const VIRAMA = '्';

/**
 * Transliterate arbitrary Latin/Hinglish string to Devanagari
 * @param {string} input 
 * @returns {string}
 */
export function transliterateLatinToDevanagari(input) {
  if (!input) return '';
  let s = input.toLowerCase().trim();

  // Special symbols
  if (s === 'om' || s === 'aum') return 'ॐ';

  let res = '';
  let i = 0;
  let prevWasConsonant = false;

  while (i < s.length) {
    if (!/[a-z]/.test(s[i])) {
      res += s[i];
      prevWasConsonant = false;
      i++;
      continue;
    }

    // Check special Vedic / Sanskrit combinations
    // 'shn' -> ष्ण (e.g. krishna)
    if (s.startsWith('shn', i)) {
      if (prevWasConsonant && res.endsWith(VIRAMA)) {
        res += 'ष्ण' + VIRAMA;
      } else {
        res += 'ष्ण' + VIRAMA;
      }
      prevWasConsonant = true;
      i += 3;
      continue;
    }

    // 'mm' -> म्म, 'tt' -> त्त, 'dd' -> द्द, etc.
    // Check vowels first
    let matchedVowel = null;
    for (const [key, initial, matra] of VOWELS) {
      if (s.startsWith(key, i)) {
        matchedVowel = { key, initial, matra };
        break;
      }
    }

    if (matchedVowel) {
      if (prevWasConsonant && res.endsWith(VIRAMA)) {
        // Drop virama and attach matra
        res = res.slice(0, -1) + matchedVowel.matra;
      } else {
        res += matchedVowel.initial;
      }
      prevWasConsonant = false;
      i += matchedVowel.key.length;
      continue;
    }

    // Check consonants
    let matchedConsonant = null;
    for (const [key, char] of CONSONANTS) {
      if (s.startsWith(key, i)) {
        matchedConsonant = { key, char };
        break;
      }
    }

    if (matchedConsonant) {
      res += matchedConsonant.char + VIRAMA;
      prevWasConsonant = true;
      i += matchedConsonant.key.length;
      continue;
    }

    res += s[i];
    prevWasConsonant = false;
    i++;
  }

  // If word ends with virama, in normal Sanskrit input, provide clean stem by default
  return res;
}

/**
 * Generate suggestions for the currently typed Latin word
 * @param {string} rawWord 
 * @param {number} maxCount 
 * @returns {Array<string>}
 */
export function getSanskritSuggestions(rawWord, maxCount = 5) {
  if (!rawWord || rawWord.trim().length === 0) return [];
  const clean = rawWord.toLowerCase().trim();

  const candidates = [];
  const seen = new Set();

  const addCandidate = (val) => {
    if (!val) return;
    const trimmed = val.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      candidates.push(trimmed);
    }
  };

  // 1. Exact match from Sanskrit Dictionary
  if (SANSKRIT_DICT[clean]) {
    for (const item of SANSKRIT_DICT[clean]) {
      addCandidate(item);
    }
  }

  // 2. Check stem matches (e.g. typing 'shant' matching 'shanti', 'dharm' matching 'dharma')
  if (clean.length >= 3) {
    for (const [key, items] of Object.entries(SANSKRIT_DICT)) {
      if (key !== clean && key.startsWith(clean)) {
        addCandidate(items[0]);
        if (candidates.length >= maxCount) break;
      }
    }
  }

  // 3. Algorithmic transliteration
  const algorithmicBase = transliterateLatinToDevanagari(clean);
  if (algorithmicBase) {
    // If ending with halanta (e.g. रम् or धर्म्), also create non-halanta (राम / धर्म)
    if (algorithmicBase.endsWith(VIRAMA)) {
      const stem = algorithmicBase.slice(0, -1);
      addCandidate(stem);
      // Add visarga option for masculine nouns
      addCandidate(stem + 'ः');
      // Add anusvara option for neuter nouns
      addCandidate(stem + 'म्');
      addCandidate(algorithmicBase); // pure halanta
    } else {
      addCandidate(algorithmicBase);
      // If ends in 'a' sound, add visarga
      if (clean.endsWith('a')) {
        addCandidate(algorithmicBase + 'ः');
        addCandidate(algorithmicBase + 'म्');
      }
    }
  }

  // 4. Always offer the raw English input as the last choice
  addCandidate(rawWord);

  return candidates.slice(0, maxCount);
}
