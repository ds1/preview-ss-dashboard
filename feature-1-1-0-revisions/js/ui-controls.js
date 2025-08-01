// UI Control Functions

// Theme Toggle
function toggleDarkMode(element) {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle state
    if (newTheme === 'dark') {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
}

// Toggle Fit to Screen
function toggleFitToScreen(element) {
    const contentArea = document.querySelector('.content-area');
    const isActive = element.classList.contains('active');
    
    if (!isActive) {
        element.classList.add('active');
        contentArea.classList.add('fit-to-screen');
        localStorage.setItem('fitToScreen', 'true');
        
        // Adjust grid based on total number of cameras
        adjustGridForFitToScreen();
    } else {
        element.classList.remove('active');
        contentArea.classList.remove('fit-to-screen');
        localStorage.setItem('fitToScreen', 'false');
    }
}

// Adjust grid layout for fit-to-screen mode
function adjustGridForFitToScreen() {
    const grid = document.getElementById('cameraGrid');
    const cameraCount = grid.querySelectorAll('.camera-card, .add-camera-card').length;
    
    // Remove all grid classes
    grid.classList.remove('grid-1x1', 'grid-2x2', 'grid-3x3', 'grid-4x4');
    
    // Apply optimal grid based on camera count
    if (cameraCount <= 1) {
        grid.classList.add('grid-1x1');
    } else if (cameraCount <= 4) {
        grid.classList.add('grid-2x2');
    } else if (cameraCount <= 9) {
        grid.classList.add('grid-3x3');
    } else {
        grid.classList.add('grid-4x4');
    }
    
    // Update the radio button to match
    const gridClass = Array.from(grid.classList).find(c => c.startsWith('grid-'));
    const radio = document.querySelector(`input[value="${gridClass}"]`);
    if (radio) radio.checked = true;
}

// Setup dropdown event handlers
function setupDropdownEventHandlers() {
    // Use event delegation for better mobile support
    document.addEventListener('click', function(e) {
        // Handle toggle switches first
        const toggleSwitch = e.target.closest('.toggle-switch');
        if (toggleSwitch) {
            e.preventDefault();
            e.stopPropagation();
            
            // Determine which toggle was clicked and handle it
            if (toggleSwitch.id === 'showProjectNamesToggle') {
                toggleSwitch.classList.toggle('active');
                handleToggleSwitch(toggleSwitch, 'projectNames');
            } else if (toggleSwitch.id === 'showCameraNamesToggle') {
                toggleSwitch.classList.toggle('active');
                handleToggleSwitch(toggleSwitch, 'cameraNames');
            } else if (toggleSwitch.id === 'showTimestampsToggle') {
                toggleSwitch.classList.toggle('active');
                handleToggleSwitch(toggleSwitch, 'timestamps');
            } else if (toggleSwitch.id === 'fitToScreenToggle') {
                // fitToScreen manages its own active state
                toggleFitToScreen(toggleSwitch);
            } else if (toggleSwitch.id === 'darkModeToggle') {
                // darkMode manages its own active state
                toggleDarkMode(toggleSwitch);
            }
            return;
        }
        
        // Handle dropdown toggle button clicks
        if (e.target.closest('.btn-secondary[data-dropdown]')) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = e.target.closest('.dropdown');
            toggleDropdown(dropdown.id);
            return;
        }
        
        // Handle clicks inside dropdown menu - prevent closing
        if (e.target.closest('.dropdown-menu')) {
            // Allow radio buttons and labels to work normally
            if (e.target.matches('input[type="radio"]') || e.target.matches('label')) {
                // Let the event continue for radio buttons and labels
                return;
            }
            e.stopPropagation();
            return;
        }
        
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        }
    });
    
    // Prevent touch events from closing dropdown
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.dropdown-menu')) {
            e.stopPropagation();
        }
    }, { passive: false });
    
    // Handle grid layout changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('input[name="gridLayout"]')) {
            e.stopPropagation();
            const grid = document.getElementById('cameraGrid');
            grid.className = 'camera-grid ' + e.target.value;
            
            const fitToScreenToggle = document.getElementById('fitToScreenToggle');
            if (fitToScreenToggle && fitToScreenToggle.classList.contains('active')) {
                adjustGridForFitToScreen();
            }
        }
    });
}

// Toggle Dropdown function
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const isOpen = dropdown.classList.contains('active');
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
    });
    
    // Open clicked dropdown if it was closed
    if (!isOpen) {
        dropdown.classList.add('active');
    }
}

// Handle toggle switch changes
function handleToggleSwitch(element, type) {
    const isActive = element.classList.contains('active');
    
    if (type === 'cameraNames') {
        if (isActive) {
            document.body.classList.remove('hide-camera-names');
            localStorage.setItem('showCameraNames', 'true');
        } else {
            document.body.classList.add('hide-camera-names');
            localStorage.setItem('showCameraNames', 'false');
        }
    } else if (type === 'timestamps') {
        if (isActive) {
            document.body.classList.remove('hide-timestamps');
            localStorage.setItem('showTimestamps', 'true');
        } else {
            document.body.classList.add('hide-timestamps');
            localStorage.setItem('showTimestamps', 'false');
        }
    } else if (type === 'projectNames') {
        if (isActive) {
            document.body.classList.remove('hide-project-names');
            localStorage.setItem('showProjectNames', 'true');
        } else {
            document.body.classList.add('hide-project-names');
            localStorage.setItem('showProjectNames', 'false');
        }
    }
}

// Streaming Toggle
let isStreaming = false;

// Updated streaming toggle to handle videos without autoplay
function toggleStreaming() {
    const btn = document.getElementById('streamToggle');
    const btnText = document.getElementById('streamText');
    const btnIcon = document.getElementById('streamIcon');
    const videos = document.querySelectorAll('.camera-video');
    
    isStreaming = !isStreaming;
    
    if (isStreaming) {
        btnText.textContent = 'Stop All Streams';
        btnIcon.innerHTML = '<rect x="5" y="5" width="10" height="10" fill="currentColor" stroke="none" rx="2" />';
        btn.classList.add('streaming');
        
        // Play all videos and update their control buttons
        videos.forEach(video => {
            const loading = video.parentElement.querySelector('.camera-loading');
            if (loading) loading.classList.add('active');

            video.play().then(() => {
                if (loading) loading.classList.remove('active');
            }).catch(err => {
                if (loading) loading.classList.remove('active');
                console.error('Failed to play video:', err);
            });

            const controlBtn = video.parentElement.querySelector('.video-controls button[data-action="startLiveView"]');
            const fullscreenControlBtn = video.parentElement.querySelector('.fullscreen-controls button[data-action="startLiveView"]');
            
            [controlBtn, fullscreenControlBtn].forEach(btn => {
                if (btn) {
                    const iconSize = btn.classList.contains('fullscreen-control-btn') ? '' : 'icon-sm';
                    btn.innerHTML = `
                        <svg class="icon ${iconSize}" viewBox="0 0 20 20">
                            <rect x="6" y="5" width="3" height="10" fill="currentColor" stroke="none" />
                            <rect x="11" y="5" width="3" height="10" fill="currentColor" stroke="none" />
                        </svg>
                    `;
                    btn.setAttribute('data-action', 'pauseLiveView');
                    btn.setAttribute('title', 'Pause Live View');
                }
            });
            
            // Update status to Live
            const statusText = video.parentElement.querySelector('.camera-status span');
            if (statusText && statusText.textContent.includes('Video')) {
                statusText.textContent = 'Video • Live';
            }
        });
    } else {
        btnText.textContent = 'Start All Streams';
        btnIcon.innerHTML = '<polygon points="7,5 7,15 15,10" fill="currentColor" stroke="none" />';
        btn.classList.remove('streaming');
        
        // Pause all videos and update their control buttons
        videos.forEach(video => {
            video.pause();
            const controlBtn = video.parentElement.querySelector('.video-controls button[data-action="pauseLiveView"]');
            const fullscreenControlBtn = video.parentElement.querySelector('.fullscreen-controls button[data-action="pauseLiveView"]');
            
            [controlBtn, fullscreenControlBtn].forEach(btn => {
                if (btn) {
                    const iconSize = btn.classList.contains('fullscreen-control-btn') ? '' : 'icon-sm';
                    btn.innerHTML = `
                        <svg class="icon ${iconSize}" viewBox="0 0 20 20">
                            <polygon points="7,5 7,15 15,10" fill="currentColor" stroke="none" />
                        </svg>
                    `;
                    btn.setAttribute('data-action', 'startLiveView');
                    btn.setAttribute('title', 'Start Live View');
                }
            });
            
            // Update status to Paused
            const statusText = video.parentElement.querySelector('.camera-status span');
            if (statusText && statusText.textContent.includes('Video')) {
                statusText.textContent = 'Video • Paused';
            }
        });
    }
}

// Update timestamps
function updateTimestamps() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substr(0, 19);
    
    document.querySelectorAll('.camera-details p:last-child').forEach(timestamp => {
        if (!timestamp.textContent.includes('Last seen')) {
            timestamp.textContent = timeString;
        }
    });
}

// Handle window resize
let resizeTimeout;

window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close all dropdowns and remove backdrop on resize
        document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
        });
        
        // Cancel any active touch drag
        if (isDraggingTouch) {
            endTouchDrag();
        }
        
        // Clear any touch timeout
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            touchTimeout = null;
        }
        
        // Adjust grid if fit-to-screen is active
        const fitToScreenToggle = document.getElementById('fitToScreenToggle');
        if (fitToScreenToggle && fitToScreenToggle.classList.contains('active')) {
            adjustGridForFitToScreen();
        }
    }, 250);
});