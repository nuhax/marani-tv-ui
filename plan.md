# IBOX VVIP - Premium IPTV Application Plan

## 1. App Branding & Naming
- **Update Main Title:** Set the main application title text to "IBOX VVIP". Remove any associated image assets related to the title.

## 2. Typography & Styling
- **Custom Font Family:** Apply a beautiful, custom `font-family` for the application's typography via `src/styles.css`.
- **Visual Enhancements:** Enhance CSS for "live events" and "broadcasts" UI elements to visually distinguish them (e.g., using specific borders, backgrounds, or icons). Update `src/styles.css` accordingly.

## 3. Interactivity & Navigation
- **`onclick` Handlers:** Implement `onclick` event handlers for "live events" and "broadcasts" UI elements to navigate to their respective content or external URLs. Integrate provided external IPTV links for this purpose.
- **Functional Back Button:** Integrate a functional "Back" button component across relevant views. Implement its `onclick` functionality using `history.back()`.

## 4. Component Integration
- **`src/App.tsx`:** Update title, integrate custom font, and remove title image assets.
- **`src/styles.css`:** Define custom `font-family` and enhance styling for "live events" and "broadcasts".
- **`src/components/home/ChannelCard.tsx` (and other relevant components):** Apply enhanced styling, implement `onclick` handlers for live content navigation using IPTV links, and integrate the "Back" button.
- **`src/components/player/TVPlayer.tsx`:** Ensure it's navigable away from via the "Back" button.
- **`src/services/iptv.ts`:** Verify correct structure for handling IPTV links.

## 5. Validation
- Test navigation, especially the "Back" button functionality, across all views and the player.
- Ensure interactive components (live events/broadcasts) are fully functional with IPTV links.
