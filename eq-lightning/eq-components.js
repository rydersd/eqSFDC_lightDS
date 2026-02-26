/**
 * EQ Lightning — Shared Component Factories
 *
 * Generates standardized SLDS markup for repeated page elements.
 * Each page calls these functions with page-specific config data,
 * ensuring consistent structure while allowing content variation.
 *
 * Usage:
 *   1. Add a <div id="eq-header"></div> placeholder in your HTML
 *   2. Call EQ.renderHeader({...config}) in a <script> block
 *   3. The component replaces the placeholder with standardized markup
 */
(function() {
  'use strict';
  window.EQ = window.EQ || {};

  // ====================================================================
  // HIGHLIGHTS PANEL (Page Header)
  // ====================================================================
  /**
   * Renders a standardized SLDS page-header_record-home.
   * @param {Object} cfg
   * @param {string} cfg.objectType  — SLDS standard icon key (e.g. "lead", "account")
   * @param {string} cfg.objectLabel — Human label (e.g. "Lead", "Account")
   * @param {string} cfg.title       — Record name
   * @param {Array}  cfg.actions     — [{label, variant?, icon?}]  variant: "neutral"|"brand"
   * @param {Array}  cfg.fields      — [{label, value, isLink?, href?}]
   * @param {string} [cfg.target]    — DOM id to render into (default: "eq-header")
   * @param {boolean}[cfg.showCompare] — Show Before/After toggle button
   */
  EQ.renderHeader = function(cfg) {
    var target = document.getElementById(cfg.target || 'eq-header');
    if (!target) return;

    // Build action buttons
    var actionBtns = '';
    if (cfg.actions && cfg.actions.length) {
      var items = cfg.actions.map(function(a) {
        var cls = a.variant === 'brand' ? 'slds-button_brand' : 'slds-button_neutral';
        return '<li><button class="slds-button ' + cls + '">' + esc(a.label) + '</button></li>';
      }).join('');
      actionBtns = items;
    }

    // Build highlight fields
    var fieldBlocks = '';
    if (cfg.fields && cfg.fields.length) {
      fieldBlocks = cfg.fields.map(function(f) {
        var val = f.isLink
          ? '<a href="' + esc(f.href || '#') + '">' + esc(f.value) + '</a>'
          : (f.badge ? '<span class="eq-badge eq-badge--' + esc(f.badge) + '">' + esc(f.value) + '</span>' : esc(f.value));
        return '<div class="slds-page-header__detail-block">' +
          '<p class="slds-text-title slds-truncate" title="' + esc(f.label) + '">' + esc(f.label) + '</p>' +
          '<p class="slds-text-body_regular slds-truncate">' + val + '</p>' +
          '</div>';
      }).join('');
    }

    // Compare button (optional)
    var compareBtn = '';
    if (cfg.showCompare) {
      compareBtn = '<div class="slds-page-header__control">' +
        '<div class="slds-p-right_small" style="display:inline-block;">' +
        '<button class="slds-button slds-button_neutral slds-button_icon slds-button_icon-border-filled" id="toggleComparison" aria-label="Toggle Before/After" title="Toggle Before/After" aria-checked="false">' +
        '<svg class="slds-button__icon" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#compare"></use></svg>' +
        '<span class="slds-assistive-text">Before/After</span></button></div></div>';
    }

    target.outerHTML =
      '<div class="slds-page-header slds-page-header_record-home">' +
        '<div class="slds-page-header__row">' +
          '<div class="slds-page-header__col-title">' +
            '<div class="slds-media">' +
              '<div class="slds-media__figure">' +
                '<span class="slds-icon_container slds-icon-standard-' + esc(cfg.objectType) + '" title="' + esc(cfg.objectLabel) + '">' +
                  '<svg class="slds-icon slds-page-header__icon" aria-hidden="true">' +
                    '<use href="assets/icons/standard-sprite/svg/symbols.svg#' + esc(cfg.objectType) + '"></use>' +
                  '</svg>' +
                  '<span class="slds-assistive-text">' + esc(cfg.objectLabel) + '</span>' +
                '</span>' +
              '</div>' +
              '<div class="slds-media__body">' +
                '<div class="slds-page-header__name">' +
                  '<div class="slds-page-header__name-title">' +
                    '<h1><span class="slds-page-header__title slds-truncate" title="' + esc(cfg.title) + '">' + esc(cfg.title) + '</span></h1>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="slds-page-header__col-actions">' +
            '<div class="slds-page-header__controls">' +
              compareBtn +
              '<div class="slds-page-header__control">' +
                '<ul class="slds-button-group-list">' +
                  actionBtns +
                  '<li><button class="slds-button slds-button_icon slds-button_icon-border-filled" aria-label="More Actions" title="More Actions">' +
                    '<svg class="slds-button__icon" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#down"></use></svg>' +
                    '<span class="slds-assistive-text">More Actions</span>' +
                  '</button></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="slds-page-header__row slds-page-header__row_gutters">' +
          '<div class="slds-page-header__col-details">' +
            '<div class="slds-page-header__detail-row">' +
              fieldBlocks +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  };


  // ====================================================================
  // RIGHT-COLUMN ACTIVITY TABS
  // ====================================================================
  /**
   * Renders the full Activity column as a self-contained component:
   *   • Agentforce "Best Next Step" card (above tabs)
   *   • Outer tabs: Activity | Agentforce | Community | Chatter
   *   • Inside Activity tab:
   *     – Sub-tabs: Activity | Email | New Task | New Event
   *     – "Recap your Call" input module
   *     – Filters row
   *     – Activity timeline items
   *     – Footer: Refresh · Expand All · View All
   *
   * All content is passed via cfg — nothing is hardcoded in the page HTML.
   *
   * @param {Object} [cfg]
   * @param {string}  [cfg.target]       — DOM id (default: "eq-activity-tabs")
   * @param {Object}  [cfg.agentforce]   — Best-next-step card: {title, description, btnLabel, timeSaved}
   * @param {Array}   [cfg.timeline]     — [{icon, title, href, meta, body}] activity items
   * @param {Array}   [cfg.agentforceCards] — [{title, description, btnLabel, timeSaved}] for Agentforce tab
   * @param {Array}   [cfg.chatter]      — [{author, time, body}] chatter posts
   * @param {string}  [cfg.communityHtml]— Raw HTML for Community tab
   */
  EQ.renderActivityTabs = function(cfg) {
    cfg = cfg || {};
    var target = document.getElementById(cfg.target || 'eq-activity-tabs');
    if (!target) return;

    var outerTabs = ['Activity', 'Agentforce', 'Community', 'Chatter'];
    var innerTabs = ['Activity', 'Email', 'New Task', 'New Event'];

    // — Agentforce "Best Next Step" card (above tabs) —
    var agentHtml = '';
    if (cfg.agentforce) {
      var af = cfg.agentforce;
      agentHtml = '<div class="eq-agentforce-step">' +
        '<div class="eq-agentforce-step-hdr">' +
          '<span class="eq-agentforce-step-icon" aria-hidden="true">&#x2728;</span>' +
          '<span class="eq-agentforce-step-label">Agentforce</span>' +
        '</div>' +
        '<div class="eq-agentforce-step-title">' + esc(af.title) + '</div>' +
        '<div class="eq-agentforce-step-desc">' + esc(af.description) + '</div>' +
        '<button class="eq-agentforce-btn">' + esc(af.btnLabel || 'View Recommendation') + '</button>' +
        (af.timeSaved ? '<div class="eq-agentforce-time">' + esc(af.timeSaved) + '</div>' : '') +
      '</div>';
    }

    // — Outer tab nav —
    var outerNav = outerTabs.map(function(label, i) {
      var id = 'eq-act-outer-' + label.toLowerCase().replace(/\s+/g, '-');
      var active = i === 0;
      return '<li class="slds-tabs_default__item' + (active ? ' slds-is-active' : '') + '" role="presentation">' +
        '<a class="slds-tabs_default__link" role="tab" tabindex="' + (active ? '0' : '-1') + '" ' +
        'aria-selected="' + active + '" data-eq-tab="' + id + '">' + esc(label) + '</a></li>';
    }).join('');

    // — Inner sub-tabs (inside Activity panel) —
    var innerNav = innerTabs.map(function(label, i) {
      var active = i === 0;
      return '<li class="eq-subtab-item' + (active ? ' is-active' : '') + '">' +
        '<button class="eq-subtab-btn"' +
        (active ? ' aria-current="true"' : '') + '>' + esc(label) + '</button></li>';
    }).join('');

    // — Input module: "Recap your Call" —
    var inputModule = '<div class="eq-activity-input">' +
      '<label class="eq-activity-input-label">Recap your Call</label>' +
      '<div class="eq-activity-input-row">' +
        '<input type="text" class="eq-activity-input-field slds-input" placeholder="" aria-label="Call recap" />' +
        '<button class="slds-button slds-button_brand eq-activity-input-add">Add</button>' +
      '</div>' +
    '</div>';

    // — Filters row —
    var filtersRow = '<div class="eq-activity-filter-row">' +
      '<span class="eq-activity-filter-text">Filters: <a href="#">All time</a> &middot; <a href="#">All Activities</a> &middot; <a href="#">All Types</a></span>' +
      '<button class="eq-activity-filter-icon" aria-label="Filter options" title="Filter options">' +
        '<span class="eq-filter-funnel" aria-hidden="true">&#x25BC;</span>' +
      '</button>' +
    '</div>';

    // — Build timeline from data —
    var timelineHtml = '';
    if (cfg.timeline && cfg.timeline.length) {
      var items = cfg.timeline.map(function(t) {
        var iconSlug = t.icon || 'log_a_call';
        return '<li class="slds-timeline__item">' +
          '<div class="slds-timeline__marker">' +
            '<span class="eq-timeline-icon eq-timeline-icon--' + esc(iconSlug) + '" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="slds-timeline__details">' +
            '<h3 class="slds-timeline__title">' +
              (t.href ? '<a href="' + esc(t.href) + '">' : '') +
              esc(t.title) +
              (t.href ? '</a>' : '') +
            '</h3>' +
            '<p class="slds-timeline__meta">' + esc(t.meta) + '</p>' +
            '<p class="slds-timeline__body">' + esc(t.body) + '</p>' +
          '</div>' +
        '</li>';
      }).join('');
      timelineHtml = '<ul class="slds-timeline">' + items + '</ul>';
    }

    // — Footer —
    var footer = '<div class="eq-activity-footer">' +
      '<a href="#">Refresh</a> &middot; <a href="#">Expand All</a> &middot; <a href="#">View All</a>' +
    '</div>';

    // — Activity panel (first outer tab) —
    var activityPanel = '<div id="eq-act-outer-activity" class="eq-act-outer-panel is-active">' +
      '<ul class="eq-subtab-nav">' + innerNav + '</ul>' +
      inputModule +
      filtersRow +
      '<div class="eq-activity-timeline-wrap">' + timelineHtml + '</div>' +
      footer +
    '</div>';

    // — Agentforce panel (second outer tab) —
    var agentforceTabHtml = '';
    if (cfg.agentforceCards && cfg.agentforceCards.length) {
      agentforceTabHtml = cfg.agentforceCards.map(function(card) {
        return '<div class="eq-agentforce">' +
          '<div class="eq-agentforce-hdr">' + esc(card.title) + '</div>' +
          '<div class="eq-agentforce-desc">' + esc(card.description) + '</div>' +
          '<button class="eq-agentforce-btn">' + esc(card.btnLabel || 'Generate') + '</button>' +
          (card.timeSaved ? '<div class="eq-agentforce-time">' + esc(card.timeSaved) + '</div>' : '') +
        '</div>';
      }).join('');
    }
    var agentforcePanel = '<div id="eq-act-outer-agentforce" class="eq-act-outer-panel">' +
      '<div style="padding:0.75rem;">' +
      (agentforceTabHtml || '<div class="eq-act-empty">No Agentforce actions available.</div>') +
      '</div></div>';

    // — Community panel —
    var communityPanel = '<div id="eq-act-outer-community" class="eq-act-outer-panel">' +
      (cfg.communityHtml || '<div class="eq-act-empty">No community activity.</div>') +
    '</div>';

    // — Chatter panel —
    var chatterHtml = '';
    if (cfg.chatter && cfg.chatter.length) {
      var posts = cfg.chatter.map(function(p) {
        return '<div class="eq-chatter-post">' +
          '<div class="eq-chatter-post-hdr"><strong>' + esc(p.author) + '</strong> &mdash; ' + esc(p.time) + '</div>' +
          '<div class="eq-chatter-post-body">' + esc(p.body) + '</div>' +
        '</div>';
      }).join('');
      chatterHtml = '<div style="padding:0.75rem;">' +
        '<p style="color:#706E6B; font-size:0.8125rem; margin-bottom:0.75rem;">Team discussion about this opportunity.</p>' +
        '<div class="eq-chatter-feed">' + posts + '</div></div>';
    }
    var chatterPanel = '<div id="eq-act-outer-chatter" class="eq-act-outer-panel">' +
      (chatterHtml || '<div class="eq-act-empty">No Chatter posts.</div>') +
    '</div>';

    // — Assemble —
    target.innerHTML = agentHtml +
      '<div class="slds-tabs_default eq-activity-tabs-wrap">' +
        '<ul class="slds-tabs_default__nav" role="tablist">' + outerNav + '</ul>' +
        activityPanel + agentforcePanel + communityPanel + chatterPanel +
      '</div>';

    // — Wire outer tab switching —
    var outerLinks = target.querySelectorAll('[data-eq-tab]');
    var outerPanels = target.querySelectorAll('.eq-act-outer-panel');
    Array.prototype.forEach.call(outerLinks, function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var tabId = this.getAttribute('data-eq-tab');
        Array.prototype.forEach.call(outerLinks, function(l) {
          l.parentElement.classList.remove('slds-is-active');
          l.setAttribute('aria-selected', 'false');
          l.setAttribute('tabindex', '-1');
        });
        this.parentElement.classList.add('slds-is-active');
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');
        Array.prototype.forEach.call(outerPanels, function(p) {
          p.classList.toggle('is-active', p.id === tabId);
        });
      });
    });

    // — Wire inner sub-tab switching —
    var subBtns = target.querySelectorAll('.eq-subtab-btn');
    Array.prototype.forEach.call(subBtns, function(btn) {
      btn.addEventListener('click', function() {
        Array.prototype.forEach.call(subBtns, function(b) {
          b.parentElement.classList.remove('is-active');
          b.removeAttribute('aria-current');
        });
        this.parentElement.classList.add('is-active');
        this.setAttribute('aria-current', 'true');
      });
    });
  };


  // ====================================================================
  // RELATED LIST CARD
  // ====================================================================
  /**
   * Generates HTML for a standard related-list card.
   * @param {Object} cfg
   * @param {string} cfg.icon        — SLDS standard icon key
   * @param {string} cfg.title       — e.g. "Contacts (4)"
   * @param {boolean}[cfg.showNew]   — Show "New" button (default: true)
   * @param {Array}  cfg.items       — [{title, href?, fields: [{label, value, badge?}]}]
   * @param {boolean}[cfg.showViewAll] — Show "View All" link (default: true)
   * @returns {string} HTML string
   */
  EQ.relatedCard = function(cfg) {
    var showNew = cfg.showNew !== false;
    var showViewAll = cfg.showViewAll !== false;

    var itemsHtml = '';
    if (cfg.items && cfg.items.length) {
      itemsHtml = cfg.items.map(function(item) {
        var titleTag = item.href
          ? '<a href="' + esc(item.href) + '">' + esc(item.title) + '</a>'
          : esc(item.title);
        var fieldsHtml = '';
        if (item.fields && item.fields.length) {
          fieldsHtml = item.fields.map(function(f) {
            var val = f.badge
              ? '<span class="eq-badge eq-badge--' + esc(f.badge) + '">' + esc(f.value) + '</span>'
              : '<strong>' + esc(f.value) + '</strong>';
            return '<span class="eq-related-item-field">' + esc(f.label) + ': ' + val + '</span>';
          }).join('');
        }
        return '<div class="eq-related-item">' +
          '<div class="eq-related-item-title">' + titleTag + '</div>' +
          (fieldsHtml ? '<div class="eq-related-item-fields">' + fieldsHtml + '</div>' : '') +
          '</div>';
      }).join('');
    }

    return '<div class="slds-card">' +
      '<div class="slds-card__header slds-grid">' +
        '<header class="slds-media slds-media_center slds-has-flexi-truncate">' +
          '<div class="slds-media__figure">' +
            '<span class="slds-icon_container slds-icon-standard-' + esc(cfg.icon) + '">' +
              '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
                '<use href="assets/icons/standard-sprite/svg/symbols.svg#' + esc(cfg.icon) + '"></use>' +
              '</svg>' +
            '</span>' +
          '</div>' +
          '<div class="slds-media__body">' +
            '<h2 class="slds-card__header-title"><span>' + esc(cfg.title) + '</span></h2>' +
          '</div>' +
        '</header>' +
        (showNew ? '<div class="slds-no-flex"><button class="slds-button slds-button_neutral" style="font-size:0.6875rem;">New</button></div>' : '') +
      '</div>' +
      '<div class="slds-card__body">' +
        itemsHtml +
        (showViewAll ? '<a href="#" class="eq-related-view-all">View All</a>' : '') +
      '</div>' +
    '</div>';
  };


  // ====================================================================
  // ACTIVITY FILTER BAR
  // ====================================================================
  /**
   * Returns HTML for the activity filter toolbar.
   * @returns {string} HTML string
   */
  EQ.activityFilters = function() {
    return '<div class="eq-activity-filters" role="toolbar" aria-label="Filter activities">' +
      '<button class="eq-activity-filter is-active" data-filter="all">All</button>' +
      '<button class="eq-activity-filter" data-filter="calls">Calls</button>' +
      '<button class="eq-activity-filter" data-filter="emails">Emails</button>' +
      '<button class="eq-activity-filter" data-filter="tasks">Tasks</button>' +
      '<button class="eq-activity-filter" data-filter="events">Events</button>' +
    '</div>';
  };


  // ====================================================================
  // ACTIVITY TIMELINE CARD HEADER
  // ====================================================================
  /**
   * Returns HTML for the Activity Timeline card header with action buttons.
   * @returns {string} HTML string
   */
  EQ.activityTimelineHeader = function() {
    return '<div class="slds-card__header slds-grid">' +
      '<header class="slds-media slds-media_center slds-has-flexi-truncate">' +
        '<div class="slds-media__figure">' +
          '<span class="slds-icon_container slds-icon-standard-log-a-call" title="Activity">' +
            '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
              '<use href="assets/icons/standard-sprite/svg/symbols.svg#log_a_call"></use>' +
            '</svg>' +
          '</span>' +
        '</div>' +
        '<div class="slds-media__body">' +
          '<h2 class="slds-card__header-title"><span>Activity Timeline</span></h2>' +
        '</div>' +
      '</header>' +
      '<div style="margin-left:auto;">' +
        '<button class="slds-button slds-button_neutral" style="font-size:0.75rem;">Log a Call</button>' +
        '<button class="slds-button slds-button_neutral" style="font-size:0.75rem;">New Task</button>' +
        '<button class="slds-button slds-button_neutral" style="font-size:0.75rem;">New Event</button>' +
      '</div>' +
    '</div>';
  };


  // ====================================================================
  // SALES PATH — Guided Stage-Gate Component (Oppo-27)
  // ====================================================================
  /**
   * Renders a full sales path with expandable stage-gate panels.
   * Reusable across any object that has a staged workflow.
   *
   * Exit criteria display ACTUAL FIELD VALUES (not just checkboxes) so
   * reps can see real data without scrolling the full record detail.
   *
   * @param {Object} cfg
   * @param {string} [cfg.target]       — DOM id (default: "eq-path")
   * @param {string} [cfg.advanceLabel] — Button text (default: "Mark as Current Stage")
   * @param {boolean}[cfg.autoExpand]   — Open current stage on load (default: true)
   * @param {Array}  cfg.stages         — Array of stage objects:
   *   {
   *     id:       string,
   *     label:    string,
   *     status:   'complete'|'current'|'incomplete',
   *     exitCriteria: [{
   *       label: string,           — field label (e.g. "Budget Confirmed")
   *       value: string,           — field value (e.g. "Yes" or "$580,000")
   *       done:  boolean,          — whether this criterion is met
   *       badge?: string           — optional badge style (success, warning, info, error)
   *     }],
   *     guidance:     [string],
   *     advanceBtn?:  {label: string, disabled: boolean, icon?: string}
   *   }
   */
  EQ.renderPath = function(cfg) {
    var target = document.getElementById(cfg.target || 'eq-path');
    if (!target) return;

    var advLabel = cfg.advanceLabel || 'Mark as Current Stage';
    var autoExpand = cfg.autoExpand !== false;

    // — Build path nav tabs —
    var navItems = cfg.stages.map(function(s) {
      var cls = 'slds-path__item';
      if (s.status === 'complete') cls += ' slds-is-complete';
      else if (s.status === 'current') cls += ' slds-is-current';
      else cls += ' slds-is-incomplete';
      return '<li class="' + cls + '" role="presentation" data-path-detail="path-detail-' + esc(s.id) + '">' +
        '<a class="slds-path__link" role="tab" tabindex="-1" href="#"><span class="slds-path__title">' + esc(s.label) + '</span></a></li>';
    }).join('');

    var pathNav = '<div class="slds-path"><div class="slds-grid slds-path__track">' +
      '<div class="slds-grid slds-path__scroller-container"><div class="slds-path__scroller" role="application">' +
      '<ul class="slds-path__nav" role="tablist">' + navItems + '</ul></div></div>' +
      '<div class="slds-grid slds-path__action"><button class="slds-button slds-button_brand slds-path__mark-complete">' +
      esc(advLabel) + '</button></div></div></div>';

    // — Build detail panels with field-based exit criteria —
    var panels = cfg.stages.map(function(s) {
      var total = s.exitCriteria ? s.exitCriteria.length : 0;
      var done = 0;
      if (s.exitCriteria) s.exitCriteria.forEach(function(c) { if (c.done) done++; });
      var pct = total ? Math.round((done / total) * 100) : 0;
      var barColor = pct === 100 ? '#2E844A' : (pct > 0 ? '#0070D2' : '#E5E5E5');

      var criteriaTitle = s.status === 'incomplete' ? 'Conversion Checklist' : 'Exit Criteria';

      // Exit criteria as FIELD ROWS: status circle + field label + field value
      var criteriaHtml = '';
      if (s.exitCriteria && s.exitCriteria.length) {
        criteriaHtml = s.exitCriteria.map(function(c) {
          var rowCls = 'eq-exit-row' + (c.done ? ' is-done' : '');
          // CSS-only status indicator (no SVG dependency)
          var statusEl = c.done
            ? '<span class="eq-exit-status eq-exit-status--done" aria-label="Complete"></span>'
            : '<span class="eq-exit-status eq-exit-status--open" aria-label="Incomplete"></span>';
          var valHtml = c.badge
            ? '<span class="eq-badge eq-badge--' + esc(c.badge) + '">' + esc(c.value) + '</span>'
            : '<span class="eq-exit-value">' + esc(c.value) + '</span>';
          return '<div class="' + rowCls + '">' +
            statusEl +
            '<div class="eq-exit-field">' +
              '<span class="eq-exit-label">' + esc(c.label) + '</span>' +
              valHtml +
            '</div>' +
          '</div>';
        }).join('');
      }

      // Guidance list
      var guidanceHtml = '';
      if (s.guidance && s.guidance.length) {
        guidanceHtml = s.guidance.map(function(g) {
          return '<li>' + esc(g) + '</li>';
        }).join('');
      }

      // Advance button (optional)
      var advBtnHtml = '';
      if (s.advanceBtn) {
        var remaining = total - done;
        var noteText = remaining > 0
          ? remaining + ' criteria remaining before this stage can close'
          : 'All criteria met \u2014 ready to advance';
        var btnCls = s.advanceBtn.disabled ? 'slds-button slds-button_neutral' : 'slds-button slds-button_brand';
        advBtnHtml = '<div class="eq-path-advance-btn">' +
          '<span class="eq-advance-note">' + esc(noteText) + '</span>' +
          '<button class="' + btnCls + '"' + (s.advanceBtn.disabled ? ' disabled' : '') + '>' +
          esc(s.advanceBtn.label) + '</button></div>';
      }

      return '<div id="path-detail-' + esc(s.id) + '" class="eq-path-detail" data-stage="' + esc(s.label) + '">' +
        '<div class="eq-path-stage-header">' +
          '<span class="eq-path-stage-name">Stage: <strong>' + esc(s.label) + '</strong></span>' +
          '<div class="eq-path-stage-progress">' +
            '<span class="eq-progress-label">' + done + '/' + total + '</span>' +
            '<div class="eq-path-progress-bar"><div class="eq-path-progress-fill" style="width:' + pct + '%; background:' + barColor + ';"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="eq-path-detail-body">' +
          '<div class="eq-path-criteria-col"><h3 class="eq-path-detail-title">' + esc(criteriaTitle) + '</h3>' + criteriaHtml + '</div>' +
          '<div class="eq-path-guidance-col"><h3 class="eq-path-detail-title">Guidance</h3><ul class="eq-path-detail-list">' + guidanceHtml + '</ul></div>' +
        '</div>' +
        advBtnHtml +
      '</div>';
    }).join('');

    // — Expand/collapse toggle: text-based, no SVG dependency —
    var toggleBtn = '<button class="eq-path-toggle" aria-expanded="true" aria-controls="eq-path-content">' +
      '\u2630 Sales Path' +
      '<span class="eq-path-toggle-chevron">\u25BC</span></button>';

    target.innerHTML = toggleBtn +
      '<div id="eq-path-content" class="eq-path-wrapper">' + pathNav + panels + '</div>';

    // — Wire expand/collapse toggle (display:none toggle, not max-height) —
    var toggle = target.querySelector('.eq-path-toggle');
    var wrapper = target.querySelector('.eq-path-wrapper');
    if (toggle && wrapper) {
      toggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        wrapper.classList.toggle('is-collapsed');
      });
    }

    // — Auto-expand current stage detail panel —
    if (autoExpand) {
      setTimeout(function() {
        var currentItem = target.querySelector('.slds-is-current[data-path-detail]');
        if (currentItem) {
          var panelId = currentItem.getAttribute('data-path-detail');
          var panel = document.getElementById(panelId);
          if (panel) {
            panel.classList.add('is-visible');
            currentItem.classList.add('eq-path-expanded');
          }
        }
      }, 300);
    }
  };


  // ====================================================================
  // NEW OPPORTUNITY MODAL (Oppo-464)
  // ====================================================================
  /**
   * Renders and opens a "New Opportunity" creation modal.
   * Designed to be triggered from the Account page's Opportunities related list.
   *
   * @param {Object} [cfg]
   * @param {string} [cfg.accountName] — Pre-fill account name
   * @param {string} [cfg.accountId]   — Link back to account
   */
  EQ.newOpportunityModal = function(cfg) {
    cfg = cfg || {};

    // Remove existing modal if any
    var existing = document.getElementById('eq-new-oppo-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'eq-new-oppo-modal';
    overlay.className = 'eq-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'New Opportunity');

    overlay.innerHTML =
      '<div class="eq-modal">' +
        '<div class="eq-modal-header">' +
          '<h2>New Opportunity</h2>' +
          '<button class="eq-modal-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="eq-modal-body">' +
          '<form id="eq-new-oppo-form" novalidate>' +
            '<div class="eq-modal-section-title">Opportunity Information</div>' +
            '<div class="eq-modal-grid">' +
              _field('Opportunity Name', 'oppo-name', 'text', '', true) +
              _field('Account Name', 'oppo-account', 'text', esc(cfg.accountName || ''), false, true) +
              _field('Lead Source', 'oppo-lead-source', 'select', '', true, false,
                ['-- Select --','Web','Partner Referral','Phone Inquiry','Purchased List','Event','Trade Show','Employee Referral','Other']) +
              _field('Transaction Type', 'oppo-txn-type', 'select', '', true, false,
                ['-- Select --','New Business','Expansion','Renewal','Add-On','Migration']) +
              _field('IBX Country', 'oppo-ibx-country', 'select', '', true, false,
                ['-- Select --','United States','United Kingdom','Germany','Netherlands','Japan','Singapore','Australia','Brazil','Hong Kong','France']) +
              _field('Close Date', 'oppo-close-date', 'date', '', true) +
            '</div>' +
            '<div class="eq-modal-section-title">Stage &amp; Forecast</div>' +
            '<div class="eq-modal-grid">' +
              _field('Stage', 'oppo-stage', 'text', '1 Qualify Opportunity', false, true) +
              _field('Probability (%)', 'oppo-probability', 'number', '20', false, true) +
              _field('Forecast Category', 'oppo-forecast', 'text', 'Omitted', false, true) +
              _field('Opportunity Currency', 'oppo-currency', 'text', 'USD \u2013 U.S. Dollar', false, true) +
              _field('Opportunity Type', 'oppo-type', 'text', 'New Business', false, true) +
            '</div>' +
            '<div class="eq-modal-section-title">Description</div>' +
            '<div class="eq-modal-full">' +
              '<textarea id="oppo-description" class="eq-modal-input" rows="3" placeholder="Optional description..."></textarea>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="eq-modal-footer">' +
          '<button class="slds-button slds-button_neutral eq-modal-cancel">Cancel</button>' +
          '<button class="slds-button slds-button_brand eq-modal-save">Save</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Show with animation
    requestAnimationFrame(function() { overlay.classList.add('is-open'); });

    // — Wire close —
    function closeModal() {
      overlay.classList.remove('is-open');
      setTimeout(function() { overlay.remove(); }, 250);
    }
    overlay.querySelector('.eq-modal-close').addEventListener('click', closeModal);
    overlay.querySelector('.eq-modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    // — Wire save with validation —
    overlay.querySelector('.eq-modal-save').addEventListener('click', function() {
      var form = document.getElementById('eq-new-oppo-form');
      var valid = true;

      // Clear previous errors
      form.querySelectorAll('.eq-field-error').forEach(function(el) { el.remove(); });
      form.querySelectorAll('.eq-modal-input.is-error').forEach(function(el) { el.classList.remove('is-error'); });

      // Validate required fields
      var required = [
        {id:'oppo-name', label:'Opportunity Name'},
        {id:'oppo-lead-source', label:'Lead Source'},
        {id:'oppo-txn-type', label:'Transaction Type'},
        {id:'oppo-ibx-country', label:'IBX Country'},
        {id:'oppo-close-date', label:'Close Date'}
      ];
      required.forEach(function(r) {
        var el = document.getElementById(r.id);
        if (!el) return;
        var val = el.value.trim();
        if (!val || val === '-- Select --') {
          el.classList.add('is-error');
          var err = document.createElement('span');
          err.className = 'eq-field-error';
          err.textContent = r.label + ' is required';
          el.parentNode.appendChild(err);
          valid = false;
        }
      });

      // Validate close date is future
      var dateEl = document.getElementById('oppo-close-date');
      if (dateEl && dateEl.value) {
        var d = new Date(dateEl.value);
        if (d <= new Date()) {
          dateEl.classList.add('is-error');
          var err = document.createElement('span');
          err.className = 'eq-field-error';
          err.textContent = 'Close Date must be a future date';
          dateEl.parentNode.appendChild(err);
          valid = false;
        }
      }

      if (!valid) return;

      // Simulate success
      closeModal();
      if (typeof EQ.showToast === 'function') {
        EQ.showToast('Opportunity "' + document.getElementById('oppo-name').value + '" was created.', 'success');
      } else {
        // Inline toast fallback
        var toast = document.createElement('div');
        toast.className = 'eq-toast eq-toast--success';
        toast.innerHTML = '<span>Opportunity "' + esc(document.getElementById('oppo-name').value) + '" was created.</span>';
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.classList.add('is-visible'); });
        setTimeout(function() { toast.classList.remove('is-visible'); setTimeout(function() { toast.remove(); }, 300); }, 4000);
      }
    });
  };

  // — Modal field helper —
  function _field(label, id, type, defaultVal, required, readonly, options) {
    var reqMark = required ? '<abbr class="slds-required" title="required">*</abbr> ' : '';
    var inputHtml = '';

    if (type === 'select' && options) {
      var opts = options.map(function(o) {
        return '<option' + (o === defaultVal ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('');
      inputHtml = '<select id="' + id + '" class="eq-modal-input"' + (readonly ? ' disabled' : '') + '>' + opts + '</select>';
    } else if (type === 'date') {
      inputHtml = '<input id="' + id + '" type="date" class="eq-modal-input" value="' + esc(defaultVal) + '"' + (readonly ? ' readonly' : '') + '>';
    } else if (type === 'number') {
      inputHtml = '<input id="' + id + '" type="number" class="eq-modal-input" value="' + esc(defaultVal) + '" min="0" max="100"' + (readonly ? ' readonly' : '') + '>';
    } else {
      inputHtml = '<input id="' + id + '" type="text" class="eq-modal-input" value="' + esc(defaultVal) + '"' + (readonly ? ' readonly' : '') + '>';
    }

    return '<div class="eq-modal-field">' +
      '<label for="' + id + '" class="eq-modal-label">' + reqMark + esc(label) + '</label>' +
      inputHtml +
    '</div>';
  }


  // ====================================================================
  // TOAST NOTIFICATION
  // ====================================================================
  EQ.showToast = function(message, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'eq-toast eq-toast--' + type;
    toast.innerHTML = '<span>' + esc(message) + '</span>' +
      '<button class="eq-toast-close" aria-label="Close">&times;</button>';
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('is-visible'); });
    toast.querySelector('.eq-toast-close').addEventListener('click', function() {
      toast.classList.remove('is-visible');
      setTimeout(function() { toast.remove(); }, 300);
    });
    setTimeout(function() {
      toast.classList.remove('is-visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 5000);
  };


  // ====================================================================
  // CONSOLE WORKSPACE TABS
  // ====================================================================
  /**
   * Renders a Salesforce Console-style workspace tab bar with:
   * - Primary workspace tab (the current record)
   * - Subtabs for related records opened from this context
   * - Internal record tabs grouped logically (replacing flat 11-tab pattern)
   *
   * @param {Object} cfg
   * @param {string} cfg.target          — DOM id to render into
   * @param {Object} cfg.primary         — { label, icon?, color?, href? } primary workspace tab
   * @param {Array}  [cfg.subtabs]       — [{ id, label, icon?, color?, href?, closeable? }]
   * @param {Array}  cfg.recordTabs      — [{ id, label, active?, panels? }]
   *    Each recordTab can have sub-panels for grouped content.
   * @param {Object} [cfg.alert]         — { type:'warning'|'info'|'error', message, actionLabel?, actionHref? }
   */
  EQ.renderConsoleTabs = function(cfg) {
    var el = document.getElementById(cfg.target || 'eq-console-tabs');
    if (!el) return;

    var h = '';

    // ── Workspace tab bar (console chrome) ──────────────────
    h += '<div class="eq-workspace-bar" role="tablist" aria-label="Workspace tabs">';

    // Primary tab (always present, always active initially)
    var prim = cfg.primary || { label: 'Record' };
    h += '<div class="eq-workspace-tab is-primary is-active" data-ws="primary" role="tab" aria-selected="true">';
    if (prim.color) {
      h += '<span class="eq-ws-tab-icon" style="background:' + prim.color + ';">';
      if (prim.icon) {
        h += '<svg class="slds-icon" style="fill:#fff;width:14px;height:14px;" aria-hidden="true"><use href="assets/icons/standard-sprite/svg/symbols.svg#' + prim.icon + '"></use></svg>';
      }
      h += '</span>';
    }
    h += '<span class="eq-ws-tab-label">' + esc(prim.label) + '</span>';
    h += '</div>';

    // Subtabs (related records opened in context)
    var subtabs = cfg.subtabs || [];
    for (var s = 0; s < subtabs.length; s++) {
      var st = subtabs[s];
      h += '<div class="eq-workspace-tab eq-workspace-subtab" data-ws="subtab-' + s + '" data-href="' + (st.href || '#') + '" role="tab" aria-selected="false">';
      if (st.color) {
        h += '<span class="eq-ws-tab-icon" style="background:' + st.color + ';">';
        if (st.icon) {
          h += '<svg class="slds-icon" style="fill:#fff;width:12px;height:12px;" aria-hidden="true"><use href="assets/icons/standard-sprite/svg/symbols.svg#' + st.icon + '"></use></svg>';
        }
        h += '</span>';
      }
      h += '<span class="eq-ws-tab-label">' + esc(st.label) + '</span>';
      if (st.closeable !== false) {
        h += '<button class="eq-ws-tab-close" aria-label="Close ' + esc(st.label) + '" data-close="subtab-' + s + '">&times;</button>';
      }
      h += '</div>';
    }

    // "+" button to open more related records
    h += '<button class="eq-workspace-add" aria-label="Open related record" title="Open a related record as a subtab">+</button>';
    h += '</div>';

    // ── Alert bar (if present) ──────────────────────────────
    if (cfg.alert) {
      var alertClass = 'eq-console-alert--' + (cfg.alert.type || 'info');
      h += '<div class="eq-console-alert ' + alertClass + '" role="alert">';
      h += '<span class="eq-console-alert-icon">';
      if (cfg.alert.type === 'warning') h += '&#9888;';
      else if (cfg.alert.type === 'error') h += '&#10006;';
      else h += '&#8505;';
      h += '</span>';
      h += '<span class="eq-console-alert-msg">' + cfg.alert.message + '</span>';
      if (cfg.alert.actionLabel) {
        h += ' <a href="' + (cfg.alert.actionHref || '#') + '" class="eq-console-alert-action">' + cfg.alert.actionLabel + '</a>';
      }
      h += '</div>';
    }

    // ── Record tabs (the 5 grouped tabs) ────────────────────
    var tabs = cfg.recordTabs || [];
    h += '<div class="eq-record-tabs" role="tablist" aria-label="Record detail tabs">';
    for (var t = 0; t < tabs.length; t++) {
      var tab = tabs[t];
      var active = tab.active ? ' is-active' : '';
      var selected = tab.active ? 'true' : 'false';
      h += '<button class="eq-record-tab' + active + '" data-tab="' + tab.id + '" role="tab" aria-selected="' + selected + '">' + esc(tab.label) + '</button>';
    }
    h += '</div>';

    // ── Tab panels ──────────────────────────────────────────
    for (var p = 0; p < tabs.length; p++) {
      var panel = tabs[p];
      var show = panel.active ? '' : ' style="display:none;"';
      h += '<div class="eq-record-panel" id="eqPanel_' + panel.id + '" role="tabpanel"' + show + '>';
      h += (panel.content || '<p style="padding:1rem;color:#706E6B;">Panel content for ' + esc(panel.label) + '</p>');
      h += '</div>';
    }

    el.innerHTML = h;

    // ── Wire tab switching ──────────────────────────────────
    var recordTabBtns = el.querySelectorAll('.eq-record-tab');
    for (var i = 0; i < recordTabBtns.length; i++) {
      recordTabBtns[i].addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab');
        // Deactivate all
        var allBtns = el.querySelectorAll('.eq-record-tab');
        var allPanels = el.querySelectorAll('.eq-record-panel');
        for (var j = 0; j < allBtns.length; j++) {
          allBtns[j].classList.remove('is-active');
          allBtns[j].setAttribute('aria-selected', 'false');
        }
        for (var k = 0; k < allPanels.length; k++) {
          allPanels[k].style.display = 'none';
        }
        // Activate clicked
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        var targetPanel = document.getElementById('eqPanel_' + tabId);
        if (targetPanel) targetPanel.style.display = '';
      });
    }

    // ── Wire subtab clicks (navigate to related record) ─────
    var wsTabs = el.querySelectorAll('.eq-workspace-subtab');
    for (var w = 0; w < wsTabs.length; w++) {
      wsTabs[w].addEventListener('click', function(e) {
        if (e.target.classList.contains('eq-ws-tab-close')) return;
        var href = this.getAttribute('data-href');
        if (href && href !== '#') window.location.href = href;
      });
    }

    // ── Wire subtab close buttons ───────────────────────────
    var closeBtns = el.querySelectorAll('.eq-ws-tab-close');
    for (var c = 0; c < closeBtns.length; c++) {
      closeBtns[c].addEventListener('click', function(e) {
        e.stopPropagation();
        var tab = this.closest('.eq-workspace-subtab');
        if (tab) tab.remove();
      });
    }
  };

  // ====================================================================
  // UTILITY
  // ====================================================================
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
