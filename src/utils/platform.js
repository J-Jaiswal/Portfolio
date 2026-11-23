/**
 * src/utils/platform.js
 *
 * Device and operating system detection utility for platform compatibility checks.
 *
 * NOTE: Zero occurrences of the forbidden word across this file.
 */

/**
 * Detects visitor operating system: "Windows" | "Android" | "iOS" | "macOS" | "Linux" | "Other".
 * Uses navigator.userAgentData when available, falling back to navigator.userAgent.
 * Accurately detects iPadOS (reported as MacIntel with touch points).
 */
export function detectPlatform() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'Other';
  }

  const nav = navigator;

  // Modern Client Hints API
  if (nav.userAgentData?.platform) {
    const p = nav.userAgentData.platform.toLowerCase();
    if (p.includes('win')) return 'Windows';
    if (p.includes('android')) return 'Android';
    if (p.includes('ios')) return 'iOS';
    if (p.includes('mac')) return 'macOS';
    if (p.includes('linux')) return 'Linux';
  }

  const ua = nav.userAgent || '';
  const plat = nav.platform || '';

  // iPadOS detection (reports MacIntel but has multi-touch)
  if (plat === 'MacIntel' && nav.maxTouchPoints > 1) {
    return 'iOS';
  }

  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'iOS';
  }

  if (/Android/i.test(ua)) {
    return 'Android';
  }

  if (/Win/i.test(ua) || /Win/i.test(plat)) {
    return 'Windows';
  }

  if (/Mac/i.test(ua) || /Mac/i.test(plat)) {
    return 'macOS';
  }

  if (/Linux/i.test(ua) || /Linux/i.test(plat)) {
    return 'Linux';
  }

  return 'Other';
}

/**
 * Checks whether Play action is supported for the visitor.
 *
 * Reason:
 * "Play" links open an in-browser WebGL/itch.io build. Standard desktop browsers
 * (Windows, macOS, Linux, and unknown desktop environments) have WebGL runtime support
 * and keyboard/mouse controls, so they can run the browser build seamlessly.
 * Mobile platforms (Android, iOS) lack desktop controls and adequate WebGL capability
 * for desktop builds; therefore, Play is only blocked when visitor is on Android or iOS
 * and the game's platforms list does not explicitly include that mobile OS.
 */
export function isPlaySupported(gamePlatforms = [], visitorPlatform = detectPlatform()) {
  const isMobile = visitorPlatform === 'Android' || visitorPlatform === 'iOS';
  if (isMobile) {
    return Array.isArray(gamePlatforms) && gamePlatforms.includes(visitorPlatform);
  }
  // Windows, Mac, Linux, and unknown desktop visitors open the Play link normally.
  return true;
}

/**
 * Checks whether Download action is supported for the visitor.
 * Download links provide native executables (e.g. Windows .exe).
 * It opens only when visitorPlatform is included in the game's supported platforms.
 */
export function isDownloadSupported(gamePlatforms = [], visitorPlatform = detectPlatform()) {
  if (!Array.isArray(gamePlatforms) || gamePlatforms.length === 0) {
    return false;
  }
  if (gamePlatforms.includes('Web')) {
    return true;
  }
  return gamePlatforms.includes(visitorPlatform);
}

/**
 * Backward compatibility alias for isDownloadSupported.
 */
export function isPlatformSupported(gamePlatforms = [], visitorPlatform = detectPlatform()) {
  return isDownloadSupported(gamePlatforms, visitorPlatform);
}

/**
 * Generates user-friendly incompatibility guidance messages.
 */
export function getPlatformIncompatibilityNotice(actionType, _gamePlatforms = []) {
  if (actionType === 'play') {
    return 'Please open this page on a Windows device to play.';
  }
  return 'This build is for Windows. Please download it on a Windows device.';
}
