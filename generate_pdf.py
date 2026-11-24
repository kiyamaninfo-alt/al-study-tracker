import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Elite Academic Intelligence & Study Management System</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0b0f19;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
      line-height: 1.4;
    }

    /* Page Container */
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: #ffffff;
      padding: 14mm 16mm 12mm 16mm;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Top Running Bar */
    .doc-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 11px;
    }

    .doc-top-category {
      font-size: 8pt;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #4338ca;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .doc-top-badge {
      background: #f8fafc;
      color: #475569;
      font-size: 7pt;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid #cbd5e1;
    }

    /* Running Footer */
    .doc-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 7px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #64748b;
    }

    .doc-footer-left {
      font-weight: 600;
      color: #334155;
    }

    .doc-footer-right {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    /* Typography */
    h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    h2 {
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    h3 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 2px;
    }

    p {
      font-size: 8.2pt;
      color: #334155;
      line-height: 1.42;
    }

    .lead-text {
      font-size: 9pt;
      color: #475569;
      line-height: 1.42;
      margin-top: 2px;
      margin-bottom: 10px;
    }

    /* Badge & Tag Pills */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 7.2pt;
      font-weight: 700;
      line-height: 1.2;
    }
    .badge-indigo { background: #e0e7ff; color: #3730a3; }
    .badge-emerald { background: #d1fae5; color: #065f46; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-rose { background: #ffe4e6; color: #9f1239; }
    .badge-cyan { background: #cffafe; color: #155e75; }
    .badge-slate { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }

    /* Layout Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 9px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }

    /* Cards */
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 9px;
      padding: 9px 11px;
      position: relative;
    }

    .card-dark {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 9px;
      padding: 10px 13px;
      color: #f8fafc;
    }

    .card-highlight {
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%);
      border: 1px solid #c7d2fe;
      border-radius: 9px;
      padding: 10px 12px;
    }

    /* Icon Box */
    .icon-box {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      margin-right: 5px;
      flex-shrink: 0;
    }
    .icon-indigo { background: #4338ca; color: white; }
    .icon-emerald { background: #059669; color: white; }
    .icon-rose { background: #e11d48; color: white; }
    .icon-amber { background: #d97706; color: white; }
    .icon-cyan { background: #0891b2; color: white; }

    /* Data Table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.8pt;
      margin-top: 5px;
    }
    .data-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      text-align: left;
      padding: 5px 7px;
      border-bottom: 2px solid #cbd5e1;
      font-size: 7.2pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table td {
      padding: 5px 7px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-table tr:nth-child(even) {
      background: #fafafa;
    }

    /* Micro-Input vs Big Data Visual Box */
    .flow-card-grid {
      display: grid;
      grid-template-columns: 1fr 34px 1.45fr;
      align-items: stretch;
      gap: 8px;
      margin: 8px 0;
    }

    .flow-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      border-radius: 6px;
      border: 1px dashed #cbd5e1;
    }

    .flow-connector-text {
      font-size: 11pt;
      font-weight: 900;
      color: #4338ca;
    }

    .flow-connector-sub {
      font-size: 5.5pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      margin-top: 4px;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      margin-top: 4px;
    }

    .code-chip {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 6.8pt;
      background: #e2e8f0;
      color: #0f172a;
      padding: 1.5px 5px;
      border-radius: 4px;
      font-weight: 600;
    }

    .section-title-wrap {
      margin-bottom: 6px;
      border-left: 3.5px solid #4338ca;
      padding-left: 7px;
    }

    /* Visual Metric KPI box */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      margin: 8px 0;
    }
    .kpi-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .kpi-val {
      font-size: 12pt;
      font-weight: 800;
      color: #4338ca;
      line-height: 1.1;
    }
    .kpi-lbl {
      font-size: 6.8pt;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 2px;
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       PAGE 1: STRATEGIC OVERVIEW & HIGH-RANK ARCHITECTURE
       ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-top-bar">
        <div class="doc-top-category">
          <span>⚡ Elite Academic Operating System</span>
        </div>
        <div class="doc-top-badge">Autonomous Capability Dossier</div>
      </div>

      <!-- Hero Header -->
      <div style="margin-bottom: 12px;">
        <div style="display: flex; gap: 5px; margin-bottom: 5px;">
          <span class="badge-pill badge-indigo">Engineered for Island & National Top Ranks</span>
          <span class="badge-pill badge-emerald">Micro-Input / Big-Data Engine</span>
          <span class="badge-pill badge-cyan">Cognitive Science Integrated</span>
        </div>
        <h1>Autonomous Study Management & High-Rank Performance Intelligence System</h1>
        <p class="lead-text">
          A military-grade study orchestrator engineered exclusively for students aiming for <strong>Island Rank 1, National Top Percentiles, and Elite Competitive Examinations</strong>. Replaces human guesswork with real-time algorithmic priorities, memory science, and instant multi-window telemetry.
        </p>
      </div>

      <!-- Quick KPI Row -->
      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-val">6-Factor</div>
          <div class="kpi-lbl">Autonomous Priority Rules</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">5-Stage</div>
          <div class="kpi-lbl">Scientific Memory Intervals</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">&lt; 15 Sec</div>
          <div class="kpi-lbl">Daily Tracking Overhead</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val">100%</div>
          <div class="kpi-lbl">Offline-First Cloud Sync</div>
        </div>
      </div>

      <!-- Pillar 1: Why This System Exists (Rank 1 Focus) -->
      <div class="section-title-wrap" style="margin-top: 10px;">
        <h2><span class="icon-box icon-indigo">🏆</span> Comprehensive System Built for Highest Rank Aspirants</h2>
      </div>
      <p style="margin-bottom: 8px;">
        High-stakes competitive exams (Advanced Level, Engineering/Medical Entrances, Bar Exams, Olympiads) are not won by logging aimless hours. They are won through <strong>algorithmic pacing, zero blind spots, balanced subject parity, and disciplined memory retention</strong>. This system eliminates "study anxiety" and "decision paralysis" by turning raw study data into an active co-pilot that directs every minute of study.
      </p>

      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card">
          <div style="font-weight: 700; color: #0f172a; font-size: 8.5pt; margin-bottom: 2px;">🎯 Zero-Guesswork Daily Action</div>
          <p style="font-size: 7.6pt; color: #475569;">
            The system tells the student <em>exactly</em> which subject to open, what chapter to practice, and which past paper to follow right now based on priority heuristics.
          </p>
        </div>
        <div class="card">
          <div style="font-weight: 700; color: #0f172a; font-size: 8.5pt; margin-bottom: 2px;">⚖️ Subject Parity & Balance Radar</div>
          <p style="font-size: 7.6pt; color: #475569;">
            Prevents the fatal high-achiever trap of over-practicing favorite subjects while subconsciously neglecting lower-confidence topics.
          </p>
        </div>
        <div class="card">
          <div style="font-weight: 700; color: #0f172a; font-size: 8.5pt; margin-bottom: 2px;">📈 Predictive Z-Score & Velocity</div>
          <p style="font-size: 7.6pt; color: #475569;">
            Continuously calculates required syllabus velocity (lessons/week) vs. real speed to guarantee full exam readiness 60+ days before national tests.
          </p>
        </div>
      </div>

      <!-- Pillar 2: The Core Philosophy: "Micro-Input, Big-Data Intelligence" -->
      <div class="section-title-wrap">
        <h2><span class="icon-box icon-emerald">⚡</span> The "Micro-Input → Big-Data" Architectural Advantage</h2>
      </div>
      <p style="margin-bottom: 6px;">
        Traditional study apps fail because they demand heavy manual data entry, leading to student burnout. This architecture is designed around <strong>zero-friction interactions</strong>: 5 to 10 seconds of user input triggers institutional-grade statistical models and deep intelligence graphs.
      </p>

      <div class="flow-card-grid">
        <!-- Minimal Input Box -->
        <div class="card" style="border: 1.5px solid #a7f3d0; background: #f0fdf4;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #065f46; font-size: 8pt;">VERY LESS INPUT (&lt; 15s)</strong>
            <span class="badge-pill badge-emerald">Zero Friction</span>
          </div>
          <ul style="font-size: 7.5pt; color: #166534; padding-left: 13px; line-height: 1.45;">
            <li><strong>1 Tap</strong>: Toggle lesson "Done" checkbox</li>
            <li><strong>1 Tap</strong>: Start Focus Timer (Auto subject tag)</li>
            <li><strong>1 Number</strong>: Input raw paper mark (e.g. 78%)</li>
            <li><strong>0 Tedious Forms</strong>: No manual spreadsheets</li>
          </ul>
        </div>

        <!-- Connector -->
        <div class="flow-connector">
          <div class="flow-connector-text">➔</div>
          <div class="flow-connector-sub">Auto Engine</div>
        </div>

        <!-- Big Data Output Box -->
        <div class="card" style="border: 1.5px solid #c7d2fe; background: #eef2ff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #3730a3; font-size: 8pt;">MASSIVE BIG-DATA INTELLIGENCE DELIVERED</strong>
            <span class="badge-pill badge-indigo">Institutional Depth</span>
          </div>
          <div class="tag-list">
            <span class="code-chip">6-Factor Priority Queue</span>
            <span class="code-chip">Ebbinghaus Memory Intervals</span>
            <span class="code-chip">Multi-Window Rolling Avgs (3/5/7/10/20/50)</span>
            <span class="code-chip">Time-Window Velocity Drift (7d/14d/30d/90d)</span>
            <span class="code-chip">Sub-Unit vs Unit Variance Analysis</span>
            <span class="code-chip">Multi-Source Consistency Streak Engine</span>
            <span class="code-chip">Dynamic Syllabus Pacing Tracker</span>
            <span class="code-chip">Live Cloud Telemetry Broadcast</span>
          </div>
        </div>
      </div>

      <!-- Quick Platform Architecture Callout -->
      <div class="card-dark" style="margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="color: #38bdf8; font-size: 8.5pt;">⚙️ Enterprise-Grade Offline-First & Realtime Telemetry Architecture</strong>
          <span class="badge-pill" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">Production-Tested</span>
        </div>
        <p style="color: #94a3b8; font-size: 7.6pt; line-height: 1.4;">
          Engineered with an <strong>IndexedDB local-first database</strong> for instantaneous latency-free tracking even during power outages and network drops. Features automatic bidirectional background synchronization with <strong>Supabase Postgres Realtime</strong>. Mentors, tutors, or parents can view live study sessions broadcast over WebSockets in real time.
        </p>
      </div>
    </div>

    <!-- Page 1 Footer -->
    <div class="doc-footer">
      <div class="doc-footer-left">Autonomous Academic Management System — Capabilities & Features</div>
      <div class="doc-footer-right">Section 01 : Strategic Overview | Page 1 of 4</div>
    </div>
  </div>


  <!-- =========================================================================
       PAGE 2: AUTONOMOUS NEXT-ACTION ENGINE & SYLLABUS PACING
       ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-top-bar">
        <div class="doc-top-category">
          <span>🧠 Autonomous Next-Action Engine</span>
        </div>
        <div class="doc-top-badge">Decision Intelligence</div>
      </div>

      <div style="margin-bottom: 10px;">
        <h2><span class="icon-box icon-rose">⚡</span> Suggests What To Do Next, What Subject To Study & What Past Papers To Follow</h2>
        <p class="lead-text" style="margin-bottom: 6px;">
          The system eliminates hesitation by dynamically calculating a ranked, 6-point daily action checklist. Rather than wondering <em>"What should I study today?"</em>, <em>"Which subject needs attention?"</em>, or <em>"Which past paper should I follow?"</em>, the student is greeted with a deterministic, mathematically prioritized agenda.
        </p>
      </div>

      <!-- The 6 Priority Algorithms Table -->
      <div style="margin-bottom: 11px;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 24px;">#</th>
              <th style="width: 145px;">Algorithmic Trigger</th>
              <th>How It Suggests What To Do Next & Which Paper To Follow</th>
              <th style="width: 95px;">Action Badge</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1</strong></td>
              <td><strong>Urgent Model Paper Radar</strong></td>
              <td>Detects units where theory lessons are completed but Model Paper 1 has not yet been attempted. Flags the oldest neglected topic to ensure zero testing lag.</td>
              <td><span class="badge-pill badge-rose">⚡ Urgent Target</span></td>
            </tr>
            <tr>
              <td><strong>2</strong></td>
              <td><strong>Spaced Repetition Review</strong></td>
              <td>Evaluates memory retention decay curves. Pulls the exact sub-unit that has matured for review today (Day 1, 3, 7, 21, or 45) to prevent forgetting.</td>
              <td><span class="badge-pill badge-indigo">🧠 Memory Recall</span></td>
            </tr>
            <tr>
              <td><strong>3</strong></td>
              <td><strong>Full Past Paper Recency</strong></td>
              <td>Monitors days elapsed since the last timed 3-hour comprehensive exam. Triggers an attention warning if more than 7 days pass without a full-syllabus simulation.</td>
              <td><span class="badge-pill badge-amber">📝 Past Paper Due</span></td>
            </tr>
            <tr>
              <td><strong>4</strong></td>
              <td><strong>Modular Unit Paper Counter</strong></td>
              <td>Tracks days elapsed since the last focused unit test. Ensures continuous modular evaluation so knowledge gaps are plugged before full papers.</td>
              <td><span class="badge-pill badge-cyan">📑 Unit Test Due</span></td>
            </tr>
            <tr>
              <td><strong>5</strong></td>
              <td><strong>Untested Lessons Alert</strong></td>
              <td>Scans the entire syllabus database for completed chapters with exactly zero test paper records. Prioritizes fresh assessment generation.</td>
              <td><span class="badge-pill badge-rose">⚠️ Blindspot Fix</span></td>
            </tr>
            <tr>
              <td><strong>6</strong></td>
              <td><strong>Least-Practiced Unit Detector</strong></td>
              <td>Performs statistical variance analysis across all sub-units. Isolates the specific sub-topic with the lowest cumulative question attempts.</td>
              <td><span class="badge-pill badge-emerald">🎯 Targeted Focus</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Real-World Directive Example Box -->
      <div class="card" style="background: #f1f5f9; border-left: 4px solid #4338ca; margin-bottom: 11px; padding: 7px 11px;">
        <strong style="color: #1e293b; font-size: 7.8pt; display: block; margin-bottom: 2px;">💡 Real-World Daily Directive Generated For The Candidate:</strong>
        <p style="font-size: 7.4pt; color: #475569; line-height: 1.4;">
          <em>"Action #1: Solve Model Paper 1 for ET Unit 3 (20 days overdue) ➔ Action #2: Spaced Repetition Review for ICT Unit 1.1 (Day 7 interval due) ➔ Action #3: Full Past Paper required (8 days since last full exam) ➔ Action #4: Focus study on SFT Unit 4.2 (detected as least-practiced subunit)."</em>
        </p>
      </div>

      <!-- Syllabus Velocity & Pacing Engine -->
      <div class="section-title-wrap">
        <h2><span class="icon-box icon-amber">⏱️</span> Syllabus Velocity & Examination Pacing Intelligence</h2>
      </div>
      <p style="margin-bottom: 6px;">
        Rank-1 candidates do not finish the syllabus the week before the exam. They finish months in advance to dedicate 100+ days solely to past papers. The platform calculates real-time pacing telemetry to guarantee this timeline:
      </p>

      <div class="grid-2" style="margin-bottom: 10px;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <strong style="color: #0f172a; font-size: 8.2pt;">Live Countdown & Days-to-Target</strong>
            <span class="badge-pill badge-indigo">Real-Time</span>
          </div>
          <p style="font-size: 7.6pt; color: #475569;">
            Dynamically splits remaining time into <strong>Days, Hours, Minutes, and Seconds</strong>. Continuously adjusts required weekly completion rates as deadlines approach.
          </p>
        </div>

        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <strong style="color: #0f172a; font-size: 8.2pt;">Required vs. Actual Velocity Engine</strong>
            <span class="badge-pill badge-emerald">Smart Pacing</span>
          </div>
          <p style="font-size: 7.6pt; color: #475569;">
            Compares <strong>Current Velocity (Lessons/Week)</strong> against <strong>Required Velocity (Lessons/Week)</strong> per subject, issuing visual early-warning flags if pacing slips.
          </p>
        </div>
      </div>

      <!-- Paper Progression Hierarchy -->
      <div class="card-highlight">
        <strong style="color: #1e1b4b; font-size: 8.5pt; display: block; margin-bottom: 3px;">📚 3-Tier Examination Mastery Framework (What Papers To Follow)</strong>
        <p style="font-size: 7.6pt; color: #312e81; margin-bottom: 6px;">
          The system guides candidates systematically across three progressive testing tiers, ensuring no student is thrown into full past papers before mastering modular units:
        </p>
        <div class="grid-3">
          <div style="background: white; padding: 6px 9px; border-radius: 6px; border: 1px solid #c7d2fe;">
            <div style="font-weight: 700; color: #4338ca; font-size: 7.8pt;">Level 1: Sub-Unit Papers</div>
            <div style="font-size: 7.2pt; color: #64748b;">Micro-assessments targeting specific individual lessons immediately after study.</div>
          </div>
          <div style="background: white; padding: 6px 9px; border-radius: 6px; border: 1px solid #c7d2fe;">
            <div style="font-weight: 700; color: #4338ca; font-size: 7.8pt;">Level 2: Full Unit Papers</div>
            <div style="font-size: 7.2pt; color: #64748b;">Comprehensive chapter-level tests combining all sub-units with difficulty weighting.</div>
          </div>
          <div style="background: white; padding: 6px 9px; border-radius: 6px; border: 1px solid #c7d2fe;">
            <div style="font-weight: 700; color: #4338ca; font-size: 7.8pt;">Level 3: National Past Papers</div>
            <div style="font-size: 7.2pt; color: #64748b;">Official past examinations and timed national mock papers with full Z-Score modeling.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page 2 Footer -->
    <div class="doc-footer">
      <div class="doc-footer-left">Autonomous Academic Management System — Capabilities & Features</div>
      <div class="doc-footer-right">Section 02 : Recommendation & Pacing | Page 2 of 4</div>
    </div>
  </div>


  <!-- =========================================================================
       PAGE 3: COGNITIVE SCIENCE: SPACED REPETITION & DEEP FOCUS TIMER
       ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-top-bar">
        <div class="doc-top-category">
          <span>🔬 Cognitive Science & Execution Engine</span>
        </div>
        <div class="doc-top-badge">Memory & Deep Work</div>
      </div>

      <!-- Feature 1: Spaced Repetition -->
      <div style="margin-bottom: 12px;">
        <div class="section-title-wrap">
          <h2><span class="icon-box icon-indigo">🧠</span> Scientific Spaced Repetition Feature (Ebbinghaus Forgetting Curve)</h2>
        </div>
        <p class="lead-text" style="margin-bottom: 6px;">
          Cramming produces short-term familiarity that evaporates under exam pressure. The system natively implements <strong>Hermann Ebbinghaus’s Forgetting Curve</strong> to convert learned concepts into permanent neural retention through systematic, automated retrieval cycles.
        </p>

        <div class="grid-2" style="margin-bottom: 8px;">
          <div class="card">
            <strong style="color: #0f172a; font-size: 8.2pt; display: block; margin-bottom: 3px;">The 5-Stage Optimal Interval Architecture</strong>
            <p style="font-size: 7.6pt; color: #475569; margin-bottom: 5px;">
              Reviews are dynamically scheduled at precise exponential intervals when memory decay is steepest:
            </p>
            <div style="display: flex; flex-direction: column; gap: 3px; font-size: 7.2pt;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"><strong style="color: #e11d48;">Stage 1 (Day 1):</strong> <span>Immediate recall after initial lesson completion</span></div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"><strong style="color: #d97706;">Stage 2 (Day 3):</strong> <span>Stabilization of primary memory traces</span></div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"><strong style="color: #059669;">Stage 3 (Day 7):</strong> <span>One-week consolidation test</span></div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 2px;"><strong style="color: #4f46e5;">Stage 4 (Day 21):</strong> <span>Synaptic reinforcement into mid-term memory</span></div>
              <div style="display: flex; justify-content: space-between;"><strong style="color: #2563eb;">Stage 5 (Day 45+):</strong> <span>Long-term permanent storage & rapid exam retrieval</span></div>
            </div>
          </div>

          <div class="card">
            <strong style="color: #0f172a; font-size: 8.2pt; display: block; margin-bottom: 3px;">Multi-Cycle Tracking & Automated Scheduling</strong>
            <p style="font-size: 7.6pt; color: #475569; margin-bottom: 5px;">
              Unlike generic flashcard software, the system maps intervals across the entire curriculum syllabus hierarchy:
            </p>
            <ul style="font-size: 7.4pt; color: #334155; padding-left: 13px; line-height: 1.4;">
              <li><strong>Multi-Cycle Progression</strong>: Supports Cycle 1 through advanced multi-tier review cycles.</li>
              <li><strong>Zero-Effort Verification</strong>: 1-click checkbox marks a stage complete and auto-calculates the next due date.</li>
              <li><strong>Direct Priority Feeder</strong>: Any item maturing today instantly triggers Priority Alert #2 on the master dashboard.</li>
              <li><strong>Filterable Day Slices</strong>: Filter by Day 1, 3, 7, 21, or 45+ for targeted daily revision blitzes.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Feature 2: Deep Focus Session Timer -->
      <div>
        <div class="section-title-wrap">
          <h2><span class="icon-box icon-cyan">⏱️</span> Deep Focus Session Timer & Realtime Telemetry</h2>
        </div>
        <p class="lead-text" style="margin-bottom: 6px;">
          Eliminates fragmented, unfocused study. The built-in focus timer binds every single minute of study to an explicit subject, unit, and learning target while logging institutional-grade telemetry.
        </p>

        <div class="grid-3" style="margin-bottom: 8px;">
          <div class="card">
            <div style="font-weight: 700; color: #0f172a; font-size: 8.2pt; margin-bottom: 2px;">🎯 Target-Bound Sessions</div>
            <p style="font-size: 7.5pt; color: #475569;">
              Before the timer starts, the user selects the exact Subject and Unit. Prevents "passive reading" by enforcing intent and accountability.
            </p>
          </div>

          <div class="card">
            <div style="font-weight: 700; color: #0f172a; font-size: 8.2pt; margin-bottom: 2px;">🔊 Acoustic Shielding & Wake Lock</div>
            <p style="font-size: 7.5pt; color: #475569;">
              Integrated ambient Brown Noise generator to enhance alpha brainwave focus. Built-in Screen Wake Lock API prevents phone/desktop sleep.
            </p>
          </div>

          <div class="card">
            <div style="font-weight: 700; color: #0f172a; font-size: 8.2pt; margin-bottom: 2px;">⚡ Realtime Cloud Broadcast</div>
            <p style="font-size: 7.5pt; color: #475569;">
              Active timer state streams over WebSockets (Supabase Realtime). Mentors, parents, or secondary displays see live active sessions in real time.
            </p>
          </div>
        </div>

        <!-- Telemetry Data Flow Table -->
        <table class="data-table" style="margin-bottom: 10px;">
          <thead>
            <tr>
              <th style="width: 140px;">Timer Capability</th>
              <th>Technical Implementation</th>
              <th style="width: 175px;">Competitive High-Rank Benefit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Micro-Interval Presets</strong></td>
              <td>25m Pomodoro, 50m Deep Session, and Custom duration options.</td>
              <td>Prevents cognitive fatigue and sustains peak mental stamina during marathon study days.</td>
            </tr>
            <tr>
              <td><strong>Offline-First Persistence</strong></td>
              <td>IndexedDB local queue with millisecond start/stop timestamps.</td>
              <td>Guarantees 100% data integrity even when studying in areas with unreliable internet connections.</td>
            </tr>
            <tr>
              <td><strong>Session Heatmap Integration</strong></td>
              <td>Automatic aggregation into hourly histograms and 365-day calendar heatmaps.</td>
              <td>Identifies peak biological study hours (e.g. morning vs. late night) for maximum retention.</td>
            </tr>
            <tr>
              <td><strong>Multi-Source Unified Streak</strong></td>
              <td>Synthesizes timer sessions, unit paper submissions, and spaced repetitions into one streak.</td>
              <td>Builds psychological momentum and daily discipline without artificial gamification tricks.</td>
            </tr>
          </tbody>
        </table>

        <!-- Live Telemetry Banner Mock -->
        <div style="background: #0f172a; border-radius: 7px; padding: 7px 11px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #1e293b;">
          <div style="display: flex; align-items: center; gap: 7px;">
            <span style="font-size: 10pt; color: #ef4444; animation: pulse 1.5s infinite;">🔴</span>
            <span style="font-size: 7.5pt; color: #f8fafc; font-weight: 600;">Live Telemetry Stream: Active Study Session Broadcasted Across Devices</span>
          </div>
          <span class="badge-pill" style="background: rgba(34, 197, 94, 0.2); color: #4ade80; font-size: 6.8pt;">WebSocket Connected</span>
        </div>
      </div>
    </div>

    <!-- Page 3 Footer -->
    <div class="doc-footer">
      <div class="doc-footer-left">Autonomous Academic Management System — Capabilities & Features</div>
      <div class="doc-footer-right">Section 03 : Memory Science & Focus Telemetry | Page 3 of 4</div>
    </div>
  </div>


  <!-- =========================================================================
       PAGE 4: BIG-DATA ANALYTICS, Z-SCORE & BUYER IMPLEMENTATION VALUE
       ========================================================================= -->
  <div class="page">
    <div>
      <div class="doc-top-bar">
        <div class="doc-top-category">
          <span>📊 Predictive Analytics & Institutional Value</span>
        </div>
        <div class="doc-top-badge">Big Data Intelligence</div>
      </div>

      <!-- Feature 1: Multi-Window Rolling Averages -->
      <div style="margin-bottom: 10px;">
        <div class="section-title-wrap">
          <h2><span class="icon-box icon-indigo">📈</span> Statistical Multi-Window Analytics Engine</h2>
        </div>
        <p class="lead-text" style="margin-bottom: 6px;">
          A single raw score (e.g. 75%) is meaningless without historical context and statistical smoothing. The system transforms individual test scores into a multi-dimensional analytics suite that reveals true trajectory and removes test variance anomalies.
        </p>

        <div class="grid-2" style="margin-bottom: 8px;">
          <div class="card">
            <strong style="color: #0f172a; font-size: 8.2pt; display: block; margin-bottom: 3px;">Paper-Count Moving Averages (Trend Smoothing)</strong>
            <p style="font-size: 7.6pt; color: #475569; margin-bottom: 5px;">
              Computes rolling averages across consecutive examination cohorts:
            </p>
            <div style="display: flex; gap: 3.5px; flex-wrap: wrap;">
              <span class="badge-pill badge-indigo">Last 3 Papers</span>
              <span class="badge-pill badge-indigo">Last 5 Papers</span>
              <span class="badge-pill badge-indigo">Last 7 Papers</span>
              <span class="badge-pill badge-indigo">Last 10 Papers</span>
              <span class="badge-pill badge-indigo">Last 20 Papers</span>
              <span class="badge-pill badge-indigo">Last 50 Papers</span>
              <span class="badge-pill badge-indigo">All Lifetime</span>
            </div>
            <p style="font-size: 7.2pt; color: #64748b; margin-top: 5px;">
              Instantly distinguishes between a temporary bad test day versus a systematic decline in subject comprehension.
            </p>
          </div>

          <div class="card">
            <strong style="color: #0f172a; font-size: 8.2pt; display: block; margin-bottom: 3px;">Time-Window Velocity Drift (Recency Bias Filter)</strong>
            <p style="font-size: 7.6pt; color: #475569; margin-bottom: 5px;">
              Measures score changes across strict chronological time horizons:
            </p>
            <div style="display: flex; gap: 3.5px; flex-wrap: wrap;">
              <span class="badge-pill badge-emerald">3 Days</span>
              <span class="badge-pill badge-emerald">5 Days</span>
              <span class="badge-pill badge-emerald">7 Days</span>
              <span class="badge-pill badge-emerald">14 Days</span>
              <span class="badge-pill badge-emerald">30 Days</span>
              <span class="badge-pill badge-emerald">60 Days</span>
              <span class="badge-pill badge-emerald">90 Days</span>
            </div>
            <p style="font-size: 7.2pt; color: #64748b; margin-top: 5px;">
              Allows students and coaches to assess whether recent revision strategies are actively boosting scores over the past month.
            </p>
          </div>
        </div>
      </div>

      <!-- Feature 2: Z-Score Normalization & Outlier Exclusion -->
      <div class="card-highlight" style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
          <strong style="color: #1e1b4b; font-size: 8.2pt;">🎯 Standardized Z-Score Modeling & Strict Noise Filtering</strong>
          <span class="badge-pill badge-indigo">Competitive Rank Math</span>
        </div>
        <p style="font-size: 7.6pt; color: #312e81; line-height: 1.4;">
          <strong>Z-Score Standardization</strong>: Raw percentage marks fluctuate based on paper difficulty. The platform computes statistical standard deviations and standardized Z-Scores across subjects to project realistic national ranking percentiles.<br>
          <strong>Zero-Score Noise Exclusion</strong>: Automatically filters out incomplete papers (0 marks or null scores) from averages to prevent distortion of long-term predictive models.
        </p>
      </div>

      <!-- Commercial / Client Value for Fiverr Buyers -->
      <div class="section-title-wrap">
        <h2><span class="icon-box icon-emerald">💼</span> Commercial Value & Turn-Key Deployment Value</h2>
      </div>
      <p style="margin-bottom: 6px;">
        This battle-tested system represents a turn-key, enterprise-grade solution ready for deployment across educational institutions, private tutoring academies, ed-tech startups, or ambitious individual candidates:
      </p>

      <div class="grid-2" style="margin-bottom: 10px;">
        <div class="card">
          <strong style="color: #0f172a; font-size: 8.2pt;">👨‍🏫 For Tutoring Academies & Coaching Institutes</strong>
          <ul style="font-size: 7.4pt; color: #475569; padding-left: 13px; margin-top: 3px; line-height: 1.4;">
            <li>Real-time cohort oversight: track student completion rates live</li>
            <li>Early intervention alerts when student velocity falls behind schedule</li>
            <li>Transparent proof of student effort via automated cloud heatmaps</li>
          </ul>
        </div>

        <div class="card">
          <strong style="color: #0f172a; font-size: 8.2pt;">🚀 For EdTech Founders & SaaS Portfolios</strong>
          <ul style="font-size: 7.4pt; color: #475569; padding-left: 13px; margin-top: 3px; line-height: 1.4;">
            <li>Turn-key responsive PWA architecture (installable on iOS, Android, PC)</li>
            <li>Supabase Postgres backend with Row Level Security (RLS) & WebSockets</li>
            <li>Zero ongoing licensing costs: pure modern vanilla JS + standard SQL</li>
          </ul>
        </div>
      </div>

      <!-- Summary Callout -->
      <div class="card-dark" style="text-align: center; padding: 9px 12px;">
        <div style="font-size: 9pt; font-weight: 800; color: #38bdf8; margin-bottom: 2px;">
          The Ultimate Autonomous Academic Competitive Edge
        </div>
        <div style="font-size: 7.4pt; color: #cbd5e1; max-width: 580px; margin: 0 auto; line-height: 1.38;">
          Minimal input friction. Institutional big-data intelligence. Cognitive memory science. Built to systematically convert ambitious study hours into top national rankings.
        </div>
      </div>
    </div>

    <!-- Page 4 Footer -->
    <div class="doc-footer">
      <div class="doc-footer-left">Autonomous Academic Management System — Capabilities & Features</div>
      <div class="doc-footer-right">Section 04 : Analytics & Value | Page 4 of 4</div>
    </div>
  </div>

</body>
</html>
"""

html_path = '/home/anjana/al-study-tracker/study_system_capabilities_showcase.html'
pdf_path = '/home/anjana/al-study-tracker/Study_Management_System_Capabilities.pdf'

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"HTML updated at {html_path}")

cmd = [
    'google-chrome',
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-sync',
    f'--print-to-pdf={pdf_path}',
    '--print-to-pdf-no-header',
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
print("Chrome return code:", res.returncode)
print("Chrome stderr:", res.stderr)
if os.path.exists(pdf_path):
    print(f"PDF successfully updated: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF creation failed!")
