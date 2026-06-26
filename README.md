# Tampermonkey Scripts

Personal Tampermonkey scripts for faster keyboard navigation in Google Calendar, Gmail, and monday.com.

These scripts are intentionally small and dependency-free. They listen for site-specific keyboard shortcuts, avoid taking over editable fields when possible, and fall back to direct navigation where that is safer than relying on a visible sidebar link.

## Scripts

| Script | Site | Shortcuts |
| --- | --- | --- |
| `google-calendar-robust-shortcuts.user.js` | Google Calendar | `Cmd+B`, `Cmd+1` through `Cmd+9`, `Cmd+0` |
| `gmail-keyboard-sidebar-shortcuts.user.js` | Gmail | `Cmd+B`, `Cmd+1` through `Cmd+6` |
| `monday-left-pane-shortcuts.user.js` | monday.com | `Cmd+B`, `Cmd+1` through `Cmd+9`, `Cmd+Left`, `Cmd+Right` |

## Shortcut Maps

### Google Calendar

| Shortcut | Action |
| --- | --- |
| `Cmd+B` | Toggle the main drawer/sidebar. |
| `Cmd+1` through `Cmd+9` | Toggle visible calendars by their current order in the "My calendars" list. |
| `Cmd+0` | Print the current calendar shortcut map in the browser console. |

### Gmail

| Shortcut | Action |
| --- | --- |
| `Cmd+B` | Toggle the Gmail main menu/sidebar. |
| `Cmd+1` | Open Inbox. |
| `Cmd+2` | Open Starred. |
| `Cmd+3` | Open Snoozed. |
| `Cmd+4` | Open Sent. |
| `Cmd+5` | Open Drafts. |
| `Cmd+6` | Open All Mail. |

### monday.com

| Shortcut | Action |
| --- | --- |
| `Cmd+B` | Collapse or expand the left pane. |
| `Cmd+1` through `Cmd+9` | Open visible workspace or board items by order, skipping the first option. |
| `Cmd+Left` | Switch to the previous table or view tab. |
| `Cmd+Right` | Switch to the next table or view tab. |

## Installation

1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/).
2. Open the `.user.js` file for the script you want.
3. Copy the file contents into a new Tampermonkey script.
4. Save the script and refresh the matching site.

## Updating

Replace the installed Tampermonkey script contents with the latest version from this repository, then save and refresh the matching site.

## Notes

- These scripts target macOS-style shortcuts with the Command key.
- Gmail and Google Calendar shortcuts avoid editable fields so normal text editing shortcuts keep working.
- Site DOM changes can break scripts. If a shortcut stops working, check the browser console for warnings from the relevant script.
