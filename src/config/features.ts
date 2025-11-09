/**
 * Feature Flags
 * Toggle features on/off without removing code
 */
export const FEATURES = {
  /**
   * Discord Verification Toggle
   *
   * Set to false: Users see "Enter" button on login page (open access)
   * Set to true: Users must verify Discord + WoW holder role
   *
   * To toggle: Change the boolean below and redeploy
   */
  DISCORD_VERIFICATION_REQUIRED: false, // Currently: Open access mode
} as const;
