// js/main.js
// Main Application File

// Event delegation for all button actions
document.addEventListener('click', function(e) {
    // Get the action from the closest element with data-action
    const actionElement = e.target.closest('[data-action]');
    if (!actionElement) return;
    
    const action = actionElement.getAttribute('data-action');
    
    switch(action) {
        case 'toggleFullscreen':
            e.preventDefault();
            toggleFullscreen(actionElement);
            break;
            
        case 'exitFullscreen':
            e.preventDefault();
            exitFullscreen(actionElement);
            break;
            
        case 'startLiveView':
            e.preventDefault();
            startLiveView(actionElement);
            break;
            
        case 'pauseLiveView':
            e.preventDefault();
            pauseLiveView(actionElement);
            break;
            
        case 'removeCamera':
            e.preventDefault();
            removeCamera(actionElement);
            break;
            
        case 'openCameraView':
            e.preventDefault();
            const cameraCard = actionElement.closest('.camera-card');
            const cameraId = cameraCard.dataset.cameraId;
            window.open(`/camera/${cameraId}`, '_blank');
            break;
            
        case 'openCameraSelection':
            e.preventDefault();
            openCameraSelection();
            break;
            
        case 'closeCameraSelection':
            e.preventDefault();
            closeCameraSelection();
            break;
            
        case 'addSelectedCameras':
            e.preventDefault();
            addSelectedCameras();
            break;
            
        case 'selectAllProjectCameras':
            e.preventDefault();
            const projectId = actionElement.dataset.project;
            selectAllProjectCameras(projectId);
            break;
    }
});

// Handle streaming toggle separately
document.getElementById('streamToggle').addEventListener('click', function(e) {
    e.preventDefault();
    toggleStreaming();
});

// Enhanced Project Selection Event Handlers
document.addEventListener('click', function(e) {
    // Handle project checkbox changes
    if (e.target.classList.contains('project-checkbox')) {
        const projectId = e.target.dataset.project;
        toggleProjectSelection(projectId);
        return;
    }
    
    // Handle project content click (show/hide cameras without selection)
    if (e.target.closest('.project-content')) {
        const projectContent = e.target.closest('.project-content');
        const projectId = projectContent.dataset.project;
        const checkbox = document.querySelector(`.project-checkbox[data-project="${projectId}"]`);
        
        // Only toggle visibility if checkbox is not checked
        if (!checkbox.checked) {
            checkbox.checked = true;
            toggleProjectSelection(projectId);
        }
        return;
    }
    
    // Handle "All" button for individual projects
    if (e.target.classList.contains('project-select-all')) {
        e.preventDefault();
        const projectId = e.target.dataset.project;
        const checkbox = document.querySelector(`.project-checkbox[data-project="${projectId}"]`);
        
        // Ensure project is selected first
        if (!checkbox.checked) {
            checkbox.checked = true;
            toggleProjectSelection(projectId);
        }
        
        selectAllProjectCameras(projectId);
        return;
    }
    
    // Handle "Select All Projects" button
    if (e.target.id === 'selectAllProjectsBtn') {
        e.preventDefault();
        selectAllProjects();
        return;
    }
});

// Close modal when clicking outside
document.getElementById('cameraSelectionModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCameraSelection();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Handle Escape key
    if (e.key === 'Escape') {
        // Close fullscreen
        const fullscreenCard = document.querySelector('.camera-card.fullscreen');
        if (fullscreenCard) {
            fullscreenCard.classList.remove('fullscreen');
            document.body.style.overflow = '';
            // Re-enable drag functionality
            fullscreenCard.setAttribute('draggable', 'true');
        }
        
        // Close dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
        });
        
        // Close modal
        const modal = document.getElementById('cameraSelectionModal');
        if (modal.classList.contains('active')) {
            closeCameraSelection();
        }
    }
    
    // Handle Ctrl/Cmd + A for camera selection modal
    const modal = document.getElementById('cameraSelectionModal');
    if (modal.classList.contains('active')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            selectAllProjects();
        }
    }
});

// Video event listeners
document.addEventListener('loadeddata', function(e) {
    if (e.target.classList.contains('camera-video')) {
        const loading = e.target.parentElement.querySelector('.camera-loading');
        if (loading && loading.classList.contains('active')) {
            loading.classList.remove('active');
        }
    }
}, true);

document.addEventListener('error', function(e) {
    if (e.target.classList.contains('camera-video')) {
        const loading = e.target.parentElement.querySelector('.camera-loading');
        if (loading && loading.classList.contains('active')) {
            loading.classList.remove('active');
        }
        
        // Show error state
        const placeholder = document.createElement('div');
        placeholder.className = 'camera-placeholder';
        placeholder.innerHTML = `
            <div style="text-align: center; color: var(--color-error-500);">
                <svg class="icon icon-lg" viewBox="0 0 24 24" style="margin-bottom: var(--spacing-2);">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8V12M12 16H12.01" />
                </svg>
                <p>Failed to load video</p>
            </div>
        `;
        e.target.style.display = 'none';
        e.target.parentElement.appendChild(placeholder);
    } else if (e.target.classList.contains('camera-media')) {
        const loading = e.target.parentElement.querySelector('.camera-loading');
        if (loading && loading.classList.contains('active')) {
            loading.classList.remove('active');
        }
        
        e.target.style.display = 'none';
        
        // Show error placeholder with image icon for image cameras
        const placeholder = document.createElement('div');
        placeholder.className = 'camera-placeholder';
        placeholder.innerHTML = `
            <svg class="icon icon-lg" style="opacity: 0.15;" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15L16 10L5 21" />
            </svg>
        `;
        e.target.parentElement.appendChild(placeholder);
    }
}, true);

document.addEventListener('load', function(e) {
    if (e.target.classList.contains('camera-media')) {
        const loading = e.target.parentElement.querySelector('.camera-loading');
        if (loading && loading.classList.contains('active')) {
            loading.classList.remove('active');
        }
    }
}, true);

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    // Update toggle state on load
    if (savedTheme === 'light') {
        document.getElementById('darkModeToggle').classList.remove('active');
    }
    
    // Setup dropdown event handlers
    setupDropdownEventHandlers();
    
    // Initialize drag and drop
    initializeDragAndDrop();
    
    // Restore camera configuration
    restoreCameraOrder();
    
    // Restore fit-to-screen state
    const savedFitToScreen = localStorage.getItem('fitToScreen');
    if (savedFitToScreen === 'true') {
        const fitToggle = document.getElementById('fitToScreenToggle');
        if (fitToggle) {
            fitToggle.classList.add('active');
            document.querySelector('.content-area').classList.add('fit-to-screen');
            adjustGridForFitToScreen();
        }
    }

    // Restore toggle states
    const showProjectNames = localStorage.getItem('showProjectNames');
    if (showProjectNames === 'false') {
        document.body.classList.add('hide-project-names');
        const toggle = document.getElementById('showProjectNamesToggle');
        if (toggle) toggle.classList.remove('active');
    }

    const showCameraNames = localStorage.getItem('showCameraNames');
    if (showCameraNames === 'false') {
        document.body.classList.add('hide-camera-names');
        const toggle = document.getElementById('showCameraNamesToggle');
        if (toggle) toggle.classList.remove('active');
    }

    const showTimestamps = localStorage.getItem('showTimestamps');
    if (showTimestamps === 'false') {
        document.body.classList.add('hide-timestamps');
        const toggle = document.getElementById('showTimestampsToggle');
        if (toggle) toggle.classList.remove('active');
    }
    
    // Update the initial video control buttons to show play state
    document.querySelectorAll('.camera-video').forEach(video => {
        const controlBtn = video.parentElement.querySelector('.video-controls button[data-action="startLiveView"]');
        const fullscreenControlBtn = video.parentElement.querySelector('.fullscreen-controls button[data-action="startLiveView"]');
        
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
        
        // Update status to indicate not live
        const statusText = video.parentElement.querySelector('.camera-status span');
        if (statusText && statusText.textContent === 'Live') {
            statusText.textContent = 'Video • Paused';
        }
    });
    
    // Update timestamps every second
    setInterval(updateTimestamps, 1000);
});