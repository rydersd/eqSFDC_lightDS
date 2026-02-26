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
