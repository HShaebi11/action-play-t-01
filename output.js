alert("Hello World, this is the output.js file");

// Get container
const container = document.getElementById('three-render');

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(3, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 6, 4);
scene.add(directionalLight);

// Helpers
const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
gridHelper.position.y = -0.5;
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1, metalness: 0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// Cube
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x4da3ff, roughness: 0.4, metalness: 0.2 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.castShadow = true;
scene.add(cube);

// Responsive resize
function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);
onWindowResize();

// Animation loop
let spin = true;
let lastTime = performance.now();
let frameCount = 0;
let fpsAccumulator = 0;
const statsElement = document.getElementById('stats');

function animate(now) {
  requestAnimationFrame(animate);
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  // FPS counter
  frameCount++;
  fpsAccumulator += delta;
  if (fpsAccumulator >= 0.5 && statsElement) {
    const fps = Math.round(frameCount / fpsAccumulator);
    statsElement.textContent = fps + ' fps';
    frameCount = 0;
    fpsAccumulator = 0;
  }

  if (spin) {
    cube.rotation.y += delta * 0.8;
    cube.rotation.x += delta * 0.3;
  }

  controls.update();
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

// External update hook
window.updateCube = ({ x, y, z, rx, ry, rz, s } = {}) => {
  if (x !== undefined) cube.position.x = x;
  if (y !== undefined) cube.position.y = y;
  if (z !== undefined) cube.position.z = z;
  if (rx !== undefined) cube.rotation.x = rx;
  if (ry !== undefined) cube.rotation.y = ry;
  if (rz !== undefined) cube.rotation.z = rz;
  if (s !== undefined) cube.scale.setScalar(s);
};

// Toggle spin
document.getElementById('toggleSpin')?.addEventListener('click', () => {
  spin = !spin;
});

// Reduce motion
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) spin = false;
mediaQuery.addEventListener?.('change', (e) => { if (e.matches) spin = false; });

const peer = new Peer('output1'); // fixed ID for output
peer.on('open', id => console.log('Output ready as', id));