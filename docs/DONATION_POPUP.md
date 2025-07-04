# Ko-fi Donation Popup Feature

This feature adds a donation popup to encourage users to support the project via Ko-fi when they access race analytics pages.

## How it works

### Popup Display Logic
The popup will appear when users visit race pages under the following conditions:

1. **Visit Count**: Only shows after the user has visited race pages 3 or more times (to avoid annoying new users)
2. **Session Limit**: Only shows once per browser session
3. **Reminder Timing**: Respects "remind me later" choice (24-hour delay)
4. **Permanent Dismissal**: Respects "don't show again" choice (never shows again)

### User Controls
Users have three options when the popup appears:

1. **Support on Ko-fi**: Opens the Ko-fi page in a new tab
2. **Remind me later**: Hides the popup for 24 hours
3. **Don't show again**: Permanently dismisses the popup

### Technical Implementation

#### Components
- `KofiDonationPopup.tsx`: The main popup component with Ko-fi branding
- `useDonationPopup.ts`: Hook that manages popup display logic and user preferences

#### Storage
- `localStorage.kofiDonationDontShow`: Permanent dismissal flag
- `localStorage.kofiDonationRemindLater`: Timestamp for 24-hour reminder delay
- `localStorage.racePageVisitCount`: Tracks total race page visits
- `sessionStorage.kofiPopupShownThisSession`: Prevents multiple popups per session

#### Analytics
All user interactions are tracked via Umami events:
- `Ko-fi Donation Click`: When user clicks the Ko-fi button
- `Donation Popup - Remind Later`: When user chooses remind later
- `Donation Popup - Don't Show Again`: When user permanently dismisses

## Customization

### Timing
To change when the popup appears, modify the visit count threshold in `useDonationPopup.ts`:
```typescript
// Show popup after 3+ visits to avoid annoying new users
if (newVisitCount >= 3) {
```

### Styling
The popup uses the existing design system with:
- Tailwind CSS classes for styling
- Lucide React icons
- Shadcn/ui components (Dialog, Card, Button)

### Ko-fi Link
The Ko-fi link is configured in `KofiDonationPopup.tsx`:
```typescript
window.open('https://ko-fi.com/fastlytics', '_blank');
```

## Integration

The popup is integrated into the `Race.tsx` component:
```typescript
// Hook usage
const { shouldShowPopup, hidePopup } = useDonationPopup();

// JSX integration
<KofiDonationPopup 
  isOpen={shouldShowPopup} 
  onClose={hidePopup}
/>
```

## User Experience

The popup is designed to be:
- **Non-intrusive**: Only appears after multiple visits
- **Respectful**: Provides clear dismissal options
- **Branded**: Uses Ko-fi colors and styling
- **Informative**: Explains what donations support
- **Responsive**: Works well on mobile and desktop
