// Three.js Scene Setup Function with Peer.js Integration
function setupThreeJSScene(containerId = 'three-render') {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found. Please create a div with id="' + containerId + '"');
        return;
    }

    // Create UI elements for Peer.js connection
    const uiContainer = document.createElement('div');
    uiContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 15px;
        border-radius: 8px;
        color: white;
        font-family: Arial, sans-serif;
        z-index: 1000;
        min-width: 200px;
    `;

    // Create Peer ID display
    const peerIdDisplay = document.createElement('div');
    peerIdDisplay.id = 'peer-id-display';
    peerIdDisplay.style.marginBottom = '10px';
    peerIdDisplay.innerHTML = 'Select your device:';
    uiContainer.appendChild(peerIdDisplay);

    // Create connection status display
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'connection-status';
    statusDisplay.style.marginTop = '10px';
    statusDisplay.innerHTML = 'Status: Not connected';
    uiContainer.appendChild(statusDisplay);

    // Add to document
    document.body.appendChild(uiContainer);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        container.clientWidth / container.clientHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff88,
        shininess: 100
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Camera controls (if OrbitControls is available)
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
    }

    // Peer.js Integration
    let peer = null;
    let connection = null;
    
    // Function to get position values from DOM elements
    function getPositionValues() {
        const posX = document.getElementById('position-x');
        const posY = document.getElementById('position-y');
        const posZ = document.getElementById('position-z');
        
        let x = 0, y = 0, z = 0;
        
        if (posX) {
            x = parseFloat(posX.value || posX.textContent || 0);
        }
        if (posY) {
            y = parseFloat(posY.value || posY.textContent || 0);
        }
        if (posZ) {
            z = parseFloat(posZ.value || posZ.textContent || 0);
        }
        
        return { x, y, z };
    }

    // Function to update cube position
    function updateCubePosition() {
        const position = getPositionValues();
        cube.position.set(position.x, position.y, position.z);
    }

    // Function to initialize Peer.js with hardcoded IDs
    function initPeerJS() {
        try {
            // Create radio buttons for device selection
            const deviceSelector = document.createElement('div');
            deviceSelector.style.marginBottom = '10px';
            deviceSelector.innerHTML = `
                <label style="margin-right: 10px;">
                    <input type="radio" name="device" value="mac" checked> Mac
                </label>
                <label>
                    <input type="radio" name="device" value="phone"> Phone
                </label>
            `;
            uiContainer.insertBefore(deviceSelector, peerIdDisplay);

            // Create connect button
            const connectButton = document.createElement('button');
            connectButton.textContent = 'Connect Devices';
            connectButton.style.cssText = `
                padding: 5px 10px;
                background: #4CAF50;
                border: none;
                border-radius: 3px;
                color: white;
                cursor: pointer;
                margin-top: 10px;
                width: 100%;
            `;
            uiContainer.appendChild(connectButton);

            // Initialize peer based on device selection
            connectButton.onclick = function() {
                const isMac = document.querySelector('input[name="device"][value="mac"]').checked;
                const peerId = isMac ? 'mac-device' : 'phone-device';
                const connectTo = isMac ? 'phone-device' : 'mac-device';

                // Create peer with specific ID
                peer = new Peer(peerId);
                
                peer.on('open', function(id) {
                    console.log('Peer.js connected with ID:', id);
                    peerIdDisplay.innerHTML = `Device: <strong>${isMac ? 'Mac' : 'Phone'}</strong>`;
                    statusDisplay.innerHTML = 'Status: Connecting to other device...';
                    
                    // Automatically connect to the other device
                    const conn = peer.connect(connectTo);
                    conn.on('open', function() {
                        connection = conn;
                        handleConnection(conn);
                    });
                });
            
            peer.on('error', function(err) {
                console.error('Peer.js error:', err);
                statusDisplay.innerHTML = `Status: Error - ${err.type}`;
            });
            
        } catch (error) {
            console.error('Peer.js not available:', error);
            statusDisplay.innerHTML = 'Status: Peer.js not available';
        }
    }

    // Function to handle peer connection
    function handleConnection(conn) {
        statusDisplay.innerHTML = 'Status: Connected!';
        
        conn.on('data', function(data) {
            if (data.type === 'position') {
                cube.position.set(data.x, data.y, data.z);
            }
        });

        conn.on('close', function() {
            statusDisplay.innerHTML = 'Status: Disconnected';
            connection = null;
        });
    }

    // Function to send position data
    function sendPositionData() {
        if (connection && connection.open) {
            const position = getPositionValues();
            connection.send({
                type: 'position',
                x: position.x,
                y: position.y,
                z: position.z
            });
        }
    }

    // Set up position monitoring
    function setupPositionMonitoring() {
        // Monitor position elements for changes
        const positionElements = ['position-x', 'position-y', 'position-z'];
        
        positionElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Listen for input changes
                if (element.tagName === 'INPUT') {
                    element.addEventListener('input', updateCubePosition);
                    element.addEventListener('change', updateCubePosition);
                }
                // Listen for content changes (for non-input elements)
                else {
                    const observer = new MutationObserver(updateCubePosition);
                    observer.observe(element, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }
            }
        });
        
        // Also update position on any click events (for Webflow interactions)
        document.addEventListener('click', function() {
            setTimeout(updateCubePosition, 100);
        });
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the cube (optional - you can comment this out if you want static rotation)
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Update controls if available
        if (controls) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Initialize Peer.js and position monitoring
    initPeerJS();
    setupPositionMonitoring();
    
    // Initial position update
    updateCubePosition();

    // Start animation
    animate();

    // Return the scene objects for external access
    return {
        scene,
        camera,
        renderer,
        cube,
        controls,
        animate,
        updateCubePosition,
        sendPositionData,
        peer,
        connection
    };
}

// Helper function to connect to another peer
function connectToPeer(peerId) {
    const scene = window.threeJSScene;
    if (scene && scene.peer) {
        const conn = scene.peer.connect(peerId);
        conn.on('open', function() {
            scene.connection = conn;
            console.log('Connected to peer:', peerId);
            
            conn.on('data', function(data) {
                if (data.type === 'position') {
                    scene.cube.position.set(data.x, data.y, data.z);
                }
            });
        });
    }
}

// Function to manually update cube position
function updateCubePositionManually(x, y, z) {
    const scene = window.threeJSScene;
    if (scene && scene.cube) {
        scene.cube.position.set(x, y, z);
    }
}

// Function to get current cube position
function getCubePosition() {
    const scene = window.threeJSScene;
    if (scene && scene.cube) {
        return {
            x: scene.cube.position.x,
            y: scene.cube.position.y,
            z: scene.cube.position.z
        };
    }
    return null;
}

// Alternative function for a more complex scene with multiple objects
function setupAdvancedThreeJSScene(containerId = 'three-render') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found. Please create a div with id="' + containerId + '"');
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6600, 1, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create multiple objects
    const objects = [];

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 0, 0);
    cube.castShadow = true;
    scene.add(cube);
    objects.push(cube);

    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0066 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);
    objects.push(sphere);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ color: 0x0066ff });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 0, 0);
    torus.castShadow = true;
    scene.add(torus);
    objects.push(torus);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Controls
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
    }

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotate objects
        objects.forEach((obj, index) => {
            obj.rotation.x += 0.01 * (index + 1);
            obj.rotation.y += 0.01 * (index + 1);
        });

        if (controls) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
    animate();

    return {
        scene,
        camera,
        renderer,
        objects,
        controls,
        animate
    };
}

// Utility function to create a simple scene with custom parameters
function createCustomScene(containerId, options = {}) {
    const {
        backgroundColor = 0x1a1a1a,
        objectColor = 0x00ff88,
        objectType = 'cube', // 'cube', 'sphere', 'torus'
        enableShadows = true,
        enableControls = true
    } = options;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found');
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    if (enableShadows) {
        directionalLight.castShadow = true;
    }
    scene.add(directionalLight);

    // Create object based on type
    let geometry, material, object;
    
    switch (objectType) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    material = new THREE.MeshPhongMaterial({ color: objectColor });
    object = new THREE.Mesh(geometry, material);
    
    if (enableShadows) {
        object.castShadow = true;
        object.receiveShadow = true;
    }
    
    scene.add(object);

    // Controls
    let controls = null;
    if (enableControls && typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
    }

    function animate() {
        requestAnimationFrame(animate);
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
        
        if (controls) {
            controls.update();
        }
        
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
    animate();

    return {
        scene,
        camera,
        renderer,
        object,
        controls,
        animate
    };
}

// Auto-initialize the Three.js scene when the page loads
function initThreeJS() {
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.threeJSScene = setupThreeJSScene();
        });
    } else {
        // DOM is already loaded
        window.threeJSScene = setupThreeJSScene();
    }
}

// Call the initialization function
initThreeJS();