alert("Hello World, this is the output.js file");

const container = document.getElementById('three-render');

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight, false);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(2, 2, 3);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(3, 3, 3);
scene.add(dir);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x4e9af1, roughness: 0.4, metalness: 0.1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

function tick() {
  const t = performance.now() * 0.001;
  cube.rotation.x = t * 0.4;
  cube.rotation.y = t * 0.6;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
onResize();
tick();

const Peer = require('peer');
const peer = new Peer('output1'); // fixed ID for output
peer.on('open', id => console.log('Output ready as', id));