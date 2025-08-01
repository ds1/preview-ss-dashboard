// js/camera-management.js
// Camera Management Functions

let selectedCameras = [];
let currentProject = 'downtown-tower';
let selectedProjects = new Set(); // Track selected projects

// Enhanced Camera Management Functions
function openCameraSelection() {
    const modal = document.getElementById('cameraSelectionModal');
    modal.classList.add('active');
    selectedCameras = [];
    selectedProjects.clear();
    
    // Reset all checkboxes
    document.querySelectorAll('.project-checkbox').forEach(cb => {
        cb.checked = false;
        cb.indeterminate = false;
    });
    
    // Clear camera container
    document.getElementById('availableCamerasContainer').innerHTML = '';
    
    updateSelectionSummary();
    updateAddButton();
    document.body.style.overflow = 'hidden';
    
    // Prevent iOS scroll bounce
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }
}

function closeCameraSelection() {
    const modal = document.getElementById('cameraSelectionModal');
    modal.classList.remove('active');
    selectedCameras = [];
    selectedProjects.clear();
    document.body.style.overflow = '';
    
    // Reset iOS scroll prevention
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// New function to handle project checkbox changes
function toggleProjectSelection(projectId) {
    const checkbox = document.querySelector(`.project-checkbox[data-project="${projectId}"]`);
    const projectItem = checkbox.closest('.project-item');
    
    if (checkbox.checked) {
        selectedProjects.add(projectId);
        projectItem.classList.add('viewing');
        showProjectCameras(projectId);
    } else {
        selectedProjects.delete(projectId);
        projectItem.classList.remove('viewing');
        hideProjectCameras(projectId);
        // Remove any selected cameras from this project
        selectedCameras = selectedCameras.filter(cam => {
            const project = Object.entries(projectsData).find(([key, proj]) => 
                proj.cameras.some(c => c.id === cam.id)
            );
            return project && project[0] !== projectId;
        });
    }
    
    updateProjectCheckboxState(projectId);
    updateSelectionSummary();
    updateAddButton();
}

// Show cameras for a selected project
function showProjectCameras(projectId) {
    const container = document.getElementById('availableCamerasContainer');
    const project = projectsData[projectId];
    
    if (!project) return;
    
    // Check if section already exists
    let section = container.querySelector(`[data-project-section="${projectId}"]`);
    if (section) return;
    
    // Create new section
    section = document.createElement('div');
    section.className = 'project-section';
    section.dataset.projectSection = projectId;
    
    // Get currently added camera IDs
    const addedCameraIds = Array.from(document.querySelectorAll('.camera-card')).map(card => 
        card.dataset.cameraId
    );
    
    section.innerHTML = `
        <div class="project-section-header">
            <h3>${project.name}</h3>
            <button class="btn-link" data-action="selectAllProjectCameras" data-project="${projectId}">
                Select All (${project.cameras.length})
            </button>
        </div>
        <div class="cameras-grid" data-project-grid="${projectId}">
            ${project.cameras.map(camera => {
                const isAdded = addedCameraIds.includes(camera.id);
                const isDisabled = camera.status === 'maintenance' || camera.status === 'offline';
                const isSelected = selectedCameras.some(c => c.id === camera.id);
                
                return `
                    <div class="camera-option ${isAdded ? 'disabled' : ''} ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                         data-camera-id="${camera.id}"
                         data-project="${projectId}">
                        <div class="camera-option-icon">
                            <svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                ${camera.type === 'video' ? 
                                    '<path d="M23 7L16 12L23 17V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/>' :
                                    '<rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="10" cy="10" r="3"/><path d="M21 15L15.5 9.5L10 15"/>'
                                }
                            </svg>
                        </div>
                        <div class="camera-option-name">${camera.name}</div>
                        <div class="camera-option-status">
                            ${isAdded ? 'Already added' : camera.status === 'online' ? 'Online' : camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
                            ${camera.status === 'online' ? ` • ${camera.battery}%` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.appendChild(section);
    
    // Add click handlers to camera options
    section.querySelectorAll('.camera-option:not(.disabled)').forEach(option => {
        option.addEventListener('click', function() {
            const cameraId = this.dataset.cameraId;
            const camera = project.cameras.find(c => c.id === cameraId);
            if (camera) {
                toggleCameraSelection(camera, projectId);
            }
        });
    });
}

// Hide cameras for a deselected project
function hideProjectCameras(projectId) {
    const section = document.querySelector(`[data-project-section="${projectId}"]`);
    if (section) {
        section.remove();
    }
}

// Enhanced camera selection toggle
function toggleCameraSelection(camera, projectId) {
    const index = selectedCameras.findIndex(c => c.id === camera.id);
    const cameraOption = document.querySelector(`[data-camera-id="${camera.id}"]`);
    
    if (index > -1) {
        selectedCameras.splice(index, 1);
        cameraOption.classList.remove('selected');
    } else {
        selectedCameras.push(camera);
        cameraOption.classList.add('selected');
    }
    
    updateProjectCheckboxState(projectId);
    updateSelectionSummary();
    updateAddButton();
}

// Update project checkbox state based on camera selections
function updateProjectCheckboxState(projectId) {
    const project = projectsData[projectId];
    const checkbox = document.querySelector(`.project-checkbox[data-project="${projectId}"]`);
    
    if (!project || !checkbox) return;
    
    const projectCameras = project.cameras.filter(cam => 
        cam.status === 'online' && !isAlreadyAdded(cam.id)
    );
    const selectedProjectCameras = selectedCameras.filter(cam => 
        project.cameras.some(pc => pc.id === cam.id)
    );
    
    if (selectedProjectCameras.length === 0) {
        checkbox.checked = false;
        checkbox.indeterminate = false;
    } else if (selectedProjectCameras.length === projectCameras.length) {
        checkbox.checked = true;
        checkbox.indeterminate = false;
    } else {
        checkbox.checked = false;
        checkbox.indeterminate = true;
    }
}

// Select all cameras from a project
function selectAllProjectCameras(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
    const addedCameraIds = Array.from(document.querySelectorAll('.camera-card')).map(card => 
        card.dataset.cameraId
    );
    
    project.cameras.forEach(camera => {
        if (camera.status === 'online' && !addedCameraIds.includes(camera.id)) {
            const existingIndex = selectedCameras.findIndex(c => c.id === camera.id);
            if (existingIndex === -1) {
                selectedCameras.push(camera);
            }
        }
    });
    
    // Update UI
    document.querySelectorAll(`[data-project-grid="${projectId}"] .camera-option:not(.disabled)`).forEach(option => {
        option.classList.add('selected');
    });
    
    updateProjectCheckboxState(projectId);
    updateSelectionSummary();
    updateAddButton();
}

// Select all projects and their cameras
function selectAllProjects() {
    Object.keys(projectsData).forEach(projectId => {
        const checkbox = document.querySelector(`.project-checkbox[data-project="${projectId}"]`);
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            selectedProjects.add(projectId);
            document.querySelector(`.project-item[data-project="${projectId}"]`).classList.add('viewing');
            showProjectCameras(projectId);
        }
        selectAllProjectCameras(projectId);
    });
}

// Update selection summary
function updateSelectionSummary() {
    const summary = document.getElementById('selectionSummary');
    const projectCount = selectedProjects.size;
    const cameraCount = selectedCameras.length;
    
    summary.textContent = `${projectCount} project${projectCount !== 1 ? 's' : ''}, ${cameraCount} camera${cameraCount !== 1 ? 's' : ''} selected`;
}

// Check if camera is already added
function isAlreadyAdded(cameraId) {
    return Array.from(document.querySelectorAll('.camera-card')).some(card => 
        card.dataset.cameraId === cameraId
    );
}

// Original functions below remain unchanged
function populateCamerasGrid(projectId) {
    const grid = document.getElementById('availableCamerasGrid');
    const project = projectsData[projectId];
    
    if (!project) return;
    
    // Get currently added camera IDs
    const addedCameraIds = Array.from(document.querySelectorAll('.camera-card')).map(card => 
        card.dataset.cameraId
    );
    
    grid.innerHTML = '';
    
    project.cameras.forEach(camera => {
        const isAdded = addedCameraIds.includes(camera.id);
        const isDisabled = camera.status === 'maintenance' || camera.status === 'offline';
        
        const cameraOption = document.createElement('div');
        cameraOption.className = `camera-option ${isAdded ? 'disabled' : ''} ${isDisabled ? 'disabled' : ''}`;
        cameraOption.dataset.cameraId = camera.id;
        
        if (!isAdded && !isDisabled) {
            cameraOption.addEventListener('click', () => toggleCameraSelection(camera));
        }
        
        cameraOption.innerHTML = `
            <div class="camera-option-icon">
                <svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    ${camera.type === 'video' ? 
                        '<path d="M23 7L16 12L23 17V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/>' :
                        '<rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="10" cy="10" r="3"/><path d="M21 15L15.5 9.5L10 15"/>'
                    }
                </svg>
            </div>
            <div class="camera-option-name">${camera.name}</div>
            <div class="camera-option-status">
                ${isAdded ? 'Already added' : camera.status === 'online' ? 'Online' : camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
                ${camera.status === 'online' ? ` • ${camera.battery}%` : ''}
            </div>
        `;
        
        grid.appendChild(cameraOption);
    });
}

function updateAddButton() {
    const addBtn = document.getElementById('addCamerasBtn');
    addBtn.disabled = selectedCameras.length === 0;
    addBtn.textContent = selectedCameras.length === 0 ? 'Add Selected' : 
                        selectedCameras.length === 1 ? 'Add 1 Camera' : 
                        `Add ${selectedCameras.length} Cameras`;
}

function addSelectedCameras() {
    const grid = document.getElementById('cameraGrid');
    const addCard = grid.querySelector('.add-camera-card');
    
    selectedCameras.forEach(camera => {
        const cameraCard = createCameraCard(camera);
        grid.insertBefore(cameraCard, addCard);
    });
    
    // Re-initialize drag and drop for new cards
    initializeDragAndDrop();
    saveCameraOrder();
    
    // Adjust grid if fit-to-screen is active
    const fitToScreenToggle = document.getElementById('fitToScreenToggle');
    if (fitToScreenToggle && fitToScreenToggle.classList.contains('active')) {
        adjustGridForFitToScreen();
    }
    
    closeCameraSelection();
}

function createCameraCard(camera) {
    const project = Object.values(projectsData).find(p => 
        p.cameras.some(c => c.id === camera.id)
    );
    
    const card = document.createElement('div');
    card.className = 'camera-card';
    card.draggable = true; // Always set draggable for desktop functionality
    
    card.dataset.cameraId = camera.id;
    card.dataset.project = Object.keys(projectsData).find(key => projectsData[key] === project);
    card.dataset.cameraName = camera.name;
    card.dataset.cameraType = camera.type;
    
    const mediaElement = camera.type === 'video' ? 
        `<video class="camera-video" muted loop playsinline preload="metadata" poster="${getCameraImageUrl(camera.id, camera.name)}">
            <source src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" type="video/mp4">
        </video>` :
        `<img class="camera-media" src="${getCameraImageUrl(camera.id, camera.name)}" alt="${camera.name}">`;
    
    const statusIndicatorClass = camera.status === 'online' ? '' : 'offline';
    const mediaIcon = camera.type === 'video' ? 
        `<path d="M23 7L16 12L23 17V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/>` :
        `<rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="10" cy="10" r="3"/><path d="M21 15L15.5 9.5L10 15"/>`;
    const statusText = camera.type === 'video' ? 'Video • Paused' : 'Image';
    const batteryColor = camera.battery < 30 ? 'var(--color-error-500)' : 'inherit';
    const batteryWidth = (camera.battery / 100) * 29; // 29px is inner width (32px - 3px for borders)
    
    // Only include play button for video cameras
    const playButton = camera.type === 'video' ? 
        `<button class="video-control-btn" data-action="startLiveView" title="Start Live View">
            <svg class="icon icon-sm" viewBox="0 0 20 20">
                <polygon points="7,5 7,15 15,10" fill="currentColor" stroke="none" />
            </svg>
        </button>` : '';
    
    const fullscreenPlayButton = (camera.type === 'video' && camera.status === 'online') ? 
        `<button class="fullscreen-control-btn" data-action="startLiveView" title="Start Live View">
            <svg class="icon" viewBox="0 0 20 20">
                <polygon points="7,5 7,15 15,10" fill="currentColor" stroke="none" />
            </svg>
        </button>` : '';
    
    card.innerHTML = `
        <div class="camera-feed">
            <button class="camera-remove-btn" data-action="removeCamera" title="Remove Camera">
                <svg class="icon icon-sm" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M6 6L14 14M6 14L14 6" />
                </svg>
            </button>
            
            ${mediaElement}
            
            <div class="camera-loading">
                <div class="loading-spinner"></div>
            </div>
            
            <div class="video-controls">
                ${playButton}
                <button class="video-control-btn" data-action="openCameraView" title="Open Camera View Page">
                    <svg class="icon icon-sm" viewBox="0 0 20 20">
                        <path d="M11 3H3C2.44772 3 2 3.44772 2 4V16C2 16.5523 2.44772 17 3 17H15C15.5523 17 16 16.5523 16 16V8" />
                        <path d="M9 11L17 3" />
                        <path d="M17 3H12M17 3V8" />
                    </svg>
                </button>
                <button class="video-control-btn" data-action="toggleFullscreen" title="Enter Fullscreen">
                    <svg class="icon icon-sm" viewBox="0 0 20 20">
                        <path d="M3 6V3H6M14 3H17V6M17 14V17H14M6 17H3V14" />
                    </svg>
                </button>
            </div>
            
            <div class="camera-overlay">
                <div class="camera-info">
                    <div class="camera-details">
                        <h3>
                            <span class="status-indicator ${statusIndicatorClass}"></span>
                            ${camera.name}
                        </h3>
                        <p>${project.name}</p>
                        <p style="font-size: 12px; opacity: 0.7;">2024-01-15 14:32:18</p>
                    </div>
                    <div class="camera-status">
                        <div class="status-row">
                            <svg class="icon icon-sm" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                ${mediaIcon}
                            </svg>
                            <span>${camera.status === 'online' ? statusText : 'Offline'}</span>
                        </div>
                        <div class="battery-indicator" style="color: ${batteryColor};">
                            <div class="battery-bar" style="border-color: ${batteryColor};">
                                <div class="battery-level" style="width: ${batteryWidth}px; background-color: ${batteryColor};"></div>
                                <div class="battery-cap" style="background-color: ${batteryColor};"></div>
                            </div>
                            <span>${camera.battery}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="fullscreen-controls">
                ${fullscreenPlayButton}
                <button class="fullscreen-control-btn" data-action="exitFullscreen" title="Exit Fullscreen">
                    <svg class="icon" viewBox="0 0 20 20">
                        <path d="M6 3V6H3M3 14V17H6M14 17H17V14M17 6V3H14" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function removeCamera(button) {
    const card = button.closest('.camera-card');
    card.remove();
    saveCameraOrder();
    
    // Adjust grid if fit-to-screen is active
    const fitToScreenToggle = document.getElementById('fitToScreenToggle');
    if (fitToScreenToggle && fitToScreenToggle.classList.contains('active')) {
        adjustGridForFitToScreen();
    }
}

// Video Controls
function toggleFullscreen(button) {
    const card = button.closest('.camera-card');
    card.classList.add('fullscreen');
    document.body.style.overflow = 'hidden';
    
    // Pause drag functionality in fullscreen
    card.setAttribute('draggable', 'false');
}

function exitFullscreen(button) {
    const card = button.closest('.camera-card');
    card.classList.remove('fullscreen');
    document.body.style.overflow = '';
    
    // Re-enable drag functionality
    card.setAttribute('draggable', 'true');
}

// Updated startLiveView function
function startLiveView(button) {
    const feed = button.closest('.camera-feed');
    const video = feed.querySelector('.camera-video');
    const statusText = feed.querySelector('.camera-status span');
    
    // Only start live view if there's already a video element
    if (!video) {
        // It's an image camera - do nothing
        return;
    }
    
    // Get both regular and fullscreen control buttons
    const regularControlBtn = feed.querySelector('.video-controls button[data-action="startLiveView"]');
    const fullscreenControlBtn = feed.querySelector('.fullscreen-controls button[data-action="startLiveView"]');
    
    // For video elements, just start playing
    const loading = feed.querySelector('.camera-loading');
    
    // Show loading spinner
    if (loading) loading.classList.add('active');
    
    // Set up load handlers
    const handleVideoReady = function() {
        if (loading) loading.classList.remove('active');
        statusText.textContent = 'Video • Live';
        
        // Update both control buttons
        [regularControlBtn, fullscreenControlBtn].forEach(btn => {
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
        
        // Remove event listeners
        video.removeEventListener('loadeddata', handleVideoReady);
        video.removeEventListener('canplay', handleVideoReady);
        video.removeEventListener('playing', handleVideoReady);
    };
    
    // Add event listeners
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('playing', handleVideoReady);
    
    // Start playing
    video.play().catch(err => {
        // Hide loading spinner on error
        if (loading) loading.classList.remove('active');
        console.error('Failed to play video:', err);
    });
}

function pauseLiveView(button) {
    const feed = button.closest('.camera-feed');
    const video = feed.querySelector('.camera-video');
    const statusText = feed.querySelector('.camera-status span');
    
    if (video) {
        video.pause();
        
        // Get both regular and fullscreen control buttons
        const regularControlBtn = feed.querySelector('.video-controls button[data-action="pauseLiveView"]');
        const fullscreenControlBtn = feed.querySelector('.fullscreen-controls button[data-action="pauseLiveView"]');
        
        // Update status to show paused
        statusText.textContent = 'Video • Paused';
        
        // Update both control buttons
        [regularControlBtn, fullscreenControlBtn].forEach(btn => {
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
    }
}

// Updated save camera configuration
function saveCameraOrder() {
    const cards = document.querySelectorAll('.camera-card');
    const cameras = Array.from(cards).map(card => ({
        id: card.dataset.cameraId,
        project: card.dataset.project,
        name: card.dataset.cameraName,
        type: card.dataset.cameraType
    }));
    localStorage.setItem('activeCameras', JSON.stringify(cameras));
}

// Updated restore camera configuration
function restoreCameraOrder() {
    const savedCameras = localStorage.getItem('activeCameras');
    if (savedCameras) {
        const cameras = JSON.parse(savedCameras);
        const grid = document.getElementById('cameraGrid');
        const addCard = grid.querySelector('.add-camera-card');
        
        // Remove existing camera cards (keep add card)
        grid.querySelectorAll('.camera-card').forEach(card => card.remove());
        
        // Add cameras from saved configuration
        cameras.forEach(savedCamera => {
            // Find camera data
            let cameraData = null;
            for (const [projectKey, project] of Object.entries(projectsData)) {
                const camera = project.cameras.find(c => c.id === savedCamera.id);
                if (camera) {
                    cameraData = camera;
                    break;
                }
            }
            
            if (cameraData) {
                const cameraCard = createCameraCard(cameraData);
                grid.insertBefore(cameraCard, addCard);
            }
        });
        
        // Re-initialize drag and drop
        initializeDragAndDrop();
        
        // Check if fit-to-screen should be applied
        const savedFitToScreen = localStorage.getItem('fitToScreen');
        if (savedFitToScreen === 'true') {
            adjustGridForFitToScreen();
        }
    }
}