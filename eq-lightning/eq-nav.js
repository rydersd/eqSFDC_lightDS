/* ═══════════════════════════════════════════════════════════════
   eq-nav.js — EQ Lightning Navigation Component
   Injects project navigation bar and Lightning header on every page.
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
      { file: 'order',       label: 'Order',       icon: 'orders', color: '#6BBECD' },
      { file: 'case',        label: 'Case',        icon: 'case', color: '#F2836B' }
    ]
  };

  // ── Detect current page ─────────────────────────────────────
  var path = location.pathname;
  var currentFile = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';

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
  hhtml += '<button aria-label="Notifications" title="Notifications">🔔</button>';
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

  // ── Toggle behavior ─────────────────────────────────────────
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

})();
