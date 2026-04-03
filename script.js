/* ============================================================
   UPSC Mentorship Platform - Main JavaScript
   ============================================================ */

'use strict';

/* ─── EmailJS Configuration ──────────────────────────────────
   SETUP INSTRUCTIONS:
   1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
   2. Create an Email Service (Gmail, Outlook, etc.) → copy Service ID
   3. Create an Email Template → copy Template ID
      Template variables: {{to_email}}, {{from_name}}, {{from_email}},
        {{phone}}, {{education}}, {{exam_type}}, {{course}},
        {{message}}, {{submission_date}}
   4. Go to Account → Public Key → copy it
   5. Replace the placeholder strings below with your real keys
   ──────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  publicKey:   '7XUDyVJArJDw76JT5',
  serviceId:   'service_i06t216',
  templateId:  'template_burp5li',
  adminEmail:  'bookstalkwithv@gmail.com'
};

/* ─── Firebase Configuration ─────────────────────────────────
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create a new project (or use existing)
   3. Click "Add app" → Web → register app → copy the config below
   4. Go to Firestore Database → Create database → Start in test mode
   5. Replace ALL placeholder values below with your real Firebase config
   ──────────────────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCRPy-PfIYeIouAYrc5l7vJvf-mtCC-4lI",
  authDomain: "upsc247-4d148.firebaseapp.com",
  projectId: "upsc247-4d148",
  storageBucket: "upsc247-4d148.firebasestorage.app",
  messagingSenderId: "853317287069",
  appId: "1:853317287069:web:84d231ce20322cb50ae874",
  measurementId: "G-EXE67FWL9S"
};

// Initialize Firebase immediately (runs before any page init)
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

/* ─── Debug Logger (silent in production) ───────────────────
   Set _DEBUG = true only when actively developing.           */
const _DEBUG = false;
const _log   = (...a) => { if (_DEBUG) _log(...a); };
const _warn  = (...a) => { if (_DEBUG) _warn(...a); };
const _err   = (...a) => { if (_DEBUG) _err(...a); };

/* ─── Default Courses ────────────────────────────────────── */
const DEFAULT_COURSES = [
  {
    id: 'default_1',
    name: 'UPSC CSE Foundation',
    description: 'A comprehensive foundation program covering all three stages of the Civil Services Examination — Prelims, Mains, and Interview. Ideal for fresh aspirants starting their UPSC journey.',
    icon: 'fa-landmark',
    duration: '12 Months',
    seats: 'Limited'
  },
  {
    id: 'default_2',
    name: 'GS Mains Intensive',
    description: 'An advanced course focused exclusively on General Studies Papers 1–4 for the UPSC Mains. Features daily answer writing practice, model answers, and expert feedback sessions.',
    icon: 'fa-book-open',
    duration: '6 Months',
    seats: 'Limited'
  },
  {
    id: 'default_3',
    name: 'CSAT & Prelims Booster',
    description: 'A targeted crash program to master CSAT Paper 2 and General Studies Paper 1 for UPSC Prelims. Includes topic-wise tests, full-length mock exams, and performance analytics.',
    icon: 'fa-chart-line',
    duration: '3 Months',
    seats: 'Available'
  },
  {
    id: 'default_4',
    name: 'Optional Subject — History',
    description: 'Expert-guided optional subject course for History, one of the highest-scoring optionals in UPSC Mains. Covers ancient, medieval, modern, and world history with map work and sources.',
    icon: 'fa-scroll',
    duration: '4 Months',
    seats: 'Available'
  },
  {
    id: 'default_5',
    name: 'Essay & Ethics Mastery',
    description: 'Dedicated coaching for GS Paper 4 (Ethics) and Essay paper — the two highest differentiators in UPSC Mains. Includes case-study workshops, philosophical frameworks, and essay clinics.',
    icon: 'fa-feather-alt',
    duration: '2 Months',
    seats: 'Available'
  }
];

const DEFAULT_COURSES_UPPCS = [
  {
    id: 'uppcs_default_1',
    name: 'UPPCS Prelims Foundation',
    description: 'Comprehensive preparation for UP PCS Prelims covering GS Paper I and CSAT Paper II. Includes topic-wise tests, previous year papers analysis, and full-length mock exams specific to UPPCS pattern.',
    icon: 'fa-landmark',
    duration: '4 Months',
    seats: 'Limited'
  },
  {
    id: 'uppcs_default_2',
    name: 'UPPCS Mains General Studies',
    description: 'In-depth coverage of all GS papers for UPPCS Mains with focus on UP-specific topics — history, culture, geography, economy, and current affairs of Uttar Pradesh.',
    icon: 'fa-book-open',
    duration: '6 Months',
    seats: 'Limited'
  },
  {
    id: 'uppcs_default_3',
    name: 'UPPCS Essay & Hindi',
    description: 'Dedicated coaching for the Essay paper and Hindi language paper in UPPCS Mains. Covers essay structure, Hindi grammar, letter writing, and précis writing with regular practice sessions.',
    icon: 'fa-feather-alt',
    duration: '2 Months',
    seats: 'Available'
  },
  {
    id: 'uppcs_default_4',
    name: 'Optional Subject — Sociology (UPPCS)',
    description: 'Expert-guided optional subject course for Sociology, a popular choice in UPPCS Mains. Covers classical and modern thinkers, Indian society, and social issues with answer writing practice.',
    icon: 'fa-scroll',
    duration: '3 Months',
    seats: 'Available'
  },
  {
    id: 'uppcs_default_5',
    name: 'UPPCS Interview Guidance',
    description: 'Personalised interview preparation for the UP PCS personality test. Includes mock interviews, DAF analysis, current affairs of Uttar Pradesh, and personality development sessions.',
    icon: 'fa-user-tie',
    duration: '1 Month',
    seats: 'Limited'
  }
];

const DEFAULT_COURSES_BPSC = [
  {
    id: 'bpsc_default_1',
    name: 'BPSC Prelims Booster',
    description: 'Targeted preparation for BPSC Combined Competitive Exam Prelims. Covers General Studies with special focus on Bihar-specific topics, previous year papers, and full-length mock tests.',
    icon: 'fa-chart-line',
    duration: '3 Months',
    seats: 'Available'
  },
  {
    id: 'bpsc_default_2',
    name: 'BPSC Mains General Studies',
    description: 'Comprehensive coaching for all three GS papers in BPSC Mains with dedicated focus on Bihar history, culture, geography, economy, and polity. Includes weekly answer writing sessions.',
    icon: 'fa-book-open',
    duration: '5 Months',
    seats: 'Limited'
  },
  {
    id: 'bpsc_default_3',
    name: 'Optional Subject — History (BPSC)',
    description: 'Expert-guided History optional for BPSC Mains. Covers Bihar history in detail alongside ancient, medieval, modern Indian and world history with sources and map work.',
    icon: 'fa-scroll',
    duration: '3 Months',
    seats: 'Available'
  },
  {
    id: 'bpsc_default_4',
    name: 'BPSC Hindi & Essay',
    description: 'Focused preparation for the Hindi language and Essay papers in BPSC Mains. Covers Hindi grammar, composition, précis writing, and essay clinics with model answers.',
    icon: 'fa-feather-alt',
    duration: '2 Months',
    seats: 'Available'
  },
  {
    id: 'bpsc_default_5',
    name: 'BPSC Interview Preparation',
    description: 'Structured interview coaching for the BPSC personality test. Includes mock interviews, DAF-based discussions, Bihar current affairs, and communication skills development.',
    icon: 'fa-user-tie',
    duration: '1 Month',
    seats: 'Limited'
  }
];

/* ─── Exam Type Helpers ──────────────────────────────────── */

const EXAM_TYPES = ['UPSC', 'UPPCS', 'BPSC'];

function getDefaultCoursesForExam(examType) {
  if (examType === 'UPPCS') return DEFAULT_COURSES_UPPCS;
  if (examType === 'BPSC')  return DEFAULT_COURSES_BPSC;
  return DEFAULT_COURSES;
}

/* ─── Firestore Helpers ──────────────────────────────────── */

/**
 * Fetch courses for a given exam type from Firestore.
 * Falls back to hardcoded defaults if Firestore is unavailable or not configured.
 * Document path: courses/{examType}  →  field: list (array)
 */
async function getCourses(examType) {
  const exam = examType || 'UPSC';
  try {
    const doc = await db.collection('courses').doc(exam).get();
    if (doc.exists && doc.data().list && doc.data().list.length > 0) {
      return doc.data().list;
    }
    // Document missing — return defaults so the page is never blank
    return getDefaultCoursesForExam(exam);
  } catch (e) {
    _err('getCourses error (falling back to defaults):', e);
    return getDefaultCoursesForExam(exam);
  }
}

/**
 * Save the full courses array for a given exam type to Firestore.
 */
async function saveCourses(courses, examType) {
  const exam = examType || 'UPSC';
  try {
    await db.collection('courses').doc(exam).set({ list: courses });
    _log(`saveCourses: wrote ${courses.length} courses for ${exam}`);
  } catch (e) {
    _err('saveCourses error:', e.code, e.message);
    throw e;
  }
}

/**
 * Fetch all admission records from Firestore, newest first.
 */
async function getAdmissions() {
  try {
    const snap = await db.collection('admissions')
      .orderBy('submittedAt', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    _err('getAdmissions error:', e);
    return [];
  }
}

/**
 * Add a single admission record to Firestore.
 */
async function addAdmission(formData) {
  try {
    await db.collection('admissions').doc(formData.id).set(formData);
    _log('addAdmission: saved', formData.id);
  } catch (e) {
    _err('addAdmission error:', e.code, e.message);
    throw e;
  }
}

/**
 * Delete a single admission record from Firestore.
 */
async function deleteAdmissionById(id) {
  await db.collection('admissions').doc(id).delete();
}

/**
 * Delete ALL admission records from Firestore in one batch.
 */
async function clearAllAdmissions() {
  const snap  = await db.collection('admissions').get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

/* ─── Seed Defaults (runs once on first visit) ──────────── */

async function initDefaults() {
  for (const examType of EXAM_TYPES) {
    try {
      // Check Firestore directly — do NOT use getCourses() which has a fallback
      const doc = await db.collection('courses').doc(examType).get();
      const hasData = doc.exists && doc.data().list && doc.data().list.length > 0;
      if (!hasData) {
        _log(`initDefaults: seeding ${examType} courses into Firestore…`);
        await saveCourses(getDefaultCoursesForExam(examType), examType);
        _log(`initDefaults: ${examType} seeded successfully`);
      } else {
        _log(`initDefaults: ${examType} already has ${doc.data().list.length} courses`);
      }
    } catch (e) {
      _err(`initDefaults failed for ${examType}:`, e.code, e.message);
    }
  }
}

/* ─── Form Validation Helper ─────────────────────────────── */

const VALIDATORS = {
  required:  (val)      => val.trim().length > 0,
  minLength: (val, min) => val.trim().length >= min,
  email:     (val)      => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
  phone:     (val)      => /^[6-9]\d{9}$/.test(val.trim()),
  maxLength: (val, max) => val.trim().length <= max
};

function validateField(field, rules) {
  const value = field.value || '';
  let message = '';
  let valid   = true;

  if (rules.required && !VALIDATORS.required(value)) {
    valid = false; message = 'This field is required.';
  } else if (rules.email && value && !VALIDATORS.email(value)) {
    valid = false; message = 'Please enter a valid email address.';
  } else if (rules.phone && value && !VALIDATORS.phone(value)) {
    valid = false; message = 'Please enter a valid 10-digit Indian mobile number.';
  } else if (rules.minLength && value && !VALIDATORS.minLength(value, rules.minLength)) {
    valid = false; message = `Must be at least ${rules.minLength} characters.`;
  } else if (rules.maxLength && value && !VALIDATORS.maxLength(value, rules.maxLength)) {
    valid = false; message = `Cannot exceed ${rules.maxLength} characters.`;
  }

  field.classList.remove('is-valid', 'is-invalid');
  const feedback = field.parentElement.querySelector('.invalid-feedback');

  if (value.trim() !== '' || rules.required) {
    field.classList.add(valid ? 'is-valid' : 'is-invalid');
  }

  if (feedback) {
    feedback.textContent = message;
    feedback.classList.toggle('show', !valid && value.trim() !== '');
  }

  return { valid, message };
}

function validateForm(rulesMap) {
  let allValid = true;
  for (const [id, rules] of Object.entries(rulesMap)) {
    const field = document.getElementById(id);
    if (!field) continue;
    if (!validateField(field, rules).valid) allValid = false;
  }
  return allValid;
}

/* ─── Render Courses ─────────────────────────────────────── */

const COURSE_ICONS = [
  'fa-landmark', 'fa-book-open', 'fa-chart-line',
  'fa-scroll', 'fa-feather-alt', 'fa-graduation-cap',
  'fa-brain', 'fa-map', 'fa-balance-scale'
];

async function renderCourses(containerId, examType) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show spinner while loading
  container.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="loader-ring" style="margin:0 auto 1rem"></div>
      <p>Loading courses…</p>
    </div>`;

  const courses = await getCourses(examType || 'UPSC');

  if (!courses || courses.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="fas fa-book-open"></i>
        <p>No courses available yet. Check back soon!</p>
      </div>`;
    return;
  }

  container.innerHTML = courses.map((course, index) => {
    const icon      = course.icon || COURSE_ICONS[index % COURSE_ICONS.length];
    const duration  = course.duration || '–';
    const seats     = course.seats || 'Available';
    const seatsClass = seats.toLowerCase().includes('limited') ? 'badge-accent' : 'badge-success';

    return `
      <article class="course-card animate-fade-up delay-${(index % 4) + 1}" data-id="${escapeHtml(course.id)}">
        <div class="course-card-icon">
          <i class="fas ${escapeHtml(icon)}"></i>
        </div>
        <h3>${escapeHtml(course.name)}</h3>
        <p>${escapeHtml(course.description)}</p>
        <div class="course-card-footer">
          <span class="badge ${seatsClass}">
            <i class="fas fa-circle" style="font-size:0.45rem"></i>
            ${escapeHtml(seats)}
          </span>
          <a href="apply.html" class="btn btn-outline btn-sm course-apply-btn">
            Apply Now <i class="fas fa-arrow-right" style="font-size:0.75rem"></i>
          </a>
        </div>
      </article>`;
  }).join('');
}

/* ─── Utility: Escape HTML ───────────────────────────────── */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─── Utility: Format Date ───────────────────────────────── */
function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return dateStr || '–';
  }
}

/* ─── Utility: Show Toast ────────────────────────────────── */
function showToast(message, type = 'success', duration = 3500) {
  const existing = document.getElementById('upsc-toast');
  if (existing) existing.remove();

  const icons = {
    success: 'fa-check-circle',
    error:   'fa-times-circle',
    info:    'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  const toast = document.createElement('div');
  toast.id = 'upsc-toast';
  toast.style.cssText = `
    position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%) translateY(80px);
    background:var(--primary-dark); color:#fff; padding:0.85rem 1.5rem;
    border-radius:var(--radius-lg); box-shadow:var(--shadow-xl);
    display:flex; align-items:center; gap:0.7rem; font-size:0.9rem; font-weight:500;
    z-index:9999; transition:transform 0.3s ease, opacity 0.3s ease; opacity:0;
    max-width:90vw; border-left:3px solid var(--accent);
  `;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}" style="color:var(--accent)"></i>${escapeHtml(message)}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity   = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/* ─── Site Config ────────────────────────────────────────── */

const DEFAULT_SITE_CONFIG = {
  colors: { primary: '#1e3a5f', accent: '#f59e0b' },
  hero: {
    badge:          "India's #1 UPSC Mentorship Platform",
    titleMain:      'Your Journey to',
    titleHighlight: 'IAS Starts Here',
    subtitle:       "Join hundreds of successful civil servants who cracked UPSC with our structured mentorship, expert faculty, and proven study methodology. Turn your IAS dream into reality — one milestone at a time.",
    ctaText:        "Apply Now — It's Free"
  },
  stats: [
    { number: '500', suffix: '+', label: 'Students Enrolled' },
    { number: '10',  suffix: '+', label: 'Expert Courses' },
    { number: '95',  suffix: '%', label: 'Success Rate' }
  ],
  floatCard: [
    { label: 'Active Students', value: '500+' },
    { label: 'Success Rate',    value: '95%'  },
    { label: 'Courses',         value: '10+'  },
    { label: 'Expert Mentors',  value: '20+'  }
  ],
  about: {
    heading: 'Mentorship Rooted in Experience & Excellence',
    para1:   'UPSC Mentor was founded by a team of IAS and IPS officers who believe that quality civil services guidance should be accessible to every aspirant across India — regardless of background or geography.',
    para2:   'Our pedagogy is built on decades of combined UPSC experience, real exam insights, and a student-first approach that focuses on deep conceptual clarity and answer writing skills over rote learning.',
    bullets: [
      'Mentors who have personally cleared UPSC CSE',
      'Personalised study plans tailored to your strengths',
      'Weekly live doubt-clearing sessions & mock interviews',
      'Comprehensive current affairs and newspaper analysis',
      '24/7 access to study materials and recorded lectures'
    ]
  },
  features: [
    { icon: 'fas fa-chalkboard-teacher', title: 'Expert Mentors',       desc: 'Learn directly from IAS/IPS officers and UPSC specialists with first-hand knowledge of what it takes to succeed.' },
    { icon: 'fas fa-route',              title: 'Personalised Roadmap', desc: 'Every student gets a customised 12-month study plan aligned to their optional subject, strengths, and target rank.' },
    { icon: 'fas fa-pen-nib',            title: 'Answer Writing Labs',  desc: 'Daily mains answer writing practice with detailed feedback from mentors — the single biggest differentiator in UPSC.' },
    { icon: 'fas fa-satellite-dish',     title: 'Live Sessions & Tests', desc: 'Weekly live classes, topic-wise tests, full-length mock exams, and interview simulations with detailed analytics.' }
  ],
  cta: {
    heading:          'Ready to Start Your',
    headingHighlight: 'IAS Journey?',
    subtext:          "Applications are open. Limited seats available for the next batch. Apply today — it's completely free."
  }
};

function _deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = _deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

async function getSiteConfig() {
  try {
    const doc = await db.collection('siteConfig').doc('landing').get({ source: 'server' });
    if (doc.exists) return _deepMerge(DEFAULT_SITE_CONFIG, doc.data());
  } catch(e) {
    try {
      // Fallback to cache if server read fails
      const doc = await db.collection('siteConfig').doc('landing').get();
      if (doc.exists) return _deepMerge(DEFAULT_SITE_CONFIG, doc.data());
    } catch(e2) { _warn('Could not load site config:', e2.message); }
  }
  return DEFAULT_SITE_CONFIG;
}

async function saveSiteConfig(config) {
  await db.collection('siteConfig').doc('landing').set(config);
}

function _setElText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

function _darkenHex(hex, amount) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function applySiteConfig(config) {
  if (!config) return;

  // Colors
  if (config.colors) {
    document.documentElement.style.setProperty('--primary', config.colors.primary);
    document.documentElement.style.setProperty('--accent',  config.colors.accent);
    document.documentElement.style.setProperty('--primary-dark', _darkenHex(config.colors.primary, 20));
  }

  // Hero
  const h = config.hero;
  if (h) {
    _setElText('heroBadge',          h.badge);
    _setElText('heroTitleMain',      h.titleMain);
    _setElText('heroTitleHighlight', h.titleHighlight);
    _setElText('heroSubtitle',       h.subtitle);
    const ctaBtn = document.getElementById('heroCtaBtn');
    if (ctaBtn && h.ctaText) ctaBtn.innerHTML = `<i class="fas fa-rocket" aria-hidden="true"></i> ${escapeHtml(h.ctaText)}`;
  }

  // Stats
  if (config.stats) {
    config.stats.forEach((s, i) => {
      const numEl = document.querySelector(`.stat-number[data-stat-idx="${i}"]`);
      const lblEl = document.querySelector(`.stat-label[data-stat-idx="${i}"]`);
      if (numEl) { numEl.setAttribute('data-target', s.number); numEl.setAttribute('data-suffix', s.suffix); numEl.textContent = s.number + s.suffix; }
      if (lblEl) lblEl.textContent = s.label;
    });
  }

  // Float card
  if (config.floatCard) {
    config.floatCard.forEach((f, i) => { _setElText(`fcLabel${i}`, f.label); _setElText(`fcValue${i}`, f.value); });
  }

  // About
  const a = config.about;
  if (a) {
    _setElText('aboutHeading', a.heading);
    _setElText('aboutPara1',   a.para1);
    _setElText('aboutPara2',   a.para2);
    if (a.bullets) a.bullets.forEach((b, i) => _setElText(`aboutBullet${i}`, b));
  }

  // Feature cards
  if (config.features) {
    config.features.forEach((f, i) => {
      const card = document.getElementById(`feature${i}`);
      if (!card) return;
      const iconEl  = card.querySelector('.feature-icon i');
      const titleEl = card.querySelector('h3');
      const descEl  = card.querySelector('p');
      if (iconEl)  iconEl.className  = f.icon;
      if (titleEl) titleEl.textContent = f.title;
      if (descEl)  descEl.textContent  = f.desc;
    });
  }

  // CTA banner
  const c = config.cta;
  if (c) {
    const ctaH = document.getElementById('ctaHeading');
    if (ctaH) ctaH.innerHTML = `${escapeHtml(c.heading)} <span style="color:var(--accent)">${escapeHtml(c.headingHighlight)}</span>`;
    _setElText('ctaSubtext', c.subtext);
  }
}

function initSiteSettingsTab() {
  getSiteConfig().then(config => {
    // Populate color pickers
    const pc = config.colors.primary;
    const ac = config.colors.accent;
    const pcEl  = document.getElementById('scPrimaryColor');
    const pcHex = document.getElementById('scPrimaryColorHex');
    const acEl  = document.getElementById('scAccentColor');
    const acHex = document.getElementById('scAccentColorHex');
    if (pcEl)  pcEl.value  = pc;
    if (pcHex) pcHex.value = pc;
    if (acEl)  acEl.value  = ac;
    if (acHex) acHex.value = ac;

    // Sync color picker ↔ hex input
    if (pcEl && pcHex) {
      pcEl.addEventListener('input',  () => { pcHex.value = pcEl.value; });
      pcHex.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(pcHex.value)) pcEl.value = pcHex.value; });
    }
    if (acEl && acHex) {
      acEl.addEventListener('input',  () => { acHex.value = acEl.value; });
      acHex.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(acHex.value)) acEl.value = acHex.value; });
    }

    // Hero
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('scHeroBadge',          config.hero.badge);
    set('scHeroCtaText',        config.hero.ctaText);
    set('scHeroTitleMain',      config.hero.titleMain);
    set('scHeroTitleHighlight', config.hero.titleHighlight);
    set('scHeroSubtitle',       config.hero.subtitle);

    // Stats
    config.stats.forEach((s, i) => {
      const numEl    = document.querySelector(`.sc-stat-num[data-idx="${i}"]`);
      const suffEl   = document.querySelector(`.sc-stat-suffix[data-idx="${i}"]`);
      const labelEl  = document.querySelector(`.sc-stat-label[data-idx="${i}"]`);
      if (numEl)   numEl.value   = s.number;
      if (suffEl)  suffEl.value  = s.suffix;
      if (labelEl) labelEl.value = s.label;
    });

    // About
    set('scAboutHeading', config.about.heading);
    set('scAboutPara1',   config.about.para1);
    set('scAboutPara2',   config.about.para2);
    config.about.bullets.forEach((b, i) => set(`scBullet${i}`, b));

    // Features
    config.features.forEach((f, i) => {
      const iconEl  = document.querySelector(`.sc-feat-icon[data-idx="${i}"]`);
      const titleEl = document.querySelector(`.sc-feat-title[data-idx="${i}"]`);
      const descEl  = document.querySelector(`.sc-feat-desc[data-idx="${i}"]`);
      if (iconEl)  iconEl.value  = f.icon;
      if (titleEl) titleEl.value = f.title;
      if (descEl)  descEl.value  = f.desc;
    });

    // CTA
    set('scCtaHeading',   config.cta.heading);
    set('scCtaHighlight', config.cta.headingHighlight);
    set('scCtaSubtext',   config.cta.subtext);

    // Float card
    config.floatCard.forEach((f, i) => {
      const lblEl = document.querySelector(`.sc-fc-label[data-idx="${i}"]`);
      const valEl = document.querySelector(`.sc-fc-value[data-idx="${i}"]`);
      if (lblEl) lblEl.value = f.label;
      if (valEl) valEl.value = f.value;
    });
  });

  // Save handler
  document.getElementById('saveSiteSettingsBtn').addEventListener('click', async () => {
    const btn = document.getElementById('saveSiteSettingsBtn');
    const msg = document.getElementById('siteSettingsSaveMsg');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Saving…';

    const getVal = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

    const config = {
      colors: {
        primary: document.getElementById('scPrimaryColor').value,
        accent:  document.getElementById('scAccentColor').value
      },
      hero: {
        badge:          getVal('scHeroBadge'),
        titleMain:      getVal('scHeroTitleMain'),
        titleHighlight: getVal('scHeroTitleHighlight'),
        subtitle:       getVal('scHeroSubtitle'),
        ctaText:        getVal('scHeroCtaText')
      },
      stats: [0, 1, 2].map(i => ({
        number: document.querySelector(`.sc-stat-num[data-idx="${i}"]`).value.trim(),
        suffix: document.querySelector(`.sc-stat-suffix[data-idx="${i}"]`).value.trim(),
        label:  document.querySelector(`.sc-stat-label[data-idx="${i}"]`).value.trim()
      })),
      about: {
        heading: getVal('scAboutHeading'),
        para1:   getVal('scAboutPara1'),
        para2:   getVal('scAboutPara2'),
        bullets: [0,1,2,3,4].map(i => getVal(`scBullet${i}`))
      },
      features: [0, 1, 2, 3].map(i => ({
        icon:  document.querySelector(`.sc-feat-icon[data-idx="${i}"]`).value.trim(),
        title: document.querySelector(`.sc-feat-title[data-idx="${i}"]`).value.trim(),
        desc:  document.querySelector(`.sc-feat-desc[data-idx="${i}"]`).value.trim()
      })),
      cta: {
        heading:          getVal('scCtaHeading'),
        headingHighlight: getVal('scCtaHighlight'),
        subtext:          getVal('scCtaSubtext')
      },
      floatCard: [0, 1, 2, 3].map(i => ({
        label: document.querySelector(`.sc-fc-label[data-idx="${i}"]`).value.trim(),
        value: document.querySelector(`.sc-fc-value[data-idx="${i}"]`).value.trim()
      }))
    };

    try {
      await saveSiteConfig(config);
      if (msg) { msg.classList.remove('hidden'); setTimeout(() => msg.classList.add('hidden'), 3000); }
      showToast('Site settings saved! Changes will appear on the homepage.', 'success');
    } catch(err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-save"></i> Save All Settings';
    }
  });

  // Reset handler
  document.getElementById('resetSiteSettingsBtn').addEventListener('click', async () => {
    if (!confirm('Reset all site settings to defaults? This cannot be undone.')) return;
    try {
      await saveSiteConfig(DEFAULT_SITE_CONFIG);
      showToast('Settings reset to defaults.', 'success');
      initSiteSettingsTab(); // reload form with defaults
    } catch(err) {
      showToast('Reset failed: ' + err.message, 'error');
    }
  });
}

/* ─── Shared Navbar Logic ────────────────────────────────── */
function initNavbar() {
  const toggle = document.querySelector('.navbar-toggle');
  const nav    = document.querySelector('.navbar-nav');
  const navbar = document.querySelector('.navbar');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

/* ─── User Auth Helpers ──────────────────────────────────── */

function getAuth() { return firebase.auth(); }

async function registerUser(name, email, phone, password) {
  const cred = await getAuth().createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName: name });
  await db.collection('users').doc(cred.user.uid).set({
    name, email, phone, createdAt: new Date().toISOString()
  });
  await cred.user.sendEmailVerification();
  return cred.user;
}

async function loginUser(email, password) {
  const cred = await getAuth().signInWithEmailAndPassword(email, password);
  return cred.user;
}

async function logoutUser() {
  await getAuth().signOut();
}

async function getUserProfile(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  } catch(e) { return null; }
}

async function getUserAdmissions(uid) {
  try {
    const snap = await db.collection('admissions')
      .where('userId', '==', uid)
      .orderBy('submittedAt', 'desc')
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(e) {
    _err('getUserAdmissions error:', e);
    return [];
  }
}

/* ─── Auth Modal ─────────────────────────────────────────── */

function injectAuthModal() {
  if (document.getElementById('authModal')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="authModal" class="auth-modal-overlay hidden" role="dialog" aria-modal="true">
      <div class="auth-modal-box">
        <button class="auth-modal-close" id="authModalClose" aria-label="Close">&times;</button>

        <div class="auth-modal-tabs">
          <button class="auth-modal-tab active" data-authtab="login">Login</button>
          <button class="auth-modal-tab" data-authtab="register">Create Account</button>
        </div>

        <!-- Login -->
        <div class="auth-modal-content active" id="authContentLogin">
          <h3 class="auth-modal-title"><i class="fas fa-lock"></i> Welcome Back</h3>
          <form id="userLoginForm" novalidate>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="loginEmail" class="form-control" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="loginPassword" class="form-control" placeholder="Your password" required />
            </div>
            <div class="auth-error hidden" id="loginError"></div>
            <button type="submit" class="btn btn-primary" style="width:100%" id="loginSubmitBtn">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </form>
          <p style="text-align:center;margin-top:1rem;font-size:0.85rem">
            <a href="#" id="forgotPasswordLink" style="color:var(--primary)">Forgot password?</a>
          </p>
          <div style="border-top:1px solid var(--border,#e5e7eb);margin-top:1.25rem;padding-top:1rem;text-align:center">
            <a href="admin.html" style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;opacity:0.75;transition:opacity 0.2s"
               onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.75'">
              <i class="fas fa-shield-alt" style="font-size:0.75rem"></i> Admin Portal Login
            </a>
          </div>
        </div>

        <!-- Register -->
        <div class="auth-modal-content" id="authContentRegister">
          <h3 class="auth-modal-title"><i class="fas fa-user-plus"></i> Create Account</h3>
          <form id="userRegisterForm" novalidate>
            <div class="form-group">
              <label class="form-label">Full Name <span style="color:var(--error)">*</span></label>
              <input type="text" id="regName" class="form-control" placeholder="e.g. Priya Sharma" required />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address <span style="color:var(--error)">*</span></label>
              <input type="email" id="regEmail" class="form-control" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number <span style="color:var(--error)">*</span></label>
              <input type="tel" id="regPhone" class="form-control" placeholder="10-digit number" required maxlength="10" />
            </div>
            <div class="form-group">
              <label class="form-label">Password <span style="color:var(--error)">*</span></label>
              <input type="password" id="regPassword" class="form-control" placeholder="Minimum 6 characters" required />
            </div>
            <div class="auth-error hidden" id="registerError"></div>
            <button type="submit" class="btn btn-primary" style="width:100%" id="registerSubmitBtn">
              <i class="fas fa-user-plus"></i> Create Account
            </button>
          </form>
        </div>

        <!-- Verify Email -->
        <div class="auth-modal-content" id="authContentVerify">
          <div style="text-align:center;padding:1rem 0">
            <div style="font-size:3rem;color:var(--accent);margin-bottom:1rem">
              <i class="fas fa-envelope-open-text"></i>
            </div>
            <h3 style="margin-bottom:0.75rem;color:var(--primary-dark)">Verify Your Email</h3>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1.5rem;line-height:1.6">
              We sent a verification link to<br><strong id="verifyEmailAddr"></strong>.<br><br>
              Click the link in your email, then come back and press Continue.
            </p>
            <button class="btn btn-primary" style="width:100%;margin-bottom:0.75rem" id="checkVerifiedBtn">
              <i class="fas fa-check-circle"></i> I've verified — Continue
            </button>
            <button class="btn btn-outline" style="width:100%" id="resendVerifyBtn">
              <i class="fas fa-redo"></i> Resend Verification Email
            </button>
            <p style="margin-top:1rem;font-size:0.8rem">
              <a href="#" id="backToLoginLink" style="color:var(--primary)">Back to Login</a>
            </p>
          </div>
        </div>

      </div>
    </div>`;
  document.body.appendChild(wrapper.firstElementChild);

  // Tab switching
  document.querySelectorAll('.auth-modal-tab').forEach(tab => {
    tab.addEventListener('click', () => showAuthTab(tab.dataset.authtab));
  });

  // Close
  document.getElementById('authModalClose').addEventListener('click', hideAuthModal);
  document.getElementById('authModal').addEventListener('click', e => {
    if (e.target.id === 'authModal') hideAuthModal();
  });

  // Login submit
  document.getElementById('userLoginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    const btn      = document.getElementById('loginSubmitBtn');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Signing in…';
    errEl.classList.add('hidden');
    try {
      const user = await loginUser(email, password);
      await user.getIdToken(true);        // force-refresh JWT on every login
      if (!user.emailVerified) {
        showVerifyEmailState(user.email);
        return;
      }
      hideAuthModal();
      // Admin users are redirected to the admin portal
      if (user.email === 'vipulkesari13@gmail.com') {
        showToast('Welcome, Admin! Redirecting to portal…', 'success');
        setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
        return;
      }
      showToast(`Welcome back, ${user.displayName || email}!`, 'success');
      if (typeof window._onAuthSuccess === 'function') window._onAuthSuccess(user);
    } catch(err) {
      errEl.textContent = (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')
        ? 'Invalid email or password.' : err.message;
      errEl.classList.remove('hidden');
    } finally {
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  });

  // Register submit
  document.getElementById('userRegisterForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const phone    = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const errEl    = document.getElementById('registerError');
    const btn      = document.getElementById('registerSubmitBtn');

    if (name.length < 2)               { errEl.textContent = 'Please enter your full name.'; errEl.classList.remove('hidden'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'Please enter a valid email.'; errEl.classList.remove('hidden'); return; }
    if (!/^[6-9]\d{9}$/.test(phone))   { errEl.textContent = 'Enter a valid 10-digit phone number.'; errEl.classList.remove('hidden'); return; }
    if (password.length < 8)           { errEl.textContent = 'Password must be at least 8 characters.'; errEl.classList.remove('hidden'); return; }

    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Creating account…';
    errEl.classList.add('hidden');
    try {
      const user = await registerUser(name, email, phone, password);
      showVerifyEmailState(user.email);
      showToast('Account created! Please verify your email.', 'success');
    } catch(err) {
      errEl.textContent = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists. Please login.'
        : 'Registration failed. Please try again.';
      errEl.classList.remove('hidden');
    } finally {
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  });

  // Check verified
  document.getElementById('checkVerifiedBtn').addEventListener('click', async () => {
    const btn  = document.getElementById('checkVerifiedBtn');
    const user = getAuth().currentUser;
    if (!user) return;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Checking…';

    try {
      await user.reload();                // refresh in-memory user object
      await user.getIdToken(true);        // force-refresh JWT so Firestore rules see email_verified=true

      if (user.emailVerified) {
        hideAuthModal();
        showToast(`Welcome, ${user.displayName || user.email}!`, 'success');
        if (typeof window._onAuthSuccess === 'function') window._onAuthSuccess(user);
      } else {
        showToast('Email not verified yet. Please check your inbox and click the link.', 'warning', 5000);
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle"></i> I\'ve verified — Continue';
    }
  });

  // Resend verification
  document.getElementById('resendVerifyBtn').addEventListener('click', async () => {
    const user = getAuth().currentUser;
    if (user) { await user.sendEmailVerification(); showToast('Verification email resent!', 'success'); }
  });

  // Back to login
  document.getElementById('backToLoginLink').addEventListener('click', e => {
    e.preventDefault(); showAuthTab('login');
  });

  // Forgot password
  document.getElementById('forgotPasswordLink').addEventListener('click', async e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) { showToast('Enter your email address first.', 'warning'); return; }
    try {
      await getAuth().sendPasswordResetEmail(email);
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch(err) { showToast(err.message, 'error'); }
  });
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-modal-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.authtab === tab));
  document.querySelectorAll('.auth-modal-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById('authContent' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (content) content.classList.add('active');
}

function showVerifyEmailState(email) {
  document.querySelectorAll('.auth-modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-modal-content').forEach(c => c.classList.remove('active'));
  document.getElementById('authContentVerify').classList.add('active');
  const el = document.getElementById('verifyEmailAddr');
  if (el) el.textContent = email;
}

function showAuthModal(tab) {
  injectAuthModal();
  document.getElementById('authModal').classList.remove('hidden');
  if (tab) showAuthTab(tab);
}

function hideAuthModal() {
  const m = document.getElementById('authModal');
  if (m) m.classList.add('hidden');
}

/* ─── Navbar Auth State ──────────────────────────────────── */

function initUserAuth() {
  getAuth().onAuthStateChanged(user => {
    updateNavAuthState(user);
  });
}

function updateNavAuthState(user) {
  const navAuthItem = document.getElementById('navAuthItem');
  if (!navAuthItem) return;
  if (user && user.emailVerified) {
    const initials = (user.displayName || user.email).charAt(0).toUpperCase();
    const name     = user.displayName || user.email.split('@')[0];
    navAuthItem.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap">
        <a href="profile.html" class="nav-link" style="display:flex;align-items:center;gap:0.4rem">
          <span style="
            width:30px;height:30px;border-radius:50%;
            background:var(--accent);color:#1a1a1a;font-weight:800;font-size:0.8rem;
            display:flex;align-items:center;justify-content:center;flex-shrink:0
          ">${escapeHtml(initials)}</span>
          ${escapeHtml(name)}
        </a>
        <button onclick="logoutUser().then(()=>{ updateNavAuthState(null); showToast('Logged out.','info'); })"
          style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);
          padding:0.3rem 0.7rem;font-size:0.78rem;border-radius:var(--radius-md);cursor:pointer;font-weight:600">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>`;
  } else {
    navAuthItem.innerHTML = `
      <button onclick="showAuthModal('login')" style="
        background:var(--accent);color:#1a1a1a;border:none;cursor:pointer;font-weight:700;
        padding:0.45rem 1.1rem;border-radius:var(--radius-md);font-size:0.85rem;
        display:flex;align-items:center;gap:0.4rem">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>`;
  }
}

/* ─── PAGE INIT: Profile Page ────────────────────────────── */
async function initProfilePage() {
  initNavbar();
  initUserAuth();

  const auth = getAuth();

  // Wait for auth state before rendering
  auth.onAuthStateChanged(async user => {
    if (!user || !user.emailVerified) {
      // Not logged in — redirect to home
      showToast('Please login to view your profile.', 'warning');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      return;
    }

    const profile      = await getUserProfile(user.uid);
    const applications = await getUserAdmissions(user.uid);

    // Profile card
    const initials = (user.displayName || user.email).charAt(0).toUpperCase();
    const name     = profile ? profile.name : (user.displayName || 'User');
    const phone    = profile ? profile.phone : '—';
    const joined   = profile ? formatDate(profile.createdAt) : '—';

    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
      profileCard.innerHTML = `
        <div class="profile-avatar">${escapeHtml(initials)}</div>
        <div class="profile-name">${escapeHtml(name)}</div>
        <div class="profile-email">${escapeHtml(user.email)}</div>
        <div style="margin-top:1rem">
          <div class="profile-detail-row">
            <i class="fas fa-phone"></i> ${escapeHtml(phone)}
          </div>
          <div class="profile-detail-row">
            <i class="fas fa-calendar-check"></i> Joined ${escapeHtml(joined)}
          </div>
          <div class="profile-detail-row">
            <i class="fas fa-file-alt"></i> ${applications.length} Application${applications.length !== 1 ? 's' : ''}
          </div>
        </div>
        <a href="apply.html" class="btn btn-primary btn-sm" style="width:100%;margin-top:1.25rem;display:flex;justify-content:center">
          <i class="fas fa-plus"></i> Apply for a Course
        </a>`;
    }

    // Applications list
    const appList = document.getElementById('applicationsList');
    if (appList) {
      if (applications.length === 0) {
        appList.innerHTML = `
          <div class="empty-state" style="padding:2rem 0">
            <i class="fas fa-file-alt"></i>
            <p>No applications yet.<br>
              <a href="apply.html" style="color:var(--primary);font-weight:600">Apply for a course</a>
            </p>
          </div>`;
      } else {
        const examBadge = { UPSC: 'badge-primary', UPPCS: 'badge-accent', BPSC: 'badge-success' };
        appList.innerHTML = applications.map(a => `
          <div class="application-item">
            <div class="application-item-header">
              <div>
                <div class="application-course">${escapeHtml(a.course)}</div>
                <div class="application-meta">
                  <span class="badge ${examBadge[a.examType] || 'badge-primary'}" style="margin-right:0.4rem">
                    ${escapeHtml(a.examType || 'UPSC')}
                  </span>
                  ${escapeHtml(a.education)}
                </div>
              </div>
              <span style="font-size:0.75rem;color:var(--text-light);white-space:nowrap">${formatDate(a.submittedAt)}</span>
            </div>
            ${a.message ? `<p style="margin-top:0.5rem;font-size:0.82rem;color:var(--text-secondary)">${escapeHtml(a.message)}</p>` : ''}
          </div>`).join('');
      }
    }
  });
}

/* ─── PAGE INIT: Home Page ───────────────────────────────── */
function initHomePage() {
  initNavbar();
  initUserAuth();

  // Render courses for active exam tab on load
  const activeExamTab = document.querySelector('.exam-tab-btn.active');
  const initialExam   = activeExamTab ? activeExamTab.dataset.exam : 'UPSC';
  renderCourses('courses-grid', initialExam);

  // Exam tab switching
  document.querySelectorAll('.exam-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exam-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const heading = document.getElementById('courses-heading');
      if (heading) heading.textContent = `Explore Our ${escapeHtml(btn.dataset.exam)} Courses`;
      renderCourses('courses-grid', btn.dataset.exam);
    });
  });

  // Animate stats counter
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (current >= target) clearInterval(interval);
    }, 25);
  });

  // Smooth scroll for "Learn More" button
  const learnMore = document.getElementById('learnMoreBtn');
  if (learnMore) {
    learnMore.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('courses');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Intersection Observer for card animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.course-card, .feature-card').forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
}

/* ─── PAGE INIT: Apply Page ──────────────────────────────── */
function initApplyPage() {
  initNavbar();
  initUserAuth();

  const authGate = document.getElementById('authGate');
  const formCard = document.getElementById('formCard');

  // ── Auth Gate: show/hide form based on login state ────────
  getAuth().onAuthStateChanged(user => {
    if (user && user.emailVerified) {
      if (authGate) authGate.classList.add('hidden');
      if (formCard) formCard.classList.remove('hidden');
      prefillForm(user);
      setupCourseDropdown();
    } else {
      if (authGate) authGate.classList.remove('hidden');
      if (formCard) formCard.classList.add('hidden');
    }
  });

  // After login via modal, re-trigger auth state check
  window._onAuthSuccess = user => {
    if (user && user.emailVerified) {
      if (authGate) authGate.classList.add('hidden');
      if (formCard) formCard.classList.remove('hidden');
      prefillForm(user);
      setupCourseDropdown();
    }
  };

  function prefillForm(user) {
    const fullName = document.getElementById('fullName');
    const email    = document.getElementById('email');
    if (fullName && user.displayName && !fullName.value) fullName.value = user.displayName;
    if (email && user.email && !email.value) {
      email.value    = user.email;
      email.readOnly = true;
    }
  }

  function setupCourseDropdown() {
    async function populateCourseDropdown(examType) {
      const courseSelect = document.getElementById('courseInterest');
      if (!courseSelect) return;
      courseSelect.innerHTML = '<option value="">Loading…</option>';
      const courses = await getCourses(examType || 'UPSC');
      courseSelect.innerHTML = '<option value="">-- Select a Course --</option>' +
        courses.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
    }

    const examTypeSelect = document.getElementById('examType');
    populateCourseDropdown(examTypeSelect ? examTypeSelect.value : 'UPSC');

    if (examTypeSelect) {
      examTypeSelect.addEventListener('change', () => {
        populateCourseDropdown(examTypeSelect.value);
        const courseSelect = document.getElementById('courseInterest');
        if (courseSelect) {
          courseSelect.value = '';
          courseSelect.classList.remove('is-valid', 'is-invalid');
        }
      });
    }
  }

  // Character counter
  const messageArea = document.getElementById('message');
  const charCount   = document.getElementById('charCount');
  if (messageArea && charCount) {
    messageArea.addEventListener('input', () => {
      charCount.textContent = `${messageArea.value.length}/500`;
    });
  }

  // Validation rules
  const validationRules = {
    fullName:       { required: true, minLength: 2 },
    email:          { required: true, email: true },
    phone:          { required: true, phone: true },
    education:      { required: true },
    examType:       { required: true },
    courseInterest: { required: true }
  };

  Object.entries(validationRules).forEach(([id, rules]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur',  () => validateField(el, rules));
      el.addEventListener('input', () => {
        if (el.classList.contains('is-invalid')) validateField(el, rules);
      });
    }
  });

  // Form submission
  const form       = document.getElementById('applyForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMessage');

  // Rate limiting: prevent rapid repeated submissions
  let _lastSubmitTime = 0;
  const SUBMIT_COOLDOWN_MS = 30000; // 30 seconds between submissions

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const now = Date.now();
      if (now - _lastSubmitTime < SUBMIT_COOLDOWN_MS) {
        const wait = Math.ceil((SUBMIT_COOLDOWN_MS - (now - _lastSubmitTime)) / 1000);
        showToast(`Please wait ${wait} second(s) before submitting again.`, 'warning');
        return;
      }

      const user = getAuth().currentUser;
      if (!user || !user.emailVerified) {
        showAuthModal('login');
        return;
      }

      const isValid = validateForm(validationRules);
      if (!isValid) {
        showToast('Please fix the errors before submitting.', 'error');
        const firstError = form.querySelector('.is-invalid');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const formData = {
        id:          Date.now().toString(),
        userId:      user.uid,
        name:        document.getElementById('fullName').value.trim(),
        email:       document.getElementById('email').value.trim(),
        phone:       document.getElementById('phone').value.trim(),
        education:   document.getElementById('education').value,
        examType:    document.getElementById('examType') ? document.getElementById('examType').value : 'UPSC',
        course:      document.getElementById('courseInterest').value,
        message:     document.getElementById('message').value.trim(),
        submittedAt: new Date().toISOString()
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting…';

      try {
        _lastSubmitTime = Date.now(); // stamp time before async ops
        await addAdmission(formData);

        if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
          emailjs.init(EMAILJS_CONFIG.publicKey);
          await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            to_email:        EMAILJS_CONFIG.adminEmail,
            from_name:       formData.name,
            from_email:      formData.email,
            phone:           formData.phone,
            education:       formData.education,
            exam_type:       formData.examType,
            course:          formData.course,
            message:         formData.message || '(No message provided)',
            submission_date: new Date().toLocaleString('en-IN')
          });
        } else {
          await new Promise(r => setTimeout(r, 900));
        }

        if (formCard)   formCard.classList.add('hidden');
        if (successMsg) successMsg.classList.remove('hidden');

        const summaryName   = document.getElementById('summaryName');
        const summaryCourse = document.getElementById('summaryCourse');
        if (summaryName)   summaryName.textContent = formData.name;
        if (summaryCourse) summaryCourse.textContent = formData.course;

      } catch (err) {
        _err('Submission error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
        showToast('Submission failed. Please check your connection and try again.', 'error', 6000);
      }
    });
  }
}

/* ─── PAGE INIT: Admin Page ──────────────────────────────── */
function initAdminPage() {
  initNavbar();

  const auth             = firebase.auth();
  const loginSection     = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const loginForm        = document.getElementById('loginForm');
  const loginError       = document.getElementById('loginError');
  const logoutBtn        = document.getElementById('logoutBtn');

  const ADMIN_EMAIL_ADDRESS = 'vipulkesari13@gmail.com';

  // Rate limiting: track failed login attempts
  let _failedAttempts = 0;
  let _lockedUntil    = 0;
  const MAX_ATTEMPTS  = 5;
  const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes

  // Auto-show dashboard if already signed in (persists across refreshes)
  auth.onAuthStateChanged(user => {
    if (user && user.email === ADMIN_EMAIL_ADDRESS) {
      showDashboard();
    } else {
      if (user) auth.signOut(); // signed in but not admin — sign out immediately
      if (dashboardSection) dashboardSection.classList.add('hidden');
      if (loginSection)     loginSection.classList.remove('hidden');
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Lockout check
      if (_failedAttempts >= MAX_ATTEMPTS) {
        const remaining = Math.ceil((_lockedUntil - Date.now()) / 60000);
        if (Date.now() < _lockedUntil) {
          if (loginError) { loginError.textContent = `Too many failed attempts. Try again in ${remaining} minute(s).`; loginError.classList.remove('hidden'); }
          return;
        }
        _failedAttempts = 0; // lockout expired
      }

      const email    = document.getElementById('adminUsername').value.trim();
      const password = document.getElementById('adminPassword').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Signing in…'; }
      if (loginError) loginError.classList.add('hidden');

      try {
        await auth.signInWithEmailAndPassword(email, password);
        _failedAttempts = 0; // reset on success
        // onAuthStateChanged above will call showDashboard() only if email matches admin
      } catch (err) {
        _failedAttempts++;
        if (_failedAttempts >= MAX_ATTEMPTS) _lockedUntil = Date.now() + LOCKOUT_MS;
        const msg = 'Invalid email or password.'; // never expose raw err.message
        loginError.classList.remove('hidden');
        loginError.textContent = msg;
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
        loginForm.closest('.login-card').style.animation = 'none';
        void loginForm.closest('.login-card').offsetWidth;
        loginForm.closest('.login-card').style.animation = 'shake 0.4s ease';
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Login'; }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      // Stop real-time listener before signing out
      if (_admissionsUnsubscribe) { _admissionsUnsubscribe(); _admissionsUnsubscribe = null; }
      await auth.signOut();
      showToast('Logged out successfully.', 'info');
    });
  }

  function showDashboard() {
    if (loginSection)     loginSection.classList.add('hidden');
    if (dashboardSection) {
      dashboardSection.classList.remove('hidden');

      renderAdmissionsTable();
      renderCourseManagement();
    }
  }

  // ── Tab Switching ─────────────────────────────────────────
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  let _siteSettingsInited = false;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) targetContent.classList.add('active');
      if (target === 'site-settings' && !_siteSettingsInited) {
        _siteSettingsInited = true;
        initSiteSettingsTab();
      }
    });
  });

  // ── Admissions Table (real-time via onSnapshot) ───────────
  let _admissionsUnsubscribe = null;

  function renderAdmissionsTable() {
    const tbody        = document.getElementById('admissionsBody');
    const countBadge   = document.getElementById('admissionsCount');
    const emptyState   = document.getElementById('admissionsEmpty');
    const tableWrapper = document.getElementById('admissionsTableWrapper');

    // Show loading
    if (tbody) tbody.innerHTML = `
      <tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-secondary)">
        <div class="loader-ring" style="margin:0 auto 0.5rem"></div> Loading…
      </td></tr>`;

    // Unsubscribe any previous listener before creating a new one
    if (_admissionsUnsubscribe) { _admissionsUnsubscribe(); _admissionsUnsubscribe = null; }

    let isFirstSnapshot = true;

    _admissionsUnsubscribe = db.collection('admissions')
      .orderBy('submittedAt', 'desc')
      .onSnapshot(snap => {
        const admissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Update count badge
        if (countBadge) countBadge.textContent = admissions.length;

        // Notify admin of new arrivals (skip on initial load)
        if (!isFirstSnapshot) {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') {
              const a = change.doc.data();
              showToast(
                `New application: ${a.name} — ${a.examType || 'UPSC'} / ${a.course}`,
                'success', 8000
              );
            }
          });
          // Refresh stats for today's count
          if (typeof window._updateDashboardStats === 'function') window._updateDashboardStats();
        }
        isFirstSnapshot = false;

        if (!tbody) return;

        if (admissions.length === 0) {
          if (emptyState)   emptyState.classList.remove('hidden');
          if (tableWrapper) tableWrapper.classList.add('hidden');
          return;
        }

        if (emptyState)   emptyState.classList.add('hidden');
        if (tableWrapper) tableWrapper.classList.remove('hidden');

        const examBadgeClass = { UPSC: 'badge-primary', UPPCS: 'badge-accent', BPSC: 'badge-success' };

        tbody.innerHTML = admissions.map(a => {
          const exam     = a.examType || 'UPSC';
          const badgeCls = examBadgeClass[exam] || 'badge-primary';
          return `
            <tr>
              <td class="td-name">${escapeHtml(a.name)}</td>
              <td class="td-email">${escapeHtml(a.email)}</td>
              <td>${escapeHtml(a.phone)}</td>
              <td><span class="badge badge-primary">${escapeHtml(a.education)}</span></td>
              <td><span class="badge ${badgeCls}">${escapeHtml(exam)}</span></td>
              <td>${escapeHtml(a.course)}</td>
              <td class="td-date">${formatDate(a.submittedAt)}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-delete-admission="${escapeHtml(a.id)}" aria-label="Delete admission">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>`;
        }).join('');

        // Event delegation — no inline onclick
        tbody.querySelectorAll('[data-delete-admission]').forEach(btn => {
          btn.addEventListener('click', () => window.deleteAdmission(btn.dataset.deleteAdmission));
        });

      }, err => {
        _err('Admissions listener error:', err.code, err.message);
        if (tbody) tbody.innerHTML = `
          <tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--error)">
            <i class="fas fa-exclamation-triangle" style="margin-right:0.5rem"></i>
            Permission denied — check Firestore rules and adminConfig setup.
          </td></tr>`;
      });
  }

  // ── Export CSV ────────────────────────────────────────────
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportAdmissionsCSV);
  }

  // ── Add Course Form ───────────────────────────────────────
  const addCourseForm = document.getElementById('addCourseForm');
  if (addCourseForm) {
    addCourseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newCourseName');
      const descInput = document.getElementById('newCourseDesc');
      const examInput = document.getElementById('newCourseExam');

      const name     = nameInput.value.trim();
      const desc     = descInput.value.trim();
      const examType = examInput ? examInput.value : 'UPSC';

      if (!name) { showToast('Please enter a course name.', 'error'); nameInput.focus(); return; }
      if (!desc) { showToast('Please enter a course description.', 'error'); descInput.focus(); return; }
      if (name.length < 4) { showToast('Course name must be at least 4 characters.', 'error'); return; }

      const courses   = await getCourses(examType);
      const newCourse = {
        id:          Date.now().toString(),
        name,
        description: desc,
        icon:        COURSE_ICONS[courses.length % COURSE_ICONS.length],
        duration:    '–',
        seats:       'Available'
      };

      courses.push(newCourse);
      await saveCourses(courses, examType);

      nameInput.value = '';
      descInput.value = '';

      // Switch filter to the exam the course was added to
      const mgmtFilter = document.getElementById('coursesMgmtExam');
      if (mgmtFilter) mgmtFilter.value = examType;

      await renderCourseManagement(examType);
      showToast(`Course "${name}" added to ${examType}!`, 'success');
    });
  }

  // ── Make render functions accessible to inline scripts ────
  // _renderAdmissions is a no-op here — onSnapshot auto-refreshes the table
  window._renderAdmissions = () => {};
  window._renderCourseMgmt = renderCourseManagement;

  // ── Course Management ─────────────────────────────────────
  async function renderCourseManagement(examType) {
    const list = document.getElementById('courseMgmtList');
    if (!list) return;

    if (!examType) {
      const filter = document.getElementById('coursesMgmtExam');
      examType = filter ? filter.value : 'UPSC';
    }

    list.innerHTML = `
      <div class="empty-state">
        <div class="loader-ring" style="margin:0 auto 0.5rem"></div>
        <p>Loading…</p>
      </div>`;

    const courses = await getCourses(examType);

    if (courses.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book-open"></i>
          <p>No ${escapeHtml(examType)} courses yet. Add one above!</p>
        </div>`;
      return;
    }

    list.innerHTML = courses.map(course => `
      <div class="course-mgmt-card" data-id="${escapeHtml(course.id)}">
        <div class="course-mgmt-info">
          <div class="course-mgmt-name">
            <i class="fas ${escapeHtml(course.icon || 'fa-book')}" style="color:var(--accent);margin-right:6px"></i>
            ${escapeHtml(course.name)}
          </div>
          <div class="course-mgmt-desc">${escapeHtml(course.description)}</div>
        </div>
        <button
          class="btn btn-danger btn-sm"
          data-delete-course="${escapeHtml(course.id)}"
          data-exam-type="${escapeHtml(examType)}"
          title="Delete course"
          aria-label="Delete course"
          ${courses.length <= 1 ? 'disabled' : ''}>
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');

    // Event delegation — no inline onclick
    list.querySelectorAll('[data-delete-course]').forEach(btn => {
      btn.addEventListener('click', () => window.deleteCourse(btn.dataset.deleteCourse, btn.dataset.examType));
    });
  }

  // Re-render when exam filter changes
  const mgmtExamFilter = document.getElementById('coursesMgmtExam');
  if (mgmtExamFilter) {
    mgmtExamFilter.addEventListener('change', () => renderCourseManagement());
  }
}

/* ─── Global: Delete Admission ───────────────────────────── */
window.deleteAdmission = async function(id) {
  if (!confirm('Are you sure you want to delete this admission record?')) return;
  try {
    await deleteAdmissionById(id);
    if (typeof window._renderAdmissions === 'function') await window._renderAdmissions();
    showToast('Admission record deleted.', 'info');
  } catch (e) {
    showToast('Could not delete record. Try again.', 'error');
  }
};

/* ─── Global: Delete Course ──────────────────────────────── */
window.deleteCourse = async function(id, examType) {
  examType      = examType || 'UPSC';
  const courses = await getCourses(examType);
  if (courses.length <= 1) {
    showToast('Cannot delete the last remaining course.', 'error');
    return;
  }
  const course = courses.find(c => c.id === id);
  if (!confirm(`Delete course "${course ? course.name : ''}"?`)) return;
  const updated = courses.filter(c => c.id !== id);
  await saveCourses(updated, examType);
  if (typeof window._renderCourseMgmt === 'function') await window._renderCourseMgmt(examType);
  showToast('Course deleted.', 'info');
};

/* ─── Export Admissions as CSV ───────────────────────────── */
async function exportAdmissionsCSV() {
  const admissions = await getAdmissions();
  if (admissions.length === 0) {
    showToast('No admissions to export.', 'warning');
    return;
  }

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Education', 'Exam', 'Course Interest', 'Message', 'Submitted At'];
  const rows    = admissions.map(a => [
    a.id          || '',
    a.name        || '',
    a.email       || '',
    a.phone       || '',
    a.education   || '',
    a.examType    || 'UPSC',
    a.course      || '',
    (a.message    || '').replace(/\n/g, ' '),
    formatDate(a.submittedAt)
  ].map(cell => `"${String(cell).replace(/"/g, '""')}"`));

  const csv  = [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `admissions_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully!', 'success');
}

/* ─── Shake animation ────────────────────────────────────── */
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-5px); }
      80%    { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── Bootstrap on Load ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Seed default courses into Firestore if collections are empty.
  // Runs in background — page does not wait for this.
  initDefaults().catch(e => _warn('initDefaults skipped (Firebase not configured?):', e));
});
