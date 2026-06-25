// ==UserScript==
// @name         Google Calendar Robust Shortcuts
// @namespace    https://calendar.google.com/
// @version      1.2
// @description  Cmd+B toggles sidebar. Cmd+1..9 toggles visible calendars in order.
// @match        https://calendar.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = true;

    function log(...args) {
        if (DEBUG) console.log('[GCal Shortcuts]', ...args);
    }

    function isTypingInInput(event) {
        const el = event.target;

        if (!el) return false;

        const tag = el.tagName?.toLowerCase();

        return (
            tag === 'input' ||
            tag === 'textarea' ||
            tag === 'select' ||
            el.isContentEditable ||
            el.closest?.('[contenteditable="true"]')
        );
    }

    function clickElement(el) {
        if (!el) return false;

        el.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        el.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        el.click();

        return true;
    }

    function toggleMainDrawer() {
        const drawerButton =
            document.querySelector('[aria-label="Main drawer"]') ||
            document.querySelector('button[aria-label*="drawer" i]') ||
            document.querySelector('div[role="button"][aria-label*="drawer" i]');

        if (!drawerButton) {
            console.warn('[GCal Shortcuts] Main drawer button not found.');
            return;
        }

        clickElement(drawerButton);
        log('Toggled main drawer');
    }

    function getMyCalendarsSection() {
        return (
            document.querySelector('[aria-label="My calendars"][role="list"]') ||
            document.querySelector('[aria-label="My calendars"]')
        );
    }

    function getVisibleCalendarCheckboxes() {
        const myCalendarsSection = getMyCalendarsSection();

        let checkboxes = [];

        if (myCalendarsSection) {
            checkboxes = Array.from(
                myCalendarsSection.querySelectorAll('input[type="checkbox"][aria-label]')
            );
        }

        // Fallback: if Google changes the wrapper, grab likely calendar checkboxes.
        if (!checkboxes.length) {
            checkboxes = Array.from(
                document.querySelectorAll('input[type="checkbox"][aria-label]')
            ).filter(input => {
                const label = input.getAttribute('aria-label') || '';

                return (
                    label &&
                    !label.toLowerCase().includes('select') &&
                    !label.toLowerCase().includes('task') &&
                    input.offsetParent !== null
                );
            });
        }

        // Keep only visible/enabled checkboxes.
        return checkboxes.filter(input => {
            const rect = input.getBoundingClientRect();

            return (
                !input.disabled &&
                rect.width > 0 &&
                rect.height > 0
            );
        });
    }

    function toggleCalendarByVisibleIndex(indexZeroBased) {
        const checkboxes = getVisibleCalendarCheckboxes();
        const checkbox = checkboxes[indexZeroBased];

        if (!checkbox) {
            console.warn(`[GCal Shortcuts] No visible calendar found for Cmd+${indexZeroBased + 1}.`);
            console.table(
                checkboxes.map((cb, i) => ({
                    shortcut: `Cmd+${i + 1}`,
                    calendar: cb.getAttribute('aria-label'),
                    checked: cb.checked
                }))
            );
            return;
        }

        const name = checkbox.getAttribute('aria-label') || `Calendar ${indexZeroBased + 1}`;

        clickElement(checkbox);

        log(`Toggled Cmd+${indexZeroBased + 1}: ${name}`);
    }

    function printShortcutMap() {
        const checkboxes = getVisibleCalendarCheckboxes();

        console.table(
            checkboxes.map((cb, i) => ({
                shortcut: `Cmd+${i + 1}`,
                calendar: cb.getAttribute('aria-label'),
                checked: cb.checked
            }))
        );
    }

    document.addEventListener('keydown', function (event) {
        const key = event.key.toLowerCase();

        // Do not interfere when typing into fields.
        if (isTypingInInput(event)) return;

        // Cmd+B toggles the main drawer.
        if (event.metaKey && !event.ctrlKey && !event.altKey && key === 'b') {
            event.preventDefault();
            event.stopPropagation();

            toggleMainDrawer();
            return;
        }

        // Cmd+1 through Cmd+9 toggles visible calendars by order.
        if (
            event.metaKey &&
            !event.ctrlKey &&
            !event.altKey &&
            /^[1-9]$/.test(event.key)
        ) {
            event.preventDefault();
            event.stopPropagation();

            const index = Number(event.key) - 1;
            toggleCalendarByVisibleIndex(index);
            return;
        }

        // Optional debug: Cmd+0 prints the current shortcut map.
        if (event.metaKey && !event.ctrlKey && !event.altKey && event.key === '0') {
            event.preventDefault();
            event.stopPropagation();

            printShortcutMap();
        }
    }, true);

    log('Loaded. Cmd+B = sidebar, Cmd+1..9 = visible calendars, Cmd+0 = print map.');
})();
