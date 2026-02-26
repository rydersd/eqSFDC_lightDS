(function() {
  'use strict';

  // ====================================================================
  // TOAST NOTIFICATION SYSTEM
  // ====================================================================

  /**
   * Creates and displays a toast notification with optional auto-dismiss
   * @param {string} message - The message to display
   * @param {string} variant - The variant type: 'success', 'warning', 'error', 'info'
   */
  function showToast(message, variant = 'info') {
    // Create container if it doesn't exist
    let container = document.querySelector('.slds-notify_container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'slds-notify_container slds-is-relative';
      container.style.cssText = 'position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 9999; width: 100%; max-width: 600px; padding: 1rem;';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `slds-notify slds-notify_toast slds-theme_${variant}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.cssText = 'margin-bottom: 1rem; animation: slideDown 0.3s ease-out;';

    // Create toast inner structure
    toast.innerHTML = `
      <span class="slds-assistive-text">${variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
      <div class="slds-notify__content">
        <div class="slds-grid slds-grid_align-spread">
          <div class="slds-col">
            <h2 class="slds-text-heading_small">${escapeHtml(message)}</h2>
          </div>
          <div class="slds-col slds-col_bump-left">
            <button class="slds-button slds-button_icon slds-button_icon-small slds-button_icon-inverse" 
                    title="Close notification" 
                    aria-label="Close notification">
              <svg class="slds-icon slds-icon_x-small" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M13.41 12l8.3-8.29a1 1 0 0 0-1.41-1.41L12 10.59 3.71 2.3A1 1 0 0 0 2.3 3.71L10.59 12l-8.29 8.29a1 1 0 1 0 1.41 1.41L12 13.41l8.29 8.29a1 1 0 0 0 1.41-1.41z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add close handler
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      dismissToast(toast);
    });

    // Add to container
    container.appendChild(toast);

    // Auto-dismiss after 4 seconds
    const timeoutId = setTimeout(() => {
      dismissToast(toast);
    }, 4000);

    // Store timeout ID for cleanup
    toast.dataset.timeoutId = timeoutId;
  }

  /**
   * Dismisses a toast with fade-out animation
   */
  function dismissToast(toast) {
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    toast.style.animation = 'slideUp 0.3s ease-out forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  /**
   * Escapes HTML special characters
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ====================================================================
  // TIMELINE EXPAND/COLLAPSE
  // ====================================================================

  function initTimelineToggle() {
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[aria-controls^="timeline-item-"]');
      if (!toggleBtn) return;

      e.preventDefault();

      const itemId = toggleBtn.getAttribute('aria-controls');
      const itemElement = toggleBtn.closest('.slds-timeline__item_expandable');
      if (!itemElement) return;

      const mediaBody = itemElement.querySelector('.slds-media__body');
      if (!mediaBody) return;

      // Toggle aria-expanded
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);

      // Toggle slds-is-open class
      itemElement.classList.toggle('slds-is-open');

      // Rotate chevron
      const chevron = toggleBtn.querySelector('[class*="chevron"]');
      if (chevron) {
        chevron.classList.toggle('eq-chevron-rotated');
      }

      // Handle detail section
      let detailSection = document.getElementById(itemId);
      if (!detailSection) {
        // Create detail section on first expand
        detailSection = document.createElement('div');
        detailSection.id = itemId;
        detailSection.className = 'slds-box slds-theme_shade slds-m-top_x-small slds-m-bottom_x-small';
        detailSection.innerHTML = '<p class="slds-text-body_small">Additional details for this timeline item would appear here.</p>';
        mediaBody.appendChild(detailSection);
      } else {
        // Toggle display
        detailSection.style.display = detailSection.style.display === 'none' ? '' : 'none';
      }
    });
  }

  // ====================================================================
  // PATH STEP CLICK HANDLER
  // ====================================================================

  function initPathStepClick() {
    document.addEventListener('click', (e) => {
      const pathLink = e.target.closest('.slds-path__link');
      if (!pathLink) return;

      e.preventDefault();

      const pathContainer = pathLink.closest('.slds-path');
      if (!pathContainer) return;

      const allSteps = Array.from(pathContainer.querySelectorAll('.slds-path__link'));
      const clickedIndex = allSteps.indexOf(pathLink);

      // Update step classes
      allSteps.forEach((step, index) => {
        step.classList.remove('slds-is-complete', 'slds-is-current', 'slds-is-incomplete');

        if (index < clickedIndex) {
          step.classList.add('slds-is-complete');
        } else if (index === clickedIndex) {
          step.classList.add('slds-is-current');
        } else {
          step.classList.add('slds-is-incomplete');
        }
      });

      // Update the "Mark Status as Complete" button text
      updateMarkStatusButton(allSteps, clickedIndex);

      // Show success toast
      showToast('Stage updated successfully', 'success');
    });
  }

  /**
   * Updates the "Mark Status as Complete" button with next step name
   */
  function updateMarkStatusButton(allSteps, currentIndex) {
    // Find the mark-complete button within the same path container
    const pathContainer = allSteps[0] ? allSteps[0].closest('.slds-path') : null;
    const markStatusBtn = pathContainer ? pathContainer.querySelector('.slds-path__mark-complete') : null;
    const nextStep = allSteps[currentIndex + 1];

    if (markStatusBtn && nextStep) {
      const nextStepText = nextStep.querySelector('.slds-path__title').textContent.trim();
      markStatusBtn.innerHTML = `<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#check"></use></svg> Mark ${escapeHtml(nextStepText)} as Current Stage`;
    } else if (markStatusBtn && !nextStep) {
      markStatusBtn.innerHTML = `<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true"><use href="assets/icons/utility-sprite/svg/symbols.svg#check"></use></svg> Mark Status as Complete`;
    }
  }

  // ====================================================================
  // KEYBOARD NAVIGATION FOR PATH STEPS
  // ====================================================================

  function initPathKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      const pathLink = e.target.closest('.slds-path__link');
      if (!pathLink) return;

      const pathContainer = pathLink.closest('.slds-path');
      if (!pathContainer) return;

      const allSteps = Array.from(pathContainer.querySelectorAll('.slds-path__link'));
      const currentIndex = allSteps.indexOf(pathLink);

      let nextIndex = -1;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = Math.max(0, currentIndex - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = Math.min(allSteps.length - 1, currentIndex + 1);
      }

      if (nextIndex !== -1 && nextIndex !== currentIndex) {
        allSteps[nextIndex].focus();
        // Optionally auto-click
        // allSteps[nextIndex].click();
      }
    });
  }

  // ====================================================================
  // EDIT BUTTON HANDLER
  // ====================================================================

  function initEditButton() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.slds-button-group-list button');
      if (!btn || btn.textContent.trim() !== 'Edit') return;
      const editBtn = btn;

      e.preventDefault();

      // Show info toast
      showToast('Inline editing is not available in this prototype', 'info');

      // Flash animation on detail grid
      const detailGrid = document.querySelector('.eq-detail-grid');
      if (detailGrid) {
        detailGrid.classList.add('eq-edit-flash');
        setTimeout(() => {
          detailGrid.classList.remove('eq-edit-flash');
        }, 1000);
      }
    });
  }

  // ====================================================================
  // CARD COLLAPSE/EXPAND
  // ====================================================================

  function initCardCollapse() {
    document.addEventListener('click', (e) => {
      const cardTitle = e.target.closest('.slds-card__header-title');
      if (!cardTitle) return;

      e.preventDefault();

      const card = cardTitle.closest('.slds-card');
      if (!card) return;

      card.classList.toggle('eq-card-collapsed');

      const cardBody = card.querySelector('.slds-card__body');
      const cardFooter = card.querySelector('.slds-card__footer');

      if (cardBody) {
        cardBody.style.display = cardBody.style.display === 'none' ? '' : 'none';
      }
      if (cardFooter) {
        cardFooter.style.display = cardFooter.style.display === 'none' ? '' : 'none';
      }

      // Rotate chevron if present
      const chevron = cardTitle.querySelector('[class*="chevron"]');
      if (chevron) {
        chevron.classList.toggle('eq-card-chevron-rotated');
      }
    });
  }

  // ====================================================================
  // COLLAPSING HIGHLIGHTS PANEL ON SCROLL
  // ====================================================================

  function initCollapsingHeader() {
    const header = document.querySelector('.slds-page-header_record-home');
    if (!header) return;

    const threshold = 120; // pixels scrolled before collapsing
    let collapsed = false;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > threshold && !collapsed) {
        header.classList.add('eq-header-collapsed');
        collapsed = true;
      } else if (scrollY <= threshold && collapsed) {
        header.classList.remove('eq-header-collapsed');
        collapsed = false;
      }
    }, { passive: true });
  }

  // ====================================================================
  // PATH DETAIL EXPAND/COLLAPSE
  // ====================================================================

  function initPathDetailExpand() {
    var pathItems = document.querySelectorAll('.slds-path__item[data-path-detail]');
    pathItems.forEach(function(item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function(e) {
        e.preventDefault();
        var targetId = this.getAttribute('data-path-detail');
        var target = document.getElementById(targetId);
        if (!target) return;

        // Close all other panels
        var allPanels = document.querySelectorAll('.eq-path-detail.is-visible');
        allPanels.forEach(function(panel) {
          if (panel.id !== targetId) panel.classList.remove('is-visible');
        });

        // Toggle this panel
        target.classList.toggle('is-visible');
      });
    });
  }

  // ====================================================================
  // INIT ALL BEHAVIORS
  // ====================================================================

  function init() {
    // Add animations to document head
    addAnimationStyles();

    // Initialize all behaviors
    initTimelineToggle();
    initPathStepClick();
    initPathKeyboardNav();
    initEditButton();
    initCardCollapse();
    initCollapsingHeader();
    initPathDetailExpand();
    initRightColumnTabs();
    initActivityFilters();

    // Expose showToast globally for manual use
    window.showToast = showToast;
  }

  /**
   * Adds CSS animations to the document
   */
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }

      /* Chevron rotation for timeline and cards */
      .eq-chevron-rotated {
        transform: rotate(90deg);
        transition: transform 0.2s ease;
      }

      .eq-card-chevron-rotated {
        transform: rotate(90deg);
        transition: transform 0.2s ease;
      }

      /* Edit flash animation */
      .eq-edit-flash {
        animation: editFlash 1s ease;
      }

      @keyframes editFlash {
        0% {
          background-color: inherit;
        }
        25% {
          background-color: rgba(255, 237, 74, 0.4);
        }
        100% {
          background-color: inherit;
        }
      }

      /* Card collapse styles */
      .eq-card-collapsed .slds-card__body,
      .eq-card-collapsed .slds-card__footer {
        display: none;
      }

      /* Toast container positioning */
      .slds-notify_container {
        pointer-events: none;
      }

      .slds-notify_container .slds-notify {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  }

  // ====================================================================
  // ACTIVITY TIMELINE FILTERS
  // ====================================================================

  /**
   * Initializes activity type filters (All, Calls, Emails, Tasks, Events)
   * within the Activity tab. Filters timeline items by their type class.
   * Timeline items use SLDS classes: slds-timeline__item_email,
   * slds-timeline__item_call, slds-timeline__item_task, slds-timeline__item_event
   */
  function initActivityFilters() {
    document.querySelectorAll('.eq-activity-filters').forEach(function(filterBar) {
      filterBar.addEventListener('click', function(e) {
        var btn = e.target.closest('.eq-activity-filter');
        if (!btn) return;

        var filterType = btn.getAttribute('data-filter');
        var timeline = filterBar.closest('.slds-tabs_default__content') ||
                       filterBar.parentElement;
        var timelineEl = timeline.querySelector('.slds-timeline');
        if (!timelineEl) return;

        // Update active state
        filterBar.querySelectorAll('.eq-activity-filter').forEach(function(b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');

        // Filter items
        var items = timelineEl.querySelectorAll(
          '.slds-timeline__item_expandable, .slds-timeline__item, li.slds-timeline__item, div.slds-timeline__item'
        );
        items.forEach(function(item) {
          if (filterType === 'all') {
            item.style.display = '';
          } else {
            // Check class name for type match
            var classes = item.className || '';
            var assistText = item.querySelector('.slds-assistive-text');
            var itemType = assistText ? assistText.textContent.toLowerCase().trim() : '';

            var match = classes.indexOf('_' + filterType) !== -1 ||
                        itemType === filterType ||
                        itemType === filterType.replace('s', ''); // "calls" -> "call"

            // Also check timeline marker icon for flat timelines
            if (!match) {
              var iconUse = item.querySelector('use[href*="' + filterType.replace('s', '') + '"]') ||
                            item.querySelector('use[href*="log_a_call"]');
              if (filterType === 'calls' && iconUse && iconUse.getAttribute('href').indexOf('log_a_call') !== -1) {
                match = true;
              }
            }

            item.style.display = match ? '' : 'none';
          }
        });
      });
    });
  }

  // ====================================================================
  // RIGHT-COLUMN TAB SWITCHING
  // ====================================================================

  /**
   * Initializes SLDS tab switching for right-column activity tabs.
   * Works with standard SLDS tabs markup: slds-tabs_default with
   * slds-tabs_default__item, slds-tabs_default__link, slds-tabs_default__content.
   */
  function initRightColumnTabs() {
    document.querySelectorAll('.slds-tabs_default__nav').forEach(function(nav) {
      nav.addEventListener('click', function(e) {
        var link = e.target.closest('.slds-tabs_default__link');
        if (!link) return;
        e.preventDefault();

        var tabContainer = nav.closest('.slds-tabs_default');
        if (!tabContainer) return;

        // Deactivate all tabs
        tabContainer.querySelectorAll('.slds-tabs_default__item').forEach(function(item) {
          item.classList.remove('slds-is-active');
        });
        tabContainer.querySelectorAll('.slds-tabs_default__link').forEach(function(l) {
          l.setAttribute('aria-selected', 'false');
          l.setAttribute('tabindex', '-1');
        });
        tabContainer.querySelectorAll('.slds-tabs_default__content').forEach(function(panel) {
          panel.classList.remove('slds-show');
          panel.classList.add('slds-hide');
        });

        // Activate clicked tab
        link.closest('.slds-tabs_default__item').classList.add('slds-is-active');
        link.setAttribute('aria-selected', 'true');
        link.setAttribute('tabindex', '0');

        var panelId = link.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.classList.remove('slds-hide');
          panel.classList.add('slds-show');
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
