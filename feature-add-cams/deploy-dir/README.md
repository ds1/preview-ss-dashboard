# DSDEV Dashboard

A modern, responsive construction site monitoring dashboard for managing security camera feeds, alerts, and site activities. Built with vanilla JavaScript and a custom design system.

## 🚀 Features

### Camera Management
- **Multi-camera Grid View**: Support for 1×1, 2×2, 3×3, and 4×4 grid layouts
- **Live Streaming**: Start/stop individual or all camera streams
- **Drag & Drop**: Reorder cameras with smooth drag-and-drop functionality
- **Fullscreen Mode**: View any camera feed in fullscreen with dedicated controls
- **Camera Selection**: Add cameras from multiple construction projects
- **Persistent Layout**: Camera arrangement and configuration saved to localStorage
- **External Camera View**: Open individual camera view pages in new tabs
- **Camera Types**: Support for both video streams and static image cameras
- **Status Indicators**: Real-time online/offline status with visual indicators
- **Battery Monitoring**: Battery level display for each camera

### Display Options
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Fit to Screen**: Optimize grid layout to fit viewport without scrolling
- **Show/Hide Elements**: Toggle visibility of:
  - Project names
  - Camera names
  - Live timestamps
- **Auto-updating Timestamps**: Real-time timestamp updates every second

### Design & Accessibility
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Touch-optimized**: Enhanced controls for mobile devices
- **Loading States**: Visual loading spinners for video streams
- **Error Handling**: Graceful fallbacks for failed video/image loads
- **Semantic Markup**: Proper HTML structure for accessibility

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Custom SVG icon system
- **Fonts**: Manrope (Google Fonts)
- **Build**: No build process required - pure HTML/CSS/JS

## 📋 Requirements

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Internet connection for video streams and fonts

## 📖 Usage

### Adding Cameras

1. Click the "Add Camera" card in the grid
2. Select a project from the sidebar (shows camera count per project)
3. Choose available cameras:
   - ✅ Online cameras (ready to use)
   - ❌ Offline cameras (disabled)
   - 🔧 Maintenance cameras (disabled)
4. Click "Add Selected" to add them to your dashboard

### Managing Camera Views

- **Start/Stop Individual Stream**: Click the play/pause button on any video camera
- **Start/Stop All Streams**: Use the header "Start/Stop All Streams" button
- **Fullscreen**: Click the expand icon to view in fullscreen
- **Open Camera View Page**: Click the external link icon (opens in new tab)
- **Reorder**: 
  - **Desktop**: Drag and drop camera cards
  - **Mobile**: Long-press (500ms) to activate drag mode
- **Remove**: Click the × button in the top-left corner of any camera

### Display Configuration

Access display options via the "Display" button in the header:

1. **Grid Layout**: Choose between 1×1, 2×2, 3×3, or 4×4 layouts
2. **Toggle Options**:
   - Show/Hide Project Names
   - Show/Hide Camera Names
   - Show/Hide Timestamps
   - Fit to Screen mode
   - Dark/Light mode

### Mobile Drag & Drop

The dashboard uses a long-press gesture for mobile reordering:
1. Press and hold a camera card for 500ms
2. Card will wiggle and show "Hold to drag" indicator
3. Drag to reorder cameras
4. Visual feedback shows valid drop targets
5. Haptic feedback on supported devices

### Keyboard Shortcuts

- `Esc` - Exit fullscreen mode, close modals and dropdowns
- `Click outside` - Close modals and dropdowns

## 🎨 Design System

The dashboard uses the DSDEV design system with custom design tokens:

### Color Palette

#### Primary Colors
- **DSDEV Orange**: `#f79837` - Primary brand color
- **DSDEV Aqua**: `#00a8ad` - Secondary accent
- **DSDEV Gray**: Neutral scale from `#f9f9f9` to `#333335`

#### Semantic Colors
- **Success**: `#17b26a` (online status)
- **Error**: `#f04438` (offline status, low battery)
- **Warning**: `#eaaa08` (maintenance status)

### Typography

- **Font Family**: Manrope
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: 12px to 72px with predefined styles

### Spacing System

Based on 4px grid:
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-3`: 12px
- `spacing-4`: 16px
- `spacing-5`: 20px
- `spacing-6`: 24px
- `spacing-8`: 32px
- `spacing-10`: 40px

## 📱 Mobile Support

Fully responsive with specific optimizations for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 430px - 767px
- **iPhone 12**: 390px × 844px
- **Small Mobile**: 360px and below

### Mobile Features
- Horizontal scrolling for project selection
- Bottom sheet modal design
- Touch-optimized controls with always-visible buttons
- Safe area inset support for notched devices
- Haptic feedback for drag operations
- Prevented scroll bounce on iOS

## 🔧 Configuration

### Camera View URL

The "Open Camera View Page" button opens individual camera views in new tabs. By default, it uses the pattern `/camera/{cameraId}`. To customize this URL:

```javascript
// In the event handler (around line 3620)
window.open(`/camera/${cameraId}`, '_blank');

// Example customizations:
// Full URL with domain
window.open(`https://yourcameraserver.com/view/${cameraId}`, '_blank');

// With query parameters
window.open(`/camera/view?id=${cameraId}&name=${cameraName}`, '_blank');

// Custom pattern
window.open(`/monitoring/camera/${projectId}/${cameraId}`, '_blank');
```

### Camera Projects

Projects and cameras are configured in the `projectsData` object:

```javascript
const projectsData = {
  'project-id': {
    name: 'Project Name',
    cameras: [
      {
        id: 'camera-id',
        name: 'Camera Name',
        status: 'online', // online, offline, maintenance
        battery: 85,      // 0-100
        type: 'video'     // video, image
      }
    ]
  }
};
```

### Image Configuration

Configure image source for camera placeholders:

```javascript
const imageConfig = {
  source: 'local',           // 'local' or 'unsplash'
  localPath: './images/cameras/',
  fallbackImage: 'placeholder.jpg' // CSS chooses the version of the placeholder image to use depending on light or dark mode theme is in use
};
```

### Theme Customization

Modify CSS variables in `:root` or theme-specific selectors:

```css
[data-theme="custom"] {
  --color-orange-500: #your-color;
  --bg-primary: #your-background;
  /* ... other variables */
}
```

## 💾 Local Storage

The dashboard persists the following settings:
- Camera order and active cameras
- Theme preference (dark/light)
- Display options (show/hide toggles)
- Fit to screen preference

## 🔍 Camera States

### Status Types
- **Online**: Camera is active and available
- **Offline**: Camera is disconnected (shown with grayscale)
- **Maintenance**: Camera is under maintenance (disabled in selection)

### Battery Levels
- **Normal**: > 30% (default color)
- **Low**: < 30% (red color warning)

### Media Types
- **Video**: Supports live streaming with play/pause controls
- **Image**: Static image display without video controls

## 🐛 Error Handling

- Failed video loads show error message with retry option
- Failed image loads show placeholder icon
- Offline cameras display last known image in grayscale
- Network errors handled gracefully with visual feedback

## 📝 Code Style Guidelines

- Use ES6+ features
- Follow existing naming conventions
- Comment complex logic
- Ensure mobile compatibility
- Test in multiple browsers
- Maintain accessibility standards