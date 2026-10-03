/**
 * Grade Controller - Wosandi O/L Mission Control
 * Strict Namespace: wosandi_ol_*
 */

const STORAGE_KEY_GRADE = 'wosandi_ol_active_grade';
const DEFAULT_GRADE = '11';

class GradeController {
  constructor() {
    this.activeGrade = localStorage.getItem(STORAGE_KEY_GRADE) || DEFAULT_GRADE;
    this.gradeButtons = document.querySelectorAll('.grade-btn');
    this.backBtn = document.getElementById('btnBackToSinethmi');
    
    this.handleGradeClick = this.handleGradeClick.bind(this);
    this.handleTeardown = this.handleTeardown.bind(this);
    
    this.init();
  }

  init() {
    this.updateActiveUI(this.activeGrade);
    this.bindEvents();
    this.dispatchGradeChangeEvent(this.activeGrade);
  }

  bindEvents() {
    this.gradeButtons.forEach(btn => {
      btn.addEventListener('click', this.handleGradeClick);
    });

    if (this.backBtn) {
      this.backBtn.addEventListener('click', this.handleTeardown);
    }
  }

  handleGradeClick(event) {
    const selectedGrade = event.currentTarget.getAttribute('data-grade');
    if (!selectedGrade || selectedGrade === this.activeGrade) return;

    this.activeGrade = selectedGrade;
    localStorage.setItem(STORAGE_KEY_GRADE, selectedGrade);
    this.updateActiveUI(selectedGrade);
    this.dispatchGradeChangeEvent(selectedGrade);
  }

  updateActiveUI(grade) {
    this.gradeButtons.forEach(btn => {
      if (btn.getAttribute('data-grade') === grade) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  dispatchGradeChangeEvent(grade) {
    const event = new CustomEvent('wosandi:gradeChanged', {
      detail: { gradeLevel: grade }
    });
    window.dispatchEvent(event);
  }

  handleTeardown() {
    // Memory cleanup: Detach listeners
    this.gradeButtons.forEach(btn => {
      btn.removeEventListener('click', this.handleGradeClick);
    });
    if (this.backBtn) {
      this.backBtn.removeEventListener('click', this.handleTeardown);
    }
  }
}

// Instantiate controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.wosandiGradeController = new GradeController();
});
