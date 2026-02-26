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
  // RIGHT-COLUMN ACTIVITY TABS (shell only — content stays in page HTML)
  // ====================================================================
  /**
   * Renders the tab navigation for Activity | Chatter | Agentforce.
   * Wraps existing content containers that must already be in the DOM:
   *   <div id="tab-activity">...</div>
   *   <div id="tab-chatter">...</div>
   *   <div id="tab-agentforce">...</div>
   *
   * @param {Object} [cfg]
   * @param {string} [cfg.target] — DOM id (default: "eq-activity-tabs")
   */
  EQ.renderActivityTabs = function(cfg) {
    cfg = cfg || {};
    var target = document.getElementById(cfg.target || 'eq-activity-tabs');
    if (!target) return;

    // Create the tab nav
    var nav = document.createElement('ul');
    nav.className = 'slds-tabs_default__nav';
    nav.setAttribute('role', 'tablist');
    nav.innerHTML =
      '<li class="slds-tabs_default__item slds-is-active" role="presentation">' +
        '<a class="slds-tabs_default__link" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-activity" id="tab-activity__item">Activity</a>' +
      '</li>' +
      '<li class="slds-tabs_default__item" role="presentation">' +
        '<a class="slds-tabs_default__link" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-chatter" id="tab-chatter__item">Chatter</a>' +
      '</li>' +
      '<li class="slds-tabs_default__item" role="presentation">' +
        '<a class="slds-tabs_default__link" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-agentforce" id="tab-agentforce__item">Agentforce</a>' +
      '</li>';

    // Insert nav at the top of the container
    target.classList.add('slds-tabs_default');
    target.insertBefore(nav, target.firstChild);
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
   * @param {Object} cfg
   * @param {string} [cfg.target]       — DOM id (default: "eq-path")
   * @param {string} [cfg.advanceLabel] — Button text (default: "Mark as Current Stage")
   * @param {boolean}[cfg.autoExpand]   — Open current stage on load (default: true)
   * @param {Array}  cfg.stages         — Array of stage objects:
   *   {
   *     id:       string,          — unique id (used for panel id: "path-detail-{id}")
   *     label:    string,          — display name
   *     status:   'complete'|'current'|'incomplete',
   *     exitCriteria: [{text: string, done: boolean}],
   *     keyFields:    [{label: string, value: string, badge?: string}],
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
      '<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#check"></use></svg>' +
      esc(advLabel) + '</button></div></div></div>';

    // — Build detail panels —
    var panels = cfg.stages.map(function(s) {
      // Progress calc
      var total = s.exitCriteria ? s.exitCriteria.length : 0;
      var done = 0;
      if (s.exitCriteria) s.exitCriteria.forEach(function(c) { if (c.done) done++; });
      var pct = total ? Math.round((done / total) * 100) : 0;
      var barColor = pct === 100 ? '#2E844A' : (pct > 0 ? '#F28B00' : '#E5E5E5');

      // Exit criteria list
      var criteriaTitle = s.status === 'incomplete' ? 'Conversion Checklist' : 'Exit Criteria';
      var criteriaHtml = '';
      if (s.exitCriteria && s.exitCriteria.length) {
        criteriaHtml = s.exitCriteria.map(function(c) {
          var liCls = c.done ? ' class="is-done"' : '';
          var chkCls = c.done ? 'eq-exit-check is-done' : 'eq-exit-check';
          return '<li' + liCls + '><div class="' + chkCls + '"></div><span>' + esc(c.text) + '</span></li>';
        }).join('');
      }

      // Key fields
      var fieldsHtml = '';
      if (s.keyFields && s.keyFields.length) {
        fieldsHtml = s.keyFields.map(function(f) {
          var val = f.badge
            ? '<span class="eq-badge eq-badge--' + esc(f.badge) + '">' + esc(f.value) + '</span>'
            : esc(f.value);
          if (f.required) val = '<span style="color:#EA001E;">' + esc(f.value) + '</span>';
          return '<dl class="eq-path-detail-field"><dt>' + esc(f.label) + '</dt><dd>' + val + '</dd></dl>';
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
          ? remaining + ' exit criteria remaining before this stage can close'
          : 'Complete all items above to close this opportunity';
        var btnCls = s.advanceBtn.disabled ? 'slds-button slds-button_neutral' : 'slds-button slds-button_brand';
        var iconKey = s.advanceBtn.icon || (s.advanceBtn.disabled ? 'lock' : 'check');
        advBtnHtml = '<div class="eq-path-advance-btn">' +
          '<span class="eq-advance-note">' + esc(noteText) + '</span>' +
          '<button class="' + btnCls + '"' + (s.advanceBtn.disabled ? ' disabled' : '') + '>' +
          '<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true" style="width:14px;height:14px;">' +
          '<use href="assets/icons/utility-sprite/svg/symbols.svg#' + iconKey + '"></use></svg>' +
          esc(s.advanceBtn.label) + '</button></div>';
      }

      return '<div id="path-detail-' + esc(s.id) + '" class="eq-path-detail" data-stage="' + esc(s.label) + '">' +
        '<div class="eq-path-stage-header">' +
          '<span class="eq-path-stage-name">' + esc(s.label) + ' — ' + esc(criteriaTitle) + '</span>' +
          '<div class="eq-path-stage-progress">' +
            '<span class="eq-progress-label">' + done + ' of ' + total + ' complete</span>' +
            '<div class="eq-path-progress-bar"><div class="eq-path-progress-fill" style="width:' + pct + '%; background:' + barColor + ';"></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="eq-path-detail-body">' +
          '<div><h3 class="eq-path-detail-title">' + esc(criteriaTitle) + '</h3><ul class="eq-exit-criteria">' + criteriaHtml + '</ul></div>' +
          '<div><h3 class="eq-path-detail-title">Key Fields</h3><div class="eq-path-detail-grid">' + fieldsHtml + '</div></div>' +
          '<div><h3 class="eq-path-detail-title">Guidance for Success</h3><ul class="eq-path-detail-list">' + guidanceHtml + '</ul></div>' +
        '</div>' +
        advBtnHtml +
      '</div>';
    }).join('');

    // — Mobile toggle (collapsed by default, visible < 768px) —
    var mobileToggle = '<button class="eq-path-mobile-toggle" aria-expanded="false" aria-label="Show sales path">' +
      '<svg class="slds-button__icon" aria-hidden="true" style="width:16px;height:16px;fill:currentColor;margin-right:6px;">' +
      '<use href="assets/icons/utility-sprite/svg/symbols.svg#routing_offline"></use></svg>' +
      '<span class="eq-path-mobile-label">Sales Path</span>' +
      '<svg class="slds-button__icon eq-path-chevron" aria-hidden="true" style="width:14px;height:14px;fill:currentColor;margin-left:auto;">' +
      '<use href="assets/icons/utility-sprite/svg/symbols.svg#chevrondown"></use></svg></button>';

    target.innerHTML = mobileToggle +
      '<div class="eq-path-wrapper">' + pathNav + panels + '</div>';

    // — Wire mobile toggle —
    var toggle = target.querySelector('.eq-path-mobile-toggle');
    var wrapper = target.querySelector('.eq-path-wrapper');
    if (toggle && wrapper) {
      toggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        wrapper.classList.toggle('eq-path-wrapper--open');
      });
    }

    // — Auto-expand current stage —
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
      }, 400);
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
