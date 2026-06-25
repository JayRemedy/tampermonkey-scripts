// ==UserScript==
// @name         Gmail Keyboard Sidebar Shortcuts
// @namespace    junkdoctors.gmail.shortcuts
// @version      1.1
// @description  Toggle Gmail sidebar with Cmd+B and open Gmail folders with Cmd+1 through Cmd+6
// @match        https://mail.google.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const SHORTCUTS = {
    '1': {
      name: 'Inbox',
      hash: '#inbox',
      labels: ['Inbox']
    },
    '2': {
      name: 'Starred',
      hash: '#starred',
      labels: ['Starred']
    },
    '3': {
      name: 'Snoozed',
      hash: '#snoozed',
      labels: ['Snoozed']
    },
    '4': {
      name: 'Sent',
      hash: '#sent',
      labels: ['Sent']
    },
    '5': {
      name: 'Drafts',
      hash: '#drafts',
      labels: ['Drafts']
    },
    '6': {
      name: 'All Mail',
      hash: '#all',
      labels: ['All Mail', 'All']
    }
  };

  function normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function isTypingInEditableField(event) {
    const target = event.target;

    if (!target) return false;

    const tagName = target.tagName;

    return (
      tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]') ||
      target.closest('[role="textbox"]')
    );
  }

  function findMainMenuButton() {
    return (
      document.querySelector('[aria-label="Main menu"]') ||
      [...document.querySelectorAll('[aria-label], [data-tooltip]')].find((el) => {
        return (
          normalizeText(el.getAttribute('aria-label')) === 'main menu' ||
          normalizeText(el.getAttribute('data-tooltip')) === 'main menu'
        );
      })
    );
  }

  function toggleGmailSidebar() {
    const button = findMainMenuButton();

    if (!button) {
      console.warn('Gmail main menu/sidebar button not found.');
      return;
    }

    button.click();
  }

  function getCurrentAccountBaseUrl() {
    const match = location.href.match(/^(https:\/\/mail\.google\.com\/mail\/u\/[^/]+\/)/);

    if (match) return match[1];

    return 'https://mail.google.com/mail/u/0/';
  }

  function findFolderLink(config) {
    const links = [...document.querySelectorAll('a[href*="mail.google.com/mail"], a[href^="#"], a[aria-label]')];

    return links.find((link) => {
      const href = link.getAttribute('href') || '';
      const aria = normalizeText(link.getAttribute('aria-label'));
      const text = normalizeText(link.textContent);

      const hrefMatches = href.includes(config.hash);

      const labelMatches = config.labels.some((label) => {
        const normalizedLabel = normalizeText(label);

        return (
          text === normalizedLabel ||
          aria === normalizedLabel ||
          aria.startsWith(normalizedLabel + ' ')
        );
      });

      return hrefMatches || labelMatches;
    });
  }

  function openFolder(config) {
    const link = findFolderLink(config);

    if (link) {
      link.click();
      return;
    }

    // Fallback: navigate by Gmail hash if the sidebar link is not currently available.
    const targetUrl = getCurrentAccountBaseUrl() + config.hash;

    if (location.href !== targetUrl) {
      location.href = targetUrl;
    }
  }

  document.addEventListener(
    'keydown',
    function (event) {
      const key = event.key.toLowerCase();
      const isCmd = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;

      if (!isCmd) return;

      const isSidebarToggle = key === 'b';
      const folderConfig = SHORTCUTS[key];

      if (!isSidebarToggle && !folderConfig) return;

      // Do not hijack Cmd+B while typing, because that should remain bold.
      if (isTypingInEditableField(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isSidebarToggle) {
        toggleGmailSidebar();
        return;
      }

      openFolder(folderConfig);
    },
    true
  );
})();
