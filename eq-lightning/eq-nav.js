/* ═══════════════════════════════════════════════════════════════
   eq-nav.js — EQ Lightning Navigation Component
   Injects project navigation bar, Lightning header, and sidebar
   panel (Design Notes + Feedback) on every page.
   Usage: <script src="eq-nav.js"></script> before </body>
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Page registry ───────────────────────────────────────────
  var PAGES = {
    reference: [
      { file: 'index',           label: 'Sitemap' },
      { file: 'personas',        label: 'Personas' },
      { file: 'story-reference', label: 'Story Reference' },
      { file: 'research',        label: 'Research' }
    ],
    records: [
      { file: 'lead',        label: 'Lead',        icon: 'lead', color: '#F88962' },
      { file: 'account',     label: 'Account',     icon: 'account', color: '#7F8DE1' },
      { file: 'contact',     label: 'Contact',     icon: 'contact', color: '#A094ED' },
      { file: 'opportunity', label: 'Opportunity', icon: 'opportunity', color: '#FCB95B' },
      { file: 'orders',      label: 'Orders List', icon: 'orders', color: '#6BBECD' },
      { file: 'order',       label: 'Order',       icon: 'orders', color: '#6BBECD' },
      { file: 'order-issue', label: 'Order (Issue)', icon: 'orders', color: '#6BBECD' },
      { file: 'contract',    label: 'Contract',    icon: 'contract', color: '#E0725A' },
      { file: 'solution',    label: 'Solution',    icon: 'solution_detail', color: '#4BC076' },
      { file: 'case',        label: 'Case',        icon: 'case', color: '#F2836B' }
    ]
  };

  // ── Detect current page ─────────────────────────────────────
  var path = location.pathname;
  var currentFile = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';
  var currentLabel = 'Page';
  PAGES.records.forEach(function (p) { if (p.file === currentFile) currentLabel = p.label; });
  PAGES.reference.forEach(function (p) { if (p.file === currentFile) currentLabel = p.label; });

  // ── Build navigation bar ────────────────────────────────────
  var nav = document.createElement('nav');
  nav.className = 'eq-nav-bar';
  nav.setAttribute('aria-label', 'EQ Lightning project navigation');

  var html = '';
  html += '<div class="eq-nav-logo">';
  html += '<svg height="14" viewBox="0 0 92 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Equinix">';
  html += '<path d="M45.8839 0L36.7208 3.21551V51.3797L30.5665 49.2588V5.33638L12.2403 11.7674V42.8278L6.15433 40.707V13.8883L0 16.0091V45.0171L18.3262 51.4481V16.0775L24.4806 13.9567V53.569L42.8068 60V7.52566L45.8839 6.49943L48.9611 7.52566V60L67.2873 53.569V13.9567L73.4417 16.0775V51.4481L91.7679 45.0171V16.0091L85.6819 13.8883V40.707L79.5276 42.8278V11.7674L61.2014 5.33638V49.2588L55.047 51.3797V3.21551L45.8839 0Z" fill="white"/>';
  html += '</svg>';
  html += 'EQ Lightning';
  html += '</div>';
  html += '<div class="eq-nav-sep"></div>';

  // Reference pages
  PAGES.reference.forEach(function (p) {
    var active = (currentFile === p.file) ? ' is-active' : '';
    html += '<a href="' + p.file + '.html" class="' + active + '">' + p.label + '</a>';
  });

  // Toggles on the right
  html += '<div class="eq-nav-right">';
  html += '<div class="eq-nav-toggle" id="navToggleAnnotations" role="switch" aria-checked="false" aria-label="Toggle annotations" tabindex="0">';
  html += '<span class="eq-toggle-switch"></span> Annotations';
  html += '</div>';
  html += '<div class="eq-nav-toggle" id="navToggleStory" role="switch" aria-checked="false" aria-label="Toggle data story" tabindex="0">';
  html += '<span class="eq-toggle-switch"></span> Data Story';
  html += '</div>';
  html += '<div class="eq-nav-sep" style="height:14px;"></div>';
  html += '<button class="eq-nav-toggle" id="navBtnNotes" aria-label="Open design notes sidebar" tabindex="0" style="border:none;background:none;font:inherit;" data-tab="notes">';
  html += '<span style="font-size:0.875rem;margin-right:2px;">&#x2139;&#xFE0E;</span> Notes';
  html += '</button>';
  html += '<button class="eq-nav-toggle" id="navBtnFeedback" aria-label="Open feedback sidebar" tabindex="0" style="border:none;background:none;font:inherit;" data-tab="feedback">';
  html += '<span style="font-size:0.75rem;margin-right:2px;">&#x2709;</span> Feedback';
  html += '</button>';
  html += '</div>';

  nav.innerHTML = html;

  // ── Build Lightning global header ───────────────────────────
  var header = document.createElement('header');
  header.className = 'eq-global-header';
  header.setAttribute('role', 'banner');

  var hhtml = '';
  hhtml += '<div class="eq-waffle" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';
  hhtml += '<span class="eq-app-name">Sales</span>';
  hhtml += '<div class="eq-search-box"><input type="search" placeholder="Search Salesforce" aria-label="Search Salesforce"></div>';
  hhtml += '<div class="eq-header-actions">';
  hhtml += '<button aria-label="Notifications" title="Notifications"><svg class="slds-icon slds-icon_x-small" style="fill:#fff;" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#notification"></use></svg></button>';
  hhtml += '<div class="eq-avatar" aria-label="User menu">RB</div>';
  hhtml += '</div>';
  header.innerHTML = hhtml;

  // ── Build object tab bar (only on record pages) ─────────────
  var isRecordPage = PAGES.records.some(function (p) { return p.file === currentFile; });
  var tabBar = null;

  if (isRecordPage) {
    tabBar = document.createElement('div');
    tabBar.className = 'eq-context-bar';
    tabBar.setAttribute('role', 'tablist');
    tabBar.setAttribute('aria-label', 'Object record tabs');

    var thtml = '';
    PAGES.records.forEach(function (p) {
      var active = (currentFile === p.file) ? ' is-active' : '';
      var selected = (currentFile === p.file) ? 'true' : 'false';
      thtml += '<a href="' + p.file + '.html" class="eq-object-tab' + active + '" role="tab" aria-selected="' + selected + '">';
      thtml += '<span class="slds-icon_container" style="background:' + p.color + '; border-radius:4px; padding:2px; display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; margin-right:6px; vertical-align:middle;"><svg class="slds-icon slds-icon_xx-small" style="fill:#fff;" aria-hidden="true"><use href="assets/icons/standard-sprite/svg/symbols.svg#' + p.icon + '"></use></svg></span>';
      thtml += p.label;
      thtml += '</a>';
    });
    tabBar.innerHTML = thtml;
  }

  // ── Build sidebar panel ────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.className = 'eq-sidebar-overlay';
  overlay.id = 'eqSidebarOverlay';

  var sidebar = document.createElement('aside');
  sidebar.className = 'eq-sidebar';
  sidebar.id = 'eqSidebar';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Design notes and feedback');

  var shtml = '';
  shtml += '<div class="eq-sidebar-header">';
  shtml += '<h2 id="eqSidebarTitle">' + currentLabel + ' — Design Notes</h2>';
  shtml += '<button class="eq-sidebar-close" id="eqSidebarClose" aria-label="Close sidebar">&times;</button>';
  shtml += '</div>';

  // Tabs
  shtml += '<div class="eq-sidebar-tabs">';
  shtml += '<button class="eq-sidebar-tab is-active" data-panel="notes">Design Notes</button>';
  shtml += '<button class="eq-sidebar-tab" data-panel="feedback">Feedback</button>';
  shtml += '</div>';

  // Notes panel
  shtml += '<div class="eq-sidebar-body" id="eqSidebarNotes">';
  shtml += '<div class="eq-sidebar-notes" id="eqNotesContent">';
  shtml += '<p style="color:#706E6B;font-style:italic;">No design notes configured for this page.</p>';
  shtml += '</div>';
  shtml += '</div>';

  // Feedback panel (hidden by default)
  shtml += '<div class="eq-sidebar-body" id="eqSidebarFeedback" style="display:none;">';
  shtml += '<div class="eq-feedback-meta" id="eqFeedbackMeta">';
  shtml += '<strong>Page:</strong> ' + currentLabel + ' (' + currentFile + '.html)<br>';
  shtml += '<strong>Captured:</strong> <span id="eqFeedbackTimestamp"></span>';
  shtml += '</div>';
  shtml += '<div id="eqFeedbackScreenshot" class="eq-feedback-screenshot" style="margin-top:0.75rem;display:none;"></div>';
  shtml += '<form class="eq-feedback-form" id="eqFeedbackForm" style="margin-top:0.75rem;" action="https://formspree.io/f/xpqjbnno" method="POST">';
  shtml += '<input type="hidden" name="_subject" value="EQ Lightning Feedback — ' + currentLabel + '">';
  shtml += '<input type="hidden" name="page" value="' + currentFile + '.html">';
  shtml += '<input type="hidden" name="url" id="eqFeedbackUrl">';
  shtml += '<input type="hidden" name="timestamp" id="eqFeedbackTs">';
  shtml += '<input type="hidden" name="viewport" id="eqFeedbackViewport">';
  shtml += '<input type="hidden" name="screenshot" id="eqFeedbackScreenshotData">';
  shtml += '<div>';
  shtml += '<label for="eqFeedbackType">Feedback type</label>';
  shtml += '<select name="type" id="eqFeedbackType" required>';
  shtml += '<option value="">Select…</option>';
  shtml += '<option value="layout">Layout / structure</option>';
  shtml += '<option value="fields">Fields / data</option>';
  shtml += '<option value="component">Component pattern</option>';
  shtml += '<option value="ux">UX / interaction</option>';
  shtml += '<option value="content">Content / copy</option>';
  shtml += '<option value="accessibility">Accessibility</option>';
  shtml += '<option value="general">General</option>';
  shtml += '</select>';
  shtml += '</div>';
  shtml += '<div>';
  shtml += '<label for="eqFeedbackName">Your name</label>';
  shtml += '<input type="text" name="name" id="eqFeedbackName" placeholder="e.g. Ryder" autocomplete="name">';
  shtml += '</div>';
  shtml += '<div>';
  shtml += '<label for="eqFeedbackComment">Comments</label>';
  shtml += '<textarea name="comments" id="eqFeedbackComment" placeholder="What should change? What works well? Be specific about sections, fields, or interactions." required></textarea>';
  shtml += '</div>';
  shtml += '<div>';
  shtml += '<label for="eqFeedbackPriority">Priority</label>';
  shtml += '<select name="priority" id="eqFeedbackPriority">';
  shtml += '<option value="low">Low — nice to have</option>';
  shtml += '<option value="medium" selected>Medium — should address</option>';
  shtml += '<option value="high">High — blocking or critical</option>';
  shtml += '</select>';
  shtml += '</div>';
  shtml += '<button type="submit" class="eq-feedback-submit" id="eqFeedbackSubmit">Submit Feedback</button>';
  shtml += '</form>';
  shtml += '<div id="eqFeedbackSuccess" class="eq-feedback-success" style="display:none;">';
  shtml += '<div style="font-size:2rem;">&#10003;</div>';
  shtml += '<p><strong>Thank you!</strong></p>';
  shtml += '<p style="font-size:0.8125rem;color:#706E6B;">Your feedback has been submitted. It will be reviewed alongside the design notes for this page.</p>';
  shtml += '<button type="button" style="margin-top:0.75rem;" class="eq-feedback-submit" id="eqFeedbackReset">Submit Another</button>';
  shtml += '</div>';
  shtml += '</div>';

  sidebar.innerHTML = shtml;

  // ── Inject into page ────────────────────────────────────────
  var app = document.getElementById('app') || document.body;

  // Add skip link
  var skip = document.createElement('a');
  skip.className = 'eq-skip-link';
  skip.href = '#main-content';
  skip.textContent = 'Skip to main content';
  document.body.insertBefore(skip, document.body.firstChild);

  // Insert nav, header, tabbar before app content
  if (app === document.body) {
    document.body.insertBefore(nav, document.body.firstChild.nextSibling);
    nav.after(header);
    if (tabBar) header.after(tabBar);
  } else {
    app.parentNode.insertBefore(nav, app);
    app.parentNode.insertBefore(header, app);
    if (tabBar) app.parentNode.insertBefore(tabBar, app);
  }

  // Append sidebar + overlay to body
  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  // ── Toggle behavior (Annotations / Data Story) ─────────────
  function setupToggle(id, bodyClass) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function () {
      this.classList.toggle('is-on');
      var isOn = this.classList.contains('is-on');
      this.setAttribute('aria-checked', isOn);
      (document.getElementById('app') || document.body).classList.toggle(bodyClass, isOn);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.click(); }
    });
  }
  setupToggle('navToggleAnnotations', 'show-annotations');
  setupToggle('navToggleStory', 'show-story');

  // ── Sidebar behavior ──────────────────────────────────────
  var sidebarEl = document.getElementById('eqSidebar');
  var overlayEl = document.getElementById('eqSidebarOverlay');

  function openSidebar(tab) {
    overlayEl.classList.add('is-open');
    sidebarEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Switch to tab
    if (tab) switchSidebarTab(tab);
    // Capture metadata when opening
    captureContext();
  }

  function closeSidebar() {
    overlayEl.classList.remove('is-open');
    sidebarEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function switchSidebarTab(panel) {
    var tabs = sidebarEl.querySelectorAll('.eq-sidebar-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('is-active', tabs[i].getAttribute('data-panel') === panel);
    }
    var notesPanel = document.getElementById('eqSidebarNotes');
    var fbPanel = document.getElementById('eqSidebarFeedback');
    notesPanel.style.display = (panel === 'notes') ? '' : 'none';
    fbPanel.style.display = (panel === 'feedback') ? '' : 'none';

    var titleEl = document.getElementById('eqSidebarTitle');
    if (panel === 'notes') {
      titleEl.textContent = currentLabel + ' \u2014 Design Notes';
    } else {
      titleEl.textContent = currentLabel + ' \u2014 Feedback';
    }
  }

  function captureContext() {
    var now = new Date();
    var tsStr = now.toLocaleString();
    var tsEl = document.getElementById('eqFeedbackTimestamp');
    if (tsEl) tsEl.textContent = tsStr;
    var urlEl = document.getElementById('eqFeedbackUrl');
    if (urlEl) urlEl.value = location.href;
    var tsHid = document.getElementById('eqFeedbackTs');
    if (tsHid) tsHid.value = now.toISOString();
    var vpEl = document.getElementById('eqFeedbackViewport');
    if (vpEl) vpEl.value = window.innerWidth + 'x' + window.innerHeight;

    // Attempt screenshot capture via html2canvas if available
    captureScreenshot();
  }

  function captureScreenshot() {
    var container = document.getElementById('eqFeedbackScreenshot');
    var dataEl = document.getElementById('eqFeedbackScreenshotData');
    if (!container) return;

    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
      // Try loading it from CDN
      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = function () { doCapture(container, dataEl); };
      script.onerror = function () {
        // Fallback: no screenshot, just metadata
        container.style.display = 'none';
        if (dataEl) dataEl.value = '';
      };
      document.head.appendChild(script);
    } else {
      doCapture(container, dataEl);
    }
  }

  function doCapture(container, dataEl) {
    // Hide sidebar and overlay while capturing
    sidebarEl.style.display = 'none';
    overlayEl.style.display = 'none';

    html2canvas(document.body, {
      scale: 0.5,
      useCORS: true,
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollX: 0,
      scrollY: -window.scrollY
    }).then(function (canvas) {
      sidebarEl.style.display = '';
      overlayEl.style.display = '';

      var dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      if (dataEl) dataEl.value = dataUrl;

      container.innerHTML = '<img src="' + dataUrl + '" alt="Page screenshot at time of feedback">'
        + '<div class="eq-feedback-screenshot-label">Screenshot captured automatically</div>';
      container.style.display = '';
    }).catch(function () {
      sidebarEl.style.display = '';
      overlayEl.style.display = '';
      container.style.display = 'none';
      if (dataEl) dataEl.value = '';
    });
  }

  // Wire sidebar buttons
  document.getElementById('navBtnNotes').addEventListener('click', function () { openSidebar('notes'); });
  document.getElementById('navBtnFeedback').addEventListener('click', function () { openSidebar('feedback'); });
  document.getElementById('eqSidebarClose').addEventListener('click', closeSidebar);
  overlayEl.addEventListener('click', closeSidebar);

  // Sidebar tab switching
  var sidebarTabs = sidebarEl.querySelectorAll('.eq-sidebar-tab');
  for (var t = 0; t < sidebarTabs.length; t++) {
    sidebarTabs[t].addEventListener('click', function () {
      switchSidebarTab(this.getAttribute('data-panel'));
    });
  }

  // Escape key closes sidebar
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebarEl.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // ── Feedback form submission via Formspree ─────────────────
  var feedbackForm = document.getElementById('eqFeedbackForm');
  var feedbackSuccess = document.getElementById('eqFeedbackSuccess');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById('eqFeedbackSubmit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var formData = new FormData(feedbackForm);

      fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          feedbackForm.style.display = 'none';
          feedbackSuccess.style.display = '';
          var metaEl = document.getElementById('eqFeedbackMeta');
          if (metaEl) metaEl.style.display = 'none';
          var ssEl = document.getElementById('eqFeedbackScreenshot');
          if (ssEl) ssEl.style.display = 'none';
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Feedback';
          alert('Something went wrong. Please try again.');
        }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
        alert('Network error. Please check your connection and try again.');
      });
    });
  }

  // Reset form for another submission
  var resetBtn = document.getElementById('eqFeedbackReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      feedbackForm.reset();
      feedbackForm.style.display = '';
      feedbackSuccess.style.display = 'none';
      var metaEl = document.getElementById('eqFeedbackMeta');
      if (metaEl) metaEl.style.display = '';
      var submitBtn = document.getElementById('eqFeedbackSubmit');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
      captureContext();
    });
  }

  // ── Public API: EQ.setSidebarNotes(htmlString) ────────────
  // Pages call this in their script block to populate design notes
  window.EQ = window.EQ || {};
  window.EQ.setSidebarNotes = function (contentHtml) {
    var el = document.getElementById('eqNotesContent');
    if (el) el.innerHTML = contentHtml;
  };

})();
