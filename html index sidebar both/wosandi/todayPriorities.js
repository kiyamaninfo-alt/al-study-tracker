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

  // Evaluate the 6 core actionable priorities
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
    const urgentTarget = urgentModelPapers.find(p => p.needs_model_paper_1);
    if (urgentTarget) {
      priorities.push({
        icon: '⚡',
        title: 'වහාම Model Paper 1 කළ යුතු පාඩම',
        desc: `${urgentTarget.lesson_name || 'පාඩම හඳුනාගෙන නැත'} (Urgent Radar)`,
        badge: 'Urgent'
      });
    }

    // 2. Spaced Repetition Review Target
    const pendingReviews = spacedRepetition.filter(item => !item.completed_at && item.due_today);
    if (pendingReviews.length > 0) {
      priorities.push({
        icon: '🧠',
        title: 'අමතකවීමේ වක්‍රය - Spaced Repetition',
        desc: `අද සමාලෝචනය කළ යුතු මාතෘකා ${pendingReviews.length}ක් ඇත.`,
        badge: 'Review'
      });
    }

    // 3. Full Paper Recency Counter
    const fullPaperDays = this.calculateDaysElapsed(lastFullPaperDate);
    priorities.push({
      icon: '📝',
      title: 'Full Paper Recency',
      desc: fullPaperDays !== null ? `අවසන් Full Paper එක කර දින ${fullPaperDays}ක් ගතවී ඇත.` : 'තවමත් Full Paper එකක් කර නොමැත.',
      badge: fullPaperDays > 7 ? 'Attention' : 'Normal'
    });

    // 4. Unit Paper Recency Counter
    const unitPaperDays = this.calculateDaysElapsed(lastUnitPaperDate);
    priorities.push({
      icon: '📑',
      title: 'Unit Paper Recency',
      desc: unitPaperDays !== null ? `අවසන් Unit Paper එක කර දින ${unitPaperDays}ක් ගතවී ඇත.` : 'තවමත් Unit Paper එකක් කර නොමැත.',
      badge: unitPaperDays > 3 ? 'Attention' : 'Normal'
    });

    // 5. Untested Completed Lessons Alert
    const untestedLessons = lessons.filter(l => l.lesson_done === true && (l.attempts === 0 || !l.attempts));
    if (untestedLessons.length > 0) {
      priorities.push({
        icon: '⚠️',
        title: 'උගන්වා අවසන්, නමුත් Paper නොකළ පාඩම්',
        desc: `${untestedLessons.length} කට තවමත් පේපර් කර නොමැත.`,
        badge: 'Action Needed'
      });
    }

    // 6. Least-Practiced Sub-Unit Detector
    const leastPracticed = subUnits
      .filter(su => su.lesson_done === true && su.hw_done === true)
      .sort((a, b) => (a.activity_count || 0) - (b.activity_count || 0))[0];
    if (leastPracticed) {
      priorities.push({
        icon: '🎯',
        title: 'අවම පුහුණුවක් ලැබූ Sub-Unit එක',
        desc: `${leastPracticed.name} (ක්‍රියාකාරකම්: ${leastPracticed.activity_count || 0})`,
        badge: 'Focus'
      });
    }

    return priorities;
  }

  render(data = {}) {
    if (!this.container) return;
    const items = this.evaluatePriorities(data);

    if (items.length === 0) {
      this.container.innerHTML = '<p style="color: #64748b;">අද දිනට නියමිත විශේෂ ප්‍රමුඛතා නොමැත. විශිෂ්ටයි!</p>';
      return;
    }

    const html = items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fdfdfd;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.25rem;">${item.icon}</span>
          <div>
            <strong style="display: block; font-size: 0.95rem;">${item.title}</strong>
            <span style="font-size: 0.85rem; color: #475569;">${item.desc}</span>
          </div>
        </div>
        <span style="font-size: 0.75rem; padding: 3px 8px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-weight: 600;">${item.badge}</span>
      </div>
    `).join('');

    this.container.innerHTML = html;
  }
}
