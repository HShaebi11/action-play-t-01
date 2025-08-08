// Three.js Scene Setup Function
function setupThreeJSScene(containerId = 'three-render') {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found. Please create a div with id="' + containerId + '"');
        return;
    }

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

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the cube
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

    // Start animation
    animate();

    // Return the scene objects for external access
    return {
        scene,
        camera,
        renderer,
        cube,
        controls,
        animate
    };
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
