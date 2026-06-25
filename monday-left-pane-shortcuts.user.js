// ==UserScript==
// @name         monday.com left pane shortcuts
// @namespace    https://monday.com/
// @version      1.4
// @description  Cmd+B collapses the left pane. Cmd+1/2/3/etc opens workspace/board items in order, skipping the first option.
// @match        https://*.monday.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const COLLAPSE_BUTTON_SELECTOR =
    '[data-testid="collapse-leftpane-button-workspace"]';

  const WORKSPACE_ITEM_SELECTOR =
    '[role="listbox"][aria-label="Workspace"] [role="option"][data-testid^="list-item-"]';

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
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    // Cmd+1 opens the 2nd visible option, Cmd+2 opens the 3rd, etc.
    const item = items[number];

    if (item) {
      item.click();
      return true;
    }

    console.warn(`monday.com workspace item #${number + 1} not found`);
    return false;
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
      }
    },
    true
  );
})();
