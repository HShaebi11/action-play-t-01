alert("Hello World, this is the output.js file");

const peer = new Peer('output1'); // fixed ID for output
peer.on('open', id => console.log('Output ready as', id));

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ======= Basic setup =======
const container = document.getElementById('three-root');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(5, 6, 4);
scene.add(key);

// Helpers
const grid = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
grid.position.y = -0.5;
scene.add(grid);
const axes = new THREE.AxesHelper(2);
scene.add(axes);

// Geometry — plane + cube
const planeGeo = new THREE.PlaneGeometry(20, 20);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1, metalness: 0 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({ color: 0x4da3ff, roughness: 0.4, metalness: 0.2 });
const cube = new THREE.Mesh(boxGeo, boxMat);
cube.castShadow = true;
scene.add(cube);

// Responsive sizing
function resize() {
  const { clientWidth: w, clientHeight: h } = container;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', resize);
resize();

// Animation loop
let spin = true;
let last = performance.now();
let frames = 0;
let fpsTimer = 0;
const statsEl = document.getElementById('stats');

function tick(now) {
  requestAnimationFrame(tick);
  const dt = (now - last) / 1000;
  last = now;

  // FPS counter
  frames++;
  fpsTimer += dt;
  if (fpsTimer >= 0.5 && statsEl) {
    const fps = Math.round(frames / fpsTimer);
    statsEl.textContent = fps + ' fps';
    frames = 0;
    fpsTimer = 0;
  }

  if (spin) {
    cube.rotation.y += dt * 0.8;
    cube.rotation.x += dt * 0.3;
  }

  controls.update();
  renderer.render(scene, camera);
}
requestAnimationFrame(tick);

// External hook for updates
window.updateCube = ({ x, y, z, rx, ry, rz, s } = {}) => {
  if (x !== undefined) cube.position.x = x;
  if (y !== undefined) cube.position.y = y;
  if (z !== undefined) cube.position.z = z;
  if (rx !== undefined) cube.rotation.x = rx;
  if (ry !== undefined) cube.rotation.y = ry;
  if (rz !== undefined) cube.rotation.z = rz;
  if (s !== undefined) cube.scale.setScalar(s);
};

// Toggle spin button
document.getElementById('toggleSpin')?.addEventListener('click', () => {
  spin = !spin;
});

// Reduce motion preference
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) spin = false;
mq.addEventListener?.('change', (e) => { if (e.matches) spin = false; });
