// ==UserScript==
// @name         monday.com left pane + table shortcuts
// @namespace    https://monday.com/
// @version      1.5
// @description  Cmd+B collapses the left pane. Cmd+1/2/3/etc opens workspace/board items in order, skipping the first option. Cmd+Left/Right switches table/view tabs.
// @match        https://*.monday.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const COLLAPSE_BUTTON_SELECTOR =
    '[data-testid="collapse-leftpane-button-workspace"]';

  const WORKSPACE_ITEM_SELECTOR =
    '[role="listbox"][aria-label="Workspace"] [role="option"][data-testid^="list-item-"]';

  const VIEW_TABS_SELECTOR =
    '[role="tablist"][aria-label="Views Tabs"] [role="tab"]';

  function isVisible(el) {
    if (!el) return false;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== "hidden" &&
      style.display !== "none"
    );
  }

  function isEnabledTab(tab) {
    return (
      tab &&
      tab.getAttribute("aria-disabled") !== "true" &&
      !tab.classList.contains("react-tabs__tab--disabled") &&
      isVisible(tab)
    );
  }

  function clickCollapseButton() {
    const button = document.querySelector(COLLAPSE_BUTTON_SELECTOR);

    if (button) {
      button.click();
      return true;
    }

    console.warn("monday.com collapse button not found:", COLLAPSE_BUTTON_SELECTOR);
    return false;
  }

  function openWorkspaceItem(number) {
    const items = Array.from(document.querySelectorAll(WORKSPACE_ITEM_SELECTOR))
      .filter(isVisible);

    // Cmd+1 opens the 2nd visible option, Cmd+2 opens the 3rd, etc.
    const item = items[number];

    if (item) {
      item.click();
      return true;
    }

    console.warn(`monday.com workspace item #${number + 1} not found`);
    return false;
  }

  function getViewTabs() {
    return Array.from(document.querySelectorAll(VIEW_TABS_SELECTOR))
      .filter(isEnabledTab);
  }

  function getSelectedTabIndex(tabs) {
    const selectedIndex = tabs.findIndex(
      (tab) =>
        tab.getAttribute("aria-selected") === "true" ||
        tab.querySelector('[aria-selected="true"]')
    );

    if (selectedIndex !== -1) return selectedIndex;

    // Fallback: Monday sometimes visually marks selected state deeper inside the tab.
    return tabs.findIndex((tab) =>
      tab.querySelector('[class*="Selected"], [class*="selected"]')
    );
  }

  function clickTab(tab) {
    if (!tab) return false;

    // Prefer clicking the inner button-like sortable element when present.
    const clickable =
      tab.querySelector('[role="button"][tabindex]') ||
      tab.querySelector('[role="button"]') ||
      tab;

    clickable.click();
    return true;
  }

  function switchViewTab(direction) {
    const tabs = getViewTabs();

    if (!tabs.length) {
      console.warn("monday.com view tabs not found");
      return false;
    }

    let currentIndex = getSelectedTabIndex(tabs);

    // If selected tab cannot be detected, start from the first tab.
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    const nextIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, tabs.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex === currentIndex) {
      return false;
    }

    return clickTab(tabs[nextIndex]);
  }

  document.addEventListener(
    "keydown",
    function (event) {
      const key = event.key.toLowerCase();

      // Cmd+B: collapse/expand left pane
      if (
        event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        key === "b"
      ) {
        event.preventDefault();
        event.stopPropagation();
        clickCollapseButton();
        return;
      }

      // Cmd+1 through Cmd+9: open associated visible workspace item, skipping first
      if (
        event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        /^[1-9]$/.test(key)
      ) {
        event.preventDefault();
        event.stopPropagation();
        openWorkspaceItem(Number(key));
        return;
      }

      // Cmd+Left: previous table/view tab
      if (
        event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        event.stopPropagation();
        switchViewTab("previous");
        return;
      }

      // Cmd+Right: next table/view tab
      if (
        event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        event.stopPropagation();
        switchViewTab("next");
        return;
      }
    },
    true
  );
})();
