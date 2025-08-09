alert("Hello World, this is the output.js file");

const container = document.getElementById('three-render');
if (!container) {
  throw new Error('Element #three-render not found');
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
container.appendChild(renderer.domElement);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
scene.add(cube);

function resizeToContainer() {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(1, height);
  camera.updateProjectionMatrix();
}

resizeToContainer();

if (window.ResizeObserver) {
  new ResizeObserver(resizeToContainer).observe(container);
} else {
  window.addEventListener('resize', resizeToContainer);
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;
  renderer.render(scene, camera);
}
animate();

const Peer = require('peer');
const peer = new Peer('output1'); // fixed ID for output
peer.on('open', id => console.log('Output ready as', id));