# DSDEV Dashboard

A modern, responsive construction site monitoring dashboard for managing security camera feeds, alerts, and site activities. Built with vanilla JavaScript and a custom design system based on the DSDEV (SC2.0) brand guidelines.

![DSDEV Dashboard](https://img.shields.io/badge/version-1.0.0-orange.svg)

## 🚀 Features

### Camera Management
- **Multi-camera Grid View**: Support for 1x1, 2x2, 3x3, and 4x4 grid layouts
- **Live Streaming**: Start/stop individual or all camera streams
- **Drag & Drop**: Reorder cameras with smooth drag-and-drop functionality
- **Fullscreen Mode**: View any camera feed in fullscreen with dedicated controls
- **Camera Selection**: Add cameras from multiple construction projects
- **Persistent Layout**: Camera arrangement saved to local storage
- **External Camera View**: Open individual camera view pages in new tabs

### Design & Accessibility
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Fully Responsive**: Optimized for desktop, tablet, and mobile (including iPhone 12)
- **Touch-optimized**: Enhanced controls for mobile devices
- **WCAG Compliant**: Proper contrast ratios and semantic markup

## Roadmap

![Planned Features]https://img.shields.io/badge/Coming%20Soon-blue

### Smart Search & Filtering
- **Intelligent Autocomplete**: Search for objects, activities, and events
- **Category-based Results**: Organized by People, Vehicles, Heavy Equipment, Materials, and Activities
- **Real-time Filtering**: Filter cameras by status, project, and alert types

### Alert System
- **Real-time Alerts**: Motion detection, low battery warnings, equipment alerts
- **Alert Panel**: Collapsible side panel with chronological alert feed
- **Visual Indicators**: Badge counts and status indicators

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

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dsdev-dashboard.git
cd dsdev-dashboard
```

2. Open `index.html` in your web browser:
```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Development Server (Optional)

For a better development experience, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (requires http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

## 📖 Usage

### Adding Cameras

1. Click the "Add Camera" card in the grid
2. Select a project from the sidebar
3. Choose available cameras (online cameras only)
4. Click "Add Selected" to add them to your dashboard

### Managing Camera Views

- **Start Stream**: Click the play button on any camera
- **Fullscreen**: Click the expand icon to view in fullscreen
- **Open Camera View Page**: Click the external link icon to open the camera in a dedicated view page (opens in new tab)
- **Reorder**: Drag and drop camera cards to rearrange
- **Remove**: Hover over a camera and click the × button

### Keyboard Shortcuts

- `Esc` - Exit fullscreen mode
- `Click outside` - Close modals and dropdowns
- `Ctrl/Cmd + Click` on external link button - Open camera view in new tab (standard browser behavior)

## 🎨 Design System

The dashboard uses the DSDEV design system with custom design tokens:

### Color Palette

#### Primary Colors
- **DSDEV Orange**: `#f79837` - Primary brand color
- **DSDEV Aqua**: `#00a8ad` - Secondary accent
- **DSDEV Gray**: Neutral scale from `#f9f9f9` to `#333335`

#### Semantic Colors
- **Success**: `#17b26a`
- **Error**: `#f04438`
- **Warning**: `#eaaa08`

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
- Touch-optimized controls (play, external view, fullscreen)
- Safe area inset support for notched devices

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

### Theme Customization

Modify CSS variables in `:root` or theme-specific selectors:

```css
[data-theme="custom"] {
  --color-orange-500: #your-color;
  --bg-primary: #your-background;
  /* ... other variables */
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use ES6+ features
- Follow existing naming conventions
- Comment complex logic
- Ensure mobile compatibility
- Test in multiple browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
