// Projects and Camera Data
const projectsData = {
    'downtown-tower': {
        name: 'Downtown Tower',
        cameras: [
            { id: 'dt-001', name: 'North Entrance', status: 'online', battery: 85, type: 'video' },
            { id: 'dt-002', name: 'Loading Dock', status: 'online', battery: 92, type: 'image' },
            { id: 'dt-003', name: 'East Perimeter', status: 'offline', battery: 12, type: 'image' },
            { id: 'dt-004', name: 'South Gate', status: 'online', battery: 78, type: 'video' },
            { id: 'dt-005', name: 'Parking Area', status: 'online', battery: 65, type: 'image' },
            { id: 'dt-006', name: 'Main Lobby', status: 'online', battery: 88, type: 'video' },
            { id: 'dt-007', name: 'Elevator Bank', status: 'maintenance', battery: 45, type: 'image' },
            { id: 'dt-008', name: 'Roof Access', status: 'online', battery: 72, type: 'video' }
        ]
    },
    'riverside-complex': {
        name: 'Riverside Complex',
        cameras: [
            { id: 'rc-001', name: 'Crane Platform', status: 'online', battery: 67, type: 'video' },
            { id: 'rc-002', name: 'Foundation Area', status: 'online', battery: 89, type: 'image' },
            { id: 'rc-003', name: 'Material Storage', status: 'online', battery: 56, type: 'video' },
            { id: 'rc-004', name: 'River View', status: 'offline', battery: 23, type: 'image' },
            { id: 'rc-005', name: 'Access Road', status: 'online', battery: 91, type: 'video' },
            { id: 'rc-006', name: 'Worker Entrance', status: 'online', battery: 74, type: 'image' },
            { id: 'rc-007', name: 'Concrete Plant', status: 'online', battery: 82, type: 'video' },
            { id: 'rc-008', name: 'Dock Area', status: 'maintenance', battery: 34, type: 'image' },
            { id: 'rc-009', name: 'Security Gate', status: 'online', battery: 95, type: 'video' },
            { id: 'rc-010', name: 'Equipment Yard', status: 'online', battery: 61, type: 'image' },
            { id: 'rc-011', name: 'Building A Site', status: 'online', battery: 79, type: 'video' },
            { id: 'rc-012', name: 'Building B Site', status: 'online', battery: 86, type: 'image' }
        ]
    },
    'industrial-park-b': {
        name: 'Industrial Park B',
        cameras: [
            { id: 'ipb-001', name: 'Main Entrance', status: 'online', battery: 93, type: 'video' },
            { id: 'ipb-002', name: 'Warehouse 1', status: 'online', battery: 77, type: 'image' },
            { id: 'ipb-003', name: 'Warehouse 2', status: 'online', battery: 84, type: 'video' },
            { id: 'ipb-004', name: 'Loading Bay A', status: 'offline', battery: 18, type: 'image' },
            { id: 'ipb-005', name: 'Loading Bay B', status: 'online', battery: 69, type: 'video' },
            { id: 'ipb-006', name: 'Admin Building', status: 'online', battery: 91, type: 'image' },
            { id: 'ipb-007', name: 'Parking Lot 1', status: 'online', battery: 58, type: 'video' },
            { id: 'ipb-008', name: 'Parking Lot 2', status: 'maintenance', battery: 42, type: 'image' },
            { id: 'ipb-009', name: 'Security Office', status: 'online', battery: 87, type: 'video' },
            { id: 'ipb-010', name: 'Fire Station', status: 'online', battery: 76, type: 'image' },
            { id: 'ipb-011', name: 'Power Substation', status: 'online', battery: 94, type: 'video' },
            { id: 'ipb-012', name: 'Water Treatment', status: 'online', battery: 83, type: 'image' },
            { id: 'ipb-013', name: 'Waste Management', status: 'offline', battery: 15, type: 'video' },
            { id: 'ipb-014', name: 'Perimeter North', status: 'online', battery: 70, type: 'image' },
            { id: 'ipb-015', name: 'Perimeter South', status: 'online', battery: 62, type: 'video' }
        ]
    },
    'metro-station': {
        name: 'Metro Station',
        cameras: [
            { id: 'ms-001', name: 'Platform A', status: 'online', battery: 89, type: 'video' },
            { id: 'ms-002', name: 'Platform B', status: 'online', battery: 76, type: 'video' },
            { id: 'ms-003', name: 'Concourse', status: 'online', battery: 92, type: 'image' },
            { id: 'ms-004', name: 'Escalator Area', status: 'maintenance', battery: 38, type: 'video' },
            { id: 'ms-005', name: 'Ticket Hall', status: 'online', battery: 85, type: 'image' },
            { id: 'ms-006', name: 'Emergency Exit', status: 'online', battery: 71, type: 'video' }
        ]
    },
    'harbor-development': {
        name: 'Harbor Development',
        cameras: [
            { id: 'hd-001', name: 'Pier 1', status: 'online', battery: 81, type: 'video' },
            { id: 'hd-002', name: 'Pier 2', status: 'online', battery: 74, type: 'image' },
            { id: 'hd-003', name: 'Marina Office', status: 'online', battery: 96, type: 'video' },
            { id: 'hd-004', name: 'Fuel Station', status: 'offline', battery: 27, type: 'image' },
            { id: 'hd-005', name: 'Boat Ramp', status: 'online', battery: 63, type: 'video' },
            { id: 'hd-006', name: 'Parking Area', status: 'online', battery: 88, type: 'image' },
            { id: 'hd-007', name: 'Restaurant Deck', status: 'online', battery: 79, type: 'video' },
            { id: 'hd-008', name: 'Lighthouse', status: 'maintenance', battery: 51, type: 'image' },
            { id: 'hd-009', name: 'Breakwater', status: 'online', battery: 67, type: 'video' },
            { id: 'hd-010', name: 'Harbor Master', status: 'online', battery: 90, type: 'image' }
        ]
    }
};

// Pool of valid construction site images from Unsplash
const constructionImagePool = [
    'photo-1504917595217-d4dc5ebe6122', // Construction site aerial view
    'photo-1541888946425-d81bb19240f5', // Construction workers
    'photo-1503387762-592deb58ef4e', // Building crane
    'photo-1581094271901-8022df4466f9', // Construction materials
    'photo-1590736969955-71cc94901144', // Construction site overview
    'photo-1572981779307-38b8cabb2407', // Construction machinery
    'photo-1604709177225-055f99402ea3', // Construction progress
    'photo-1578662996442-48f60103fc96', // Building construction
    'photo-1531834685032-c34bf0d84c77', // Construction framework
    'photo-1574359411659-15573a27fd0c'  // Construction equipment
];

// Configuration for image source
const imageConfig = {
    source: 'local',
    localPath: './images/cameras/',
    fallbackImage: 'placeholder.jpg'
};

// Function to get image URL based on configuration
function getCameraImageUrl(cameraId, cameraName) {
    if (imageConfig.source === 'local') {
        // Use local image - you can customize the naming convention
        // Option 1: Use camera ID (e.g., dt-001.jpg)
        //return `${imageConfig.localPath}${cameraId}.jpg`;
        
        // Option 2: Use camera name (e.g., north-entrance.jpg)
        // const safeName = cameraName.toLowerCase().replace(/\s+/g, '-');
        // return `${imageConfig.localPath}${safeName}.jpg`;
        
        // Option 3: Use random numbered images (e.g., construction-01.jpg)
        const randomNum = Math.floor(Math.random() * 10) + 1;
        return `${imageConfig.localPath}construction-${randomNum.toString().padStart(2, '0')}.jpg`;
    } else {
        // Use Unsplash with a pool of valid construction images
        const randomImage = constructionImagePool[Math.floor(Math.random() * constructionImagePool.length)];
        return `https://images.unsplash.com/${randomImage}?w=800&h=450&fit=crop&q=80&fm=jpg`;
    }
}