/**
 * Today's Priorities Controller - Wosandi O/L Mission Control
 * Strict Table Prefix: wosandi_*
 */

export class TodayPriorities {
  constructor(containerId = 'prioritiesContent') {
    this.container = document.getElementById(containerId);
  }

  // Calculate days elapsed between target date and today
  calculateDaysElapsed(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - target);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Evaluate the 6 core actionable priorities with strict compact format:
  // #[Number] [Action Text] \n [Subject Code] ([Lesson Code] පාඩමින්) දවස් [Days]
  evaluatePriorities(data = {}) {
    const {
      urgentModelPapers = [],
      spacedRepetition = [],
      lastFullPaperDate = null,
      lastUnitPaperDate = null,
      lessons = [],
      subUnits = []
    } = data;

    const priorities = [];

    // 1. Urgent Model Paper Target
    const urgentTarget = urgentModelPapers.find(p => p.needs_model_paper_1) || urgentModelPapers[0];
    if (urgentTarget) {
      const subj = urgentTarget.subject || 'ET';
      const code = urgentTarget.code || urgentTarget.unit_code || '1.2';
      const days = urgentTarget.days !== undefined ? urgentTarget.days : (urgentTarget.colH !== undefined ? urgentTarget.colH : 20);
      priorities.push({
        num: 1,
        icon: '⚡',
        action: 'අද මොඩල් පේපරයක් කරන්න ඕන',
        subj: subj,
        code: code,
        days: days,
        badge: 'Urgent'
      });
    }

    // 2. Spaced Repetition Review Target
    const pendingReviews = spacedRepetition.filter(item => !item.completed_at && item.due_today);
    if (pendingReviews.length > 0 || spacedRepetition.length > 0) {
      const topSr = pendingReviews[0] || spacedRepetition[0] || {};
      const subj = topSr.subject || 'ICT';
      const code = topSr.code || topSr.unit_code || '1.1';
      const days = topSr.days !== undefined ? topSr.days : 1;
      priorities.push({
        num: 2,
        icon: '🧠',
        action: 'අද පාඩම් කරන්න ඕන',
        subj: subj,
        code: code,
        days: days,
        badge: 'Review'
      });
    }

    // 3. Full Paper Recency Counter
    const fullPaperDays = this.calculateDaysElapsed(lastFullPaperDate);
    const fpDays = fullPaperDays !== null ? fullPaperDays : 0;
    priorities.push({
      num: 3,
      icon: '📝',
      action: 'Full Paper එකක් කරන්න ඕන',
      subj: 'ALL',
      code: 'Full Paper',
      days: fpDays,
      badge: fpDays > 7 ? 'Attention' : 'Normal'
    });

    // 4. Unit Paper Recency Counter
    const unitPaperDays = this.calculateDaysElapsed(lastUnitPaperDate);
    const upDays = unitPaperDays !== null ? unitPaperDays : 0;
    priorities.push({
      num: 4,
      icon: '📑',
      action: 'Unit Paper එකක් කරන්න ඕන',
      subj: 'ALL',
      code: 'Unit Paper',
      days: upDays,
      badge: upDays > 3 ? 'Attention' : 'Normal'
    });

    // 5. Untested Completed Lessons Alert
    const untestedLessons = lessons.filter(l => l.lesson_done === true && (l.attempts === 0 || !l.attempts));
    if (untestedLessons.length > 0 || lessons.length > 0) {
      const topUntested = untestedLessons[0] || lessons[0] || {};
      const subj = topUntested.subject || 'SFT';
      const code = topUntested.code || topUntested.unit_code || '2.1';
      const days = topUntested.days !== undefined ? topUntested.days : (topUntested.lesson_days || 15);
      priorities.push({
        num: 5,
        icon: '⚠️',
        action: 'නොකළ පේපරයක් කරන්න ඕන',
        subj: subj,
        code: code,
        days: days,
        badge: 'Action'
      });
    }

    // 6. Least-Practiced Sub-Unit Detector
    const leastPracticed = subUnits
      .filter(su => su.lesson_done === true && su.hw_done === true)
      .sort((a, b) => (a.activity_count || 0) - (b.activity_count || 0))[0] || subUnits[0];
    if (leastPracticed) {
      const subj = leastPracticed.subject || 'ICT';
      const code = leastPracticed.code || leastPracticed.unit_code || '3.1';
      const days = leastPracticed.days !== undefined ? leastPracticed.days : (leastPracticed.hw_days || 12);
      priorities.push({
        num: 6,
        icon: '🎯',
        action: 'අඩු පුහුණුව ප්‍රගුණ කරන්න ඕන',
        subj: subj,
        code: code,
        days: days,
        badge: 'Focus'
      });
    }

    return priorities;
  }

  // Render ultra-compact single-line badge layout without long titles
  render(data = {}) {
    if (!this.container) return;
    const items = this.evaluatePriorities(data);

    if (items.length === 0) {
      this.container.innerHTML = '<p style="color: #64748b; font-size: 11px; margin: 4px 0;">අද දිනට නියමිත විශේෂ ප්‍රමුඛතා නොමැත. විශිෂ්ටයි!</p>';
      return;
    }

    const html = items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; margin-bottom: 6px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); font-family: inherit;">
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap;">
          <span style="font-size: 1rem; line-height: 1;">${item.icon}</span>
          <div style="display: flex; flex-direction: column; gap: 1px; min-width: 0;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #1e293b; line-height: 1.2;">
              #${item.num} ${item.action}
            </div>
            <div style="font-size: 0.75rem; color: #64748b; line-height: 1.2;">
              <strong>${item.subj}</strong> (${item.code} පාඩමින්) දවස් ${item.days}
            </div>
          </div>
        </div>
        <span style="font-size: 0.68rem; padding: 2px 7px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-weight: 700; white-space: nowrap; margin-left: 6px;">${item.badge}</span>
      </div>
    `).join('');

    this.container.innerHTML = html;
  }
}
