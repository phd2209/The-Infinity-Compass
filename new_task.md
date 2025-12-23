# Task: Add Toggle to Enable or Disable Discord Verification

## Goal
We want to **add a simple true/false switch** that controls whether users must verify via Discord before continuing.

- When the toggle is **true** → keep the existing Discord verification flow.  
- When the toggle is **false** → skip Discord verification and send users directly to the next step (wallet entry).  

The rest of the app’s flow should remain unchanged.

---

## Context

Current flow:
1. Discord verification  
2. Enter wallet and select WoW NFT  
3. Enter name and birth date  
4. View numerology reading card  

We want to **optionally bypass step 1** for testing or open-access modes.

---

## Requirements

- Add a single boolean variable (e.g. `discordRequired`) that controls whether Discord verification is enforced.
- When `discordRequired` is `false`, automatically route the user to the wallet entry step instead of showing the Discord login page.
- When `discordRequired` is `true`, the existing Discord logic should remain untouched.
- All backend endpoints, session handling, and Discord OAuth logic should stay intact and functional.

---

## Implementation Notes

- You can define the `discordRequired` flag wherever it best fits the project structure (config file, environment variable, or context provider).
- Use clean conditional logic around the routing or rendering of the Discord verification step.
- No console errors or broken routes should occur when toggling between modes.
- Optionally, show a small banner or text on the wallet entry page when Discord verification is disabled:
  > “Discord verification is temporarily disabled for open access.”

---

## Acceptance Criteria

- ✅ The app runs normally when Discord verification is enabled.  
- ✅ When Discord verification is disabled, users can directly access the wallet entry step.  
- ✅ All other parts of the flow (NFT selection, numerology, reading card) function as before.  
- ✅ Easy to switch between the two modes with a single flag or environment variable.

---

## Summary

This feature provides flexibility for controlled testing and public demos without removing or rewriting existing authentication code.
Keep it modular so that Discord verification can easily be re-enabled later.
