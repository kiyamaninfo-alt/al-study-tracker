/**
 * Subject Drawer / Modal Component - Wosandi O/L Mission Control
 * Handles sliding drawer UI for managing active O/L subjects across Grade 9 to 11.
 * Categories: Core, Aesthetics, Technical/Skills, Social/Business, Additional/Languages.
 * Strict Namespace: wosandi_ol_*
 */

import { subjectManager } from './subjectManager.js';

const CATEGORIES = [
  {
    id: 'core',
    titleEn: 'Core / Academic',
    titleSi: 'ප්‍රධාන / අධ්‍යයන විෂයයන් (Core)',
    descSi: 'ගණිතය, විද්‍යාව, සිංහල, ඉංග්‍රීසි, ඉතිහාසය, ආගම',
    badgeColor: '#2563eb'
  },
  {
    id: 'social_business',
    titleEn: 'Basket I / Social & Business',
    titleSi: 'කාණ්ඩ I / සමාජීය හා වාණිජ (Social & Business)',
    descSi: 'ව්‍යාපාර හා ගිණුම්කරණය, භූගෝල විද්‍යාව, පුරවැසි අධ්‍යාපනය',
    badgeColor: '#059669'
  },
  {
    id: 'aesthetics',
    titleEn: 'Basket II / Aesthetics',
    titleSi: 'කාණ්ඩ II / සෞන්දර්ය විෂයයන් (Aesthetics)',
    descSi: 'චිත්‍ර, පෙරදිග සංගීතය, බටහිර සංගීතය, නර්තනය, නාට්‍ය හා රංග කලාව',
    badgeColor: '#7c3aed'
  },
  {
    id: 'technical_applied',
    titleEn: 'Basket III / Technical & Applied',
    titleSi: 'කාණ්ඩ III / තාක්ෂණික හා කුසලතා (Technical & Applied)',
    descSi: 'තොරතුරු තාක්ෂණය (ICT), කෘෂිකර්මය, සෞඛ්‍ය, PTS, ගෘහ ආර්ථික විද්‍යාව',
    badgeColor: '#d97706'
  },
  {
    id: 'additional_languages',
    titleEn: 'Additional / Languages',
    titleSi: 'අමතර / භාෂා විෂයයන් (Additional & Languages)',
    descSi: 'දෙවන බස දෙමළ, ඉංග්‍රීසි සාහිත්‍යය',
    badgeColor: '#db2777'
  }
];

const SUBJECT_SINHALA_MAP = {
  // Core
  maths: 'ගණිතය',
  science: 'විද්‍යාව',
  sinhala: 'සිංහල භාෂාව හා සාහිත්‍යය',
  english: 'ඉංග්‍රීසි භාෂාව',
  history: 'ඉතිහාසය',
  religion: 'බුද්ධ ධර්මය / ආගම',

  // Social & Business
  commerce: 'ව්‍යාපාර හා ගිණුම්කරණ අධ්‍යයනය',
  geography: 'භූගෝල විද්‍යාව',
  civics: 'පුරවැසි අධ්‍යාපනය',

  // Aesthetics
  art: 'චිත්‍ර කලාව',
  eastern_music: 'පෙරදිග සංගීතය',
  western_music: 'බටහිර සංගීතය',
  dancing: 'දේශීය / බටහිර නර්තනය',
  drama: 'නාට්‍ය හා රංග කලාව',

  // Technical & Applied
  ict: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
  agri: 'කෘෂිකර්මය හා ආහාර තාක්ෂණය',
  health: 'සෞඛ්‍ය හා ශාරීරික අධ්‍යාපනය',
  pts: 'ප්‍රායෝගික හා තාක්ෂණික කුසලතා (PTS)',
  home_economics: 'ගෘහ ආර්ථික විද්‍යාව',

  // Additional / Languages
  tamil: 'දෙවන බස (දෙමළ)',
  eng_lit: 'ඉංග්‍රීසි සාහිත්‍යය (English Literature)'
};

export class SubjectDrawer {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.injectStyles();
    this.createDrawerDOM();
    this.bindEvents();
  }

  injectStyles() {
    if (document.getElementById('wosandi-subject-drawer-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'wosandi-subject-drawer-styles';
    styleEl.textContent = `
      .wosandi-drawer-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(3px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.28s ease;
        z-index: 9998;
      }
      .wosandi-drawer-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .wosandi-drawer-panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: min(460px, 94vw);
        height: 100%;
        background: #ffffff;
        box-shadow: -6px 0 28px rgba(0, 0, 0, 0.16);
        transform: translateX(100%);
        transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        color: #0f172a;
        font-family: inherit;
      }
      .wosandi-drawer-panel.open {
        transform: translateX(0);
      }
      .wosandi-drawer-header {
        padding: 18px 20px;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .wosandi-drawer-title-group h2 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wosandi-drawer-title-group p {
        margin: 4px 0 0 0;
        font-size: 0.82rem;
        color: #64748b;
      }
      .wosandi-drawer-close-btn {
        background: #f1f5f9;
        border: none;
        color: #475569;
        font-size: 1.25rem;
        width: 34px;
        height: 34px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .wosandi-drawer-close-btn:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
      .wosandi-drawer-summary {
        background: #f8fafc;
        padding: 12px 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
      }
      .wosandi-drawer-summary-pill {
        background: #eff6ff;
        color: #1d4ed8;
        padding: 4px 12px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.84rem;
        border: 1px solid #bfdbfe;
        letter-spacing: 0.3px;
      }
      .wosandi-drawer-body {
        padding: 16px 20px;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .wosandi-category-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .wosandi-category-header {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .wosandi-category-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wosandi-category-badge-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wosandi-category-badge {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 4px;
        color: #ffffff;
      }
      .wosandi-category-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1e293b;
      }
      .wosandi-category-count-badge {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }
      .wosandi-category-desc {
        font-size: 0.78rem;
        color: #64748b;
        margin-left: 2px;
      }
      .wosandi-subject-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 2px;
      }
      .wosandi-subject-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
        cursor: pointer;
        user-select: none;
      }
      .wosandi-subject-item:hover {
        border-color: #cbd5e1;
        background: #f1f5f9;
      }
      .wosandi-subject-item.active {
        background: #ffffff;
        border-color: #93c5fd;
        box-shadow: 0 1px 3px rgba(37, 99, 235, 0.08);
      }
      .wosandi-subject-info {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .wosandi-subject-code {
        font-size: 0.72rem;
        font-weight: 700;
        background: #e2e8f0;
        color: #334155;
        padding: 3px 6px;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      .wosandi-subject-item.active .wosandi-subject-code {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .wosandi-subject-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .wosandi-subject-name-si {
        font-size: 0.88rem;
        font-weight: 600;
        color: #0f172a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .wosandi-subject-name-en {
        font-size: 0.74rem;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Modern Toggle Switch */
      .wosandi-toggle-switch {
        position: relative;
        width: 44px;
        height: 24px;
        background: #cbd5e1;
        border-radius: 9999px;
        transition: background 0.24s;
        flex-shrink: 0;
        margin-left: 12px;
      }
      .wosandi-toggle-switch::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .wosandi-subject-item.active .wosandi-toggle-switch {
        background: #2563eb;
      }
      .wosandi-subject-item.active .wosandi-toggle-switch::after {
        transform: translateX(20px);
      }
      .wosandi-drawer-footer {
        padding: 14px 20px;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .wosandi-drawer-done-btn {
        padding: 9px 20px;
        background: #2563eb;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s;
        margin-left: auto;
      }
      .wosandi-drawer-done-btn:hover {
        background: #1d4ed8;
      }
    `;
    document.head.appendChild(styleEl);
  }

  createDrawerDOM() {
    if (document.getElementById('wosandiSubjectDrawerOverlay')) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', () => {
        this.createDrawerDOM();
        this.bindEvents();
      });
      return;
    }

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'wosandiSubjectDrawerOverlay';
    overlay.className = 'wosandi-drawer-overlay';

    // Panel
    const panel = document.createElement('aside');
    panel.id = 'wosandiSubjectDrawerPanel';
    panel.className = 'wosandi-drawer-panel';
    panel.setAttribute('aria-label', 'O/L Subject Selection Drawer');

    panel.innerHTML = `
      <div class="wosandi-drawer-header">
        <div class="wosandi-drawer-title-group">
          <h2>📚 O/L විෂයයන් තෝරාගැනීම</h2>
          <p>Grade 9 - 11 අධ්‍යයන සැලැස්මට අනුව කැමති විෂයයන් තෝරන්න</p>
        </div>
        <button class="wosandi-drawer-close-btn" id="wosandiDrawerCloseBtn" title="වසන්න">✕</button>
      </div>
      <div class="wosandi-drawer-summary">
        <span style="color: #475569; font-weight: 500;">තෝරාගත් විෂයයන්:</span>
        <span class="wosandi-drawer-summary-pill" id="wosandiActiveSubjectCount">0 තෝරාගෙන ඇත</span>
      </div>
      <div class="wosandi-drawer-body" id="wosandiDrawerBody">
        <!-- Rendered dynamically -->
      </div>
      <div class="wosandi-drawer-footer">
        <button class="wosandi-drawer-done-btn" id="wosandiDrawerDoneBtn">තහවුරු කර වසන්න</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    this.overlay = overlay;
    this.panel = panel;
    this.bodyEl = panel.querySelector('#wosandiDrawerBody');
    this.countBadge = panel.querySelector('#wosandiActiveSubjectCount');
  }

  bindEvents() {
    const closeBtn = document.getElementById('wosandiDrawerCloseBtn');
    const doneBtn = document.getElementById('wosandiDrawerDoneBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (doneBtn) doneBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());

    // ESC key closes drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // React to external subject change events
    window.addEventListener('wosandi:subjectsChanged', () => {
      if (this.isOpen) {
        this.renderSubjectList();
      }
    });

    // Auto-bind to trigger button if present in DOM
    const bindTrigger = () => {
      const triggerBtn = document.getElementById('btnOpenSubjectDrawer');
      if (triggerBtn && !triggerBtn.dataset.drawerBound) {
        triggerBtn.dataset.drawerBound = 'true';
        triggerBtn.addEventListener('click', () => this.open());
      }
    };

    bindTrigger();
    document.addEventListener('DOMContentLoaded', bindTrigger);
  }

  open() {
    this.isOpen = true;
    this.renderSubjectList();
    if (this.overlay) this.overlay.classList.add('open');
    if (this.panel) this.panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    if (this.overlay) this.overlay.classList.remove('open');
    if (this.panel) this.panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderSubjectList() {
    if (!this.bodyEl) return;

    const allSubjects = subjectManager.subjects;
    const activeCount = allSubjects.filter(s => s.isActive).length;
    if (this.countBadge) {
      this.countBadge.textContent = `${activeCount} තෝරාගෙන ඇත (${activeCount} සක්‍රියයි)`;
    }

    this.bodyEl.innerHTML = '';

    CATEGORIES.forEach(category => {
      const catSubjects = allSubjects.filter(s => s.category === category.id);
      if (catSubjects.length === 0) return;

      const activeInCat = catSubjects.filter(s => s.isActive).length;

      const groupEl = document.createElement('div');
      groupEl.className = 'wosandi-category-group';

      groupEl.innerHTML = `
        <div class="wosandi-category-header">
          <div class="wosandi-category-title-row">
            <div class="wosandi-category-badge-wrap">
              <span class="wosandi-category-badge" style="background: ${category.badgeColor};">${category.titleEn}</span>
              <span class="wosandi-category-title">${category.titleSi}</span>
            </div>
            <span class="wosandi-category-count-badge">${activeInCat} / ${catSubjects.length} සක්‍රියයි</span>
          </div>
          <span class="wosandi-category-desc">${category.descSi}</span>
        </div>
        <div class="wosandi-subject-list" data-category="${category.id}"></div>
      `;

      const listContainer = groupEl.querySelector('.wosandi-subject-list');

      catSubjects.forEach(subject => {
        const itemEl = document.createElement('div');
        itemEl.className = `wosandi-subject-item ${subject.isActive ? 'active' : ''}`;
        itemEl.setAttribute('data-id', subject.id);
        itemEl.setAttribute('role', 'button');
        itemEl.setAttribute('tabindex', '0');
        itemEl.setAttribute('aria-pressed', subject.isActive ? 'true' : 'false');

        const siName = SUBJECT_SINHALA_MAP[subject.id] || subject.name;

        itemEl.innerHTML = `
          <div class="wosandi-subject-info">
            <span class="wosandi-subject-code">${subject.code || subject.id.toUpperCase()}</span>
            <div class="wosandi-subject-text">
              <span class="wosandi-subject-name-si">${siName}</span>
              <span class="wosandi-subject-name-en">${subject.name}</span>
            </div>
          </div>
          <div class="wosandi-toggle-switch" aria-hidden="true"></div>
        `;

        const handleToggle = () => {
          subjectManager.toggleSubject(subject.id);
          this.renderSubjectList();
        };

        itemEl.addEventListener('click', handleToggle);
        itemEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        });

        listContainer.appendChild(itemEl);
      });

      this.bodyEl.appendChild(groupEl);
    });
  }
}

// Global instance export & initialization
export const subjectDrawer = new SubjectDrawer();
