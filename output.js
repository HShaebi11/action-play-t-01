"use strict";

// Minimal Three.js scene with a green cube (no OrbitControls)
// Loads Three.js from CDN to avoid local dependencies

function loadThreeFromCdn() {
  return new Promise((resolve, reject) => {
    if (window.THREE) {
      resolve(window.THREE);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.161.0/build/three.min.js";
    script.async = true;
    script.onload = () => resolve(window.THREE);
    script.onerror = () => reject(new Error("Failed to load three.min.js"));
    document.head.appendChild(script);
  });
}

function start(THREE) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Ensure page has no margin so canvas fills the window
  document.body.style.margin = "0";
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 2;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.015;
    renderer.render(scene, camera);
  }

  animate();
}

window.addEventListener("DOMContentLoaded", () => {
  loadThreeFromCdn()
    .then(start)
    .catch((err) => console.error(err));
});