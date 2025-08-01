// js/drag-drop.js
// Drag and Drop Implementation

// Updated Drag and Drop for Camera Cards
let draggedElement = null;
let touchTimeout = null;
let touchStartX = 0;
let touchStartY = 0;
let isDraggingTouch = false;

function initializeDragAndDrop() {
    // Remove existing event listeners to avoid duplicates
    document.querySelectorAll('.camera-card').forEach(card => {
        // Clone the node to remove all event listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
    });
    
    // Add event listeners to all camera cards
    document.querySelectorAll('.camera-card').forEach(card => {
        // Desktop drag events
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);
        
        // Mobile touch events
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchCancel);
    });
}

// Desktop drag handlers
function handleDragStart(e) {
    // Don't allow dragging in fullscreen mode
    if (this.classList.contains('fullscreen')) {
        e.preventDefault();
        return;
    }
    
    // Don't start drag if clicking a control button
    const target = e.target;
    if (target.closest('.camera-remove-btn') || 
        target.closest('.video-control-btn') || 
        target.closest('.fullscreen-control-btn')) {
        e.preventDefault();
        return;
    }
    
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual feedback
    if (draggedElement !== this && !this.classList.contains('drag-over')) {
        this.style.transform = 'scale(0.95)';
        this.classList.add('drag-over');
    }
    
    return false;
}

function handleDragLeave(e) {
    this.style.transform = '';
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.style.transform = '';
    this.classList.remove('drag-over');
    
    if (draggedElement !== this) {
        swapElements(draggedElement, this);
    }
    
    return false;
}

// Mobile touch handlers
function handleTouchStart(e) {
    const card = this;
    
    // Don't allow dragging in fullscreen mode
    if (card.classList.contains('fullscreen')) {
        return;
    }
    
    // Don't start drag if touching a control button
    const target = e.target;
    if (target.closest('.camera-remove-btn') || 
        target.closest('.video-control-btn') || 
        target.closest('.fullscreen-control-btn')) {
        return;
    }
    
    // Store initial touch position
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    // Clear any existing timeout
    if (touchTimeout) {
        clearTimeout(touchTimeout);
    }
    
    // Set up long press detection
    touchTimeout = setTimeout(() => {
        // Check if user hasn't moved too much (allow small movements)
        if (!isDraggingTouch) {
            startTouchDrag(card, e);
        }
    }, 500); // 500ms long press
}

function handleTouchMove(e) {
    const card = this;
    
    // Calculate movement distance
    const moveX = Math.abs(e.touches[0].clientX - touchStartX);
    const moveY = Math.abs(e.touches[0].clientY - touchStartY);
    
    // If user moves more than 10px, cancel long press
    if ((moveX > 10 || moveY > 10) && !isDraggingTouch) {
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            touchTimeout = null;
        }
    }
    
    // Handle active dragging
    if (isDraggingTouch && draggedElement) {
        e.preventDefault(); // Prevent scrolling while dragging
        
        // Move the dragged element with touch
        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementBelow && elementBelow.closest('.camera-card') && 
            elementBelow.closest('.camera-card') !== draggedElement) {
            const targetCard = elementBelow.closest('.camera-card');
            
            // Visual feedback for drop target
            document.querySelectorAll('.camera-card').forEach(c => {
                if (c !== draggedElement) {
                    c.style.transform = 'scale(0.95)';
                }
            });
            targetCard.style.transform = 'scale(0.9)';
        }
    }
}

function handleTouchEnd(e) {
    // Clear long press timeout
    if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = null;
    }
    
    // Handle drop if dragging
    if (isDraggingTouch && draggedElement) {
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementBelow && elementBelow.closest('.camera-card')) {
            const targetCard = elementBelow.closest('.camera-card');
            if (targetCard !== draggedElement) {
                swapElements(draggedElement, targetCard);
            }
        }
        
        endTouchDrag();
    }
}

function handleTouchCancel(e) {
    if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = null;
    }
    
    if (isDraggingTouch) {
        endTouchDrag();
    }
}

function startTouchDrag(card, e) {
    isDraggingTouch = true;
    draggedElement = card;
    
    // Add drag indicator
    if (!card.querySelector('.drag-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'drag-indicator';
        indicator.textContent = 'Hold to drag';
        card.appendChild(indicator);
    }
    
    // Visual feedback
    card.classList.add('drag-ready');
    
    // Update indicator text after animation
    setTimeout(() => {
        if (isDraggingTouch) {
            card.classList.add('dragging');
            const indicator = card.querySelector('.drag-indicator');
            if (indicator) {
                indicator.textContent = 'Drag to reorder';
            }
        }
    }, 300); // Add dragging class after wiggle animation
    
    document.getElementById('cameraGrid').classList.add('drag-active');
    
    // Haptic feedback if available
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
    
    // Prevent default touch behavior
    e.preventDefault();
}

function endTouchDrag() {
    isDraggingTouch = false;
    
    if (draggedElement) {
        draggedElement.classList.remove('drag-ready', 'dragging');
        const indicator = draggedElement.querySelector('.drag-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Reset all cards
    document.querySelectorAll('.camera-card').forEach(card => {
        card.style.transform = '';
        card.classList.remove('drag-over');
    });
    
    document.getElementById('cameraGrid').classList.remove('drag-active');
    draggedElement = null;
}

function swapElements(elem1, elem2) {
    const parent = elem1.parentNode;
    const elem1Index = Array.from(parent.children).indexOf(elem1);
    const elem2Index = Array.from(parent.children).indexOf(elem2);
    
    if (elem1Index < elem2Index) {
        parent.insertBefore(elem1, elem2.nextSibling);
    } else {
        parent.insertBefore(elem1, elem2);
    }
    
    // Save the new order to localStorage
    saveCameraOrder();
}

// Prevent scrolling while dragging
document.addEventListener('touchmove', function(e) {
    if (isDraggingTouch) {
        e.preventDefault();
    }
}, { passive: false });