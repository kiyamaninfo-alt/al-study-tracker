/**
 * Unit Analytics & Multi-Source Streak Engine
 * Strict Table Prefix: wosandi_*
 */

export class UnitAnalytics {
  /**
   * Rule: Exclude all attempts where score === 0 or marks === 0
   */
  static filterZeroScores(records = []) {
    return records.filter(item => {
      const score = item.score !== undefined ? item.score : item.marks;
      return score !== null && score !== undefined && Number(score) > 0;
    });
  }

  /**
   * Tab 1: Sub-Unit Breakdown
   */
  static calculateSubUnitAverages(records = []) {
    const validRecords = this.filterZeroScores(records);
    const groups = {};

    validRecords.forEach(r => {
      const key = r.sub_unit_name || r.sub_unit_id;
      if (!groups[key]) groups[key] = { total: 0, count: 0, name: key };
      const score = Number(r.score !== undefined ? r.score : r.marks);
      groups[key].total += score;
      groups[key].count += 1;
    });

    return Object.values(groups).map(g => ({
      name: g.name,
      average: Math.round((g.total / g.count) * 10) / 10,
      attempts: g.count
    }));
  }

  /**
   * Tab 2: Unit-Wise Average Aggregation
   */
  static calculateUnitWiseAverages(records = []) {
    const validRecords = this.filterZeroScores(records);
    const groups = {};

    validRecords.forEach(r => {
      const key = r.unit_name || r.unit_id;
      if (!groups[key]) groups[key] = { total: 0, count: 0, name: key };
      const score = Number(r.score !== undefined ? r.score : r.marks);
      groups[key].total += score;
      groups[key].count += 1;
    });

    return Object.values(groups).map(g => ({
      name: g.name,
      average: Math.round((g.total / g.count) * 10) / 10,
      attempts: g.count
    }));
  }

  /**
   * Unified Multi-Source Activity Streak
   * Counts backward from today using YYYY-MM-DD
   */
  static calculateStreak({ unitPapers = [], fullPapers = [], spaceRepetition = [] } = {}) {
    const activeDates = new Set();

    const addDate = (dateStr) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        activeDates.add(d.toISOString().split('T')[0]);
      }
    };

    // 1. New/updated paper_no in unit papers
    unitPapers.forEach(p => {
      if (p.paper_no) addDate(p.updated_at || p.created_at || p.date);
    });

    // 2. New/updated marks in full papers
    fullPapers.forEach(fp => {
      if (fp.marks !== null && fp.marks !== undefined) {
        addDate(fp.updated_at || fp.created_at || fp.date);
      }
    });

    // 3. New/updated completed_at in space repetition
    spaceRepetition.forEach(sr => {
      if (sr.completed_at) addDate(sr.completed_at);
    });

    // Count backwards from today
    let streak = 0;
    const checkDate = new Date();

    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      if (activeDates.has(dateKey)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no activity yet, allow checking yesterday to preserve ongoing streak
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayKey = checkDate.toISOString().split('T')[0];
          if (activeDates.has(yesterdayKey)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    return streak;
  }

  /**
   * Strict Pending Test Papers Filter
   * Conditions: lesson_done === true && hw_done === true && hw_days === 0 && unit_paper.paper_no >= 1
   */
  static filterPendingTestPapers(lessons = []) {
    return lessons.filter(l => 
      l.lesson_done === true &&
      l.hw_done === true &&
      Number(l.hw_days) === 0 &&
      l.unit_paper && Number(l.unit_paper.paper_no) >= 1
    );
  }
}
