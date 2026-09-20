/**
 * Wosandi O/L Mission Control - Core Orchestrator
 * Dynamic Code Splitting, Scoped State Binding & Real-Time Data Wiring
 * Strict Namespace: wosandi_ol_*
 * Strict Table Prefix: wosandi_*
 */

import { subjectManager } from './subjectManager.js';
import { dataService } from './dataService.js';
import './gradeController.js';
import './subjectDrawer.js';

class MissionControlApp {
  constructor() {
    this.currentGrade = localStorage.getItem('wosandi_ol_active_grade') || '11';
    this.activeAnalyticsTab = 'sub_unit'; // 'sub_unit' | 'unit_wise'
    this.cachedData = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.renderDashboard();
  }

  setupEventListeners() {
    window.addEventListener('wosandi:gradeChanged', async (e) => {
      this.currentGrade = e.detail.gradeLevel;
      await this.renderDashboard();
    });

    window.addEventListener('wosandi:subjectsChanged', async () => {
      await this.renderDashboard();
    });
  }

  async renderDashboard() {
    try {
      const [{ TodayPriorities }, { UnitAnalytics }] = await Promise.all([
        import('./todayPriorities.js'),
        import('./unitAnalytics.js')
      ]);

      // Fetch scoped data for active grade & active subjects
      const data = await dataService.getScopedData(this.currentGrade);
      this.cachedData = data;

      // 0. Render Last Updated Timestamp
      const lastUpdatedBadge = document.getElementById('lastUpdatedBadge');
      if (lastUpdatedBadge && data.lastUpdated) {
        lastUpdatedBadge.textContent = `යාවත්කාලීන විය: ${data.lastUpdated}`;
      }

      // 1. Render Top Priorities (All 6 core priority rules)
      const priorities = new TodayPriorities('prioritiesContent');
      priorities.render({
        urgentModelPapers: data.urgentModelPapers,
        spacedRepetition: data.spaceRepetition,
        lastFullPaperDate: data.lastFullPaperDate,
        lastUnitPaperDate: data.lastUnitPaperDate,
        lessons: data.lessons,
        subUnits: data.subUnits
      });

      // 2. Render Activity Streak (Multi-Source Unified: unit_papers, full_papers, space_repetition)
      const streakDays = UnitAnalytics.calculateStreak({
        unitPapers: data.unitPaperMarks,
        fullPapers: data.fullPapers,
        spaceRepetition: data.spaceRepetition
      });
      const streakContainer = document.getElementById('streakContent');
      if (streakContainer) {
        streakContainer.innerHTML = `
          <div style="font-size: 1.5rem; font-weight: bold; color: #ea580c; display: flex; align-items: center; gap: 8px;">
            <span>🔥</span>
            <span>දින ${streakDays} ක අඛණ්ඩ අධ්‍යයනයක්</span>
          </div>
          <p style="font-size: 0.85rem; color: #64748b; margin: 6px 0 0 0;">
            (Unit Papers, Full Papers හෝ Spaced Repetition මත පදනම් වූ Unified Multi-Source Streak)
          </p>
        `;
      }

      // 3. Render Pending Test Papers Filter
      // Rule: lesson_done === true && hw_done === true && hw_days === 0 && unit_paper.paper_no >= 1
      const pendingPapers = UnitAnalytics.filterPendingTestPapers(data.lessons);
      const pendingBadge = document.getElementById('pendingPapersBadge');
      if (pendingBadge) {
        pendingBadge.textContent = `${pendingPapers.length} ක් සූදානම්`;
      }

      const pendingContainer = document.getElementById('pendingPapersContent');
      if (pendingContainer) {
        if (pendingPapers.length === 0) {
          pendingContainer.innerHTML = '<p style="color: #64748b; font-size: 0.88rem; margin: 0;">මෙම මොහොතේ විසඳීමට නියමිත නව Test Papers නොමැත. විශිෂ්ටයි! 🎉</p>';
        } else {
          pendingContainer.innerHTML = pendingPapers.map(p => {
            const paperNo = p.unit_paper ? p.unit_paper.paper_no : 1;
            const ts = p.updated_at ? new Date(p.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'දැන්';
            return `
              <div class="pending-paper-item">
                <div>
                  <strong style="display: block; font-size: 0.92rem; color: #0f172a;">${p.lesson_name || p.sub_unit_name}</strong>
                  <span style="font-size: 0.78rem; color: #64748b;">යාවත්කාලීන කළේ: ${ts}</span>
                </div>
                <span style="font-size: 0.75rem; padding: 4px 10px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-weight: 700; white-space: nowrap;">
                  Paper ${paperNo} සූදානම්
                </span>
              </div>
            `;
          }).join('');
        }
      }

      // 4. Render Dual-Tab Analytics (Zero-Score Exclusion strictly enforced)
      this.renderAnalytics(UnitAnalytics, data.unitPaperMarks);

    } catch (error) {
      console.error('Error during lazy module execution:', error);
    }
  }

  renderAnalytics(UnitAnalytics, records = []) {
    const btnSubUnit = document.getElementById('tabSubUnit');
    const btnUnitWise = document.getElementById('tabUnitWise');
    const container = document.getElementById('analyticsContent');
    if (!container) return;

    // Bind tab events once
    if (btnSubUnit && !btnSubUnit.dataset.tabBound) {
      btnSubUnit.dataset.tabBound = 'true';
      btnSubUnit.addEventListener('click', () => {
        this.activeAnalyticsTab = 'sub_unit';
        this.renderAnalytics(UnitAnalytics, this.cachedData ? this.cachedData.unitPaperMarks : []);
      });
    }
    if (btnUnitWise && !btnUnitWise.dataset.tabBound) {
      btnUnitWise.dataset.tabBound = 'true';
      btnUnitWise.addEventListener('click', () => {
        this.activeAnalyticsTab = 'unit_wise';
        this.renderAnalytics(UnitAnalytics, this.cachedData ? this.cachedData.unitPaperMarks : []);
      });
    }

    // Toggle active state on buttons
    if (btnSubUnit) {
      btnSubUnit.className = `tab-btn ${this.activeAnalyticsTab === 'sub_unit' ? 'active' : ''}`;
    }
    if (btnUnitWise) {
      btnUnitWise.className = `tab-btn ${this.activeAnalyticsTab === 'unit_wise' ? 'active' : ''}`;
    }

    const isSubUnit = this.activeAnalyticsTab === 'sub_unit';
    const averages = isSubUnit 
      ? UnitAnalytics.calculateSubUnitAverages(records)
      : UnitAnalytics.calculateUnitWiseAverages(records);

    if (averages.length === 0) {
      container.innerHTML = '<p style="color: #64748b; font-size: 0.88rem; margin: 0;">වලංගු Unit Paper දත්ත නොමැත (ලකුණු 0 বাদදී ඇත).</p>';
      return;
    }

    const rowsHtml = averages.map(row => {
      let pillClass = 'score-low';
      if (row.average >= 75) pillClass = 'score-high';
      else if (row.average >= 50) pillClass = 'score-mid';

      return `
        <tr>
          <td style="font-weight: 500;">${row.name}</td>
          <td style="text-align: center; color: #64748b;">${row.attempts}</td>
          <td style="text-align: right;">
            <span class="score-pill ${pillClass}">${row.average}%</span>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="analytics-table">
          <thead>
            <tr>
              <th>${isSubUnit ? 'Sub-Unit මාතෘකාව' : 'ප්‍රධාන ඒකකය (Unit)'}</th>
              <th style="text-align: center; width: 110px;">Attempts</th>
              <th style="text-align: right; width: 120px;">සාමාන්‍යය</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MissionControlApp();
});
