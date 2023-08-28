import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let rotationDeltaX = 0;
let scrollDeltaY = 0;
let rotationSpeedX = 0;
let scrollSpeedY = 0;

function setupScene(sceneWidth, sceneHeight, backgroundColor, mouseDrag, cameraPosition, container) {
  const scene = new THREE.Scene();

  const aspectRatio = sceneWidth / sceneHeight;

  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = mouseDrag;

  renderer.setSize(sceneWidth, sceneHeight);
  container.appendChild(renderer.domElement);

  camera.position.z = cameraPosition.z;
  camera.position.y = cameraPosition.y;
  camera.position.x = cameraPosition.x;

  scene.background = new THREE.Color(backgroundColor);

  // const axesHelper = new THREE.AxesHelper( 180 );
  // scene.add( axesHelper );

  window.addEventListener('resize', () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
  });

  return { scene, camera, renderer, controls };
}

function loadModel(scene, pathToObj) {
  const loader = new GLTFLoader();
  loader.load(pathToObj, (object) => {

      const model = object.scene;
      scene.add(model);

  });
}

function setupMouseMove(scene, dragSpeed, rotationAngles) {
  let previousMouseX = 0;

  document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientY;

    if (previousMouseX !== 0) {
        const deltaX = mouseX - previousMouseX;
        rotationDeltaX += deltaX;
        rotationSpeedX = deltaX * dragSpeed;
        scene.rotation.x += rotationSpeedX;

        if (scene.rotation.x > rotationAngles.right) {
            scene.rotation.x = rotationAngles.right;
        } else if (scene.rotation.x < rotationAngles.left) {
            scene.rotation.x = rotationAngles.left;
        }
    }

    previousMouseX = mouseX;
});

  
}

function setupScrollRotation(scene, scrollSpeed) {
  let previousScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - previousScrollY;

    scrollDeltaY += deltaY;
    scrollSpeedY = deltaY * scrollSpeed;
    scene.rotation.y += scrollSpeedY;

    previousScrollY = currentScrollY;
});
}

function addLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
  scene.add(ambientLight);

  const directionalLightRT = new THREE.DirectionalLight(0xffffff, 2);
  directionalLightRT.position.set(0.1, 0.7, -1.5); 
  const directionalLightRB = new THREE.DirectionalLight(0xffffff, 2);
  directionalLightRB.position.set(-1.5, 0.7, -1.7);
  const directionalLightLT = new THREE.DirectionalLight(0xffffff, 2);
  directionalLightLT.position.set(0.1, -1, -0.4); 
  const directionalLightLB = new THREE.DirectionalLight(0xffffff, 2);
  directionalLightLB.position.set(-0.1, -1, -0.4);

  scene.add(directionalLightRT);
  scene.add(directionalLightRB);
  scene.add(directionalLightLT);
  scene.add(directionalLightLB);

}

function animateScene(scene, controls, camera, renderer) {
  function animate() {
      requestAnimationFrame(animate);

      // Gradually slow down rotation
      rotationSpeedX *= 0.98; // Adjust the factor as needed
      scrollSpeedY *= 0.95;   // Adjust the factor as needed
      scene.rotation.x += rotationSpeedX;
      scene.rotation.y += scrollSpeedY;

      renderer.render(scene, camera);
      controls.update();
  }

  animate();
}



export function globeDraw(options = {}) {
  const {
      container = document.querySelector('body'),
      sceneWidth = container.offsetWidth,
      sceneHeight = container.offsetHeight,
      backgroundColor = '#2f3035',
      rotationAngles = {
          left: -Math.PI * 2,
          right: Math.PI * 2
      },
      mouseDrag = false,
      dragSpeed = 0.00008,
      scrollSpeed = 0.02,
      autoSpeed = 0,
      cameraPosition = {
          x: 0,
          y: 0,
          z: 1.2
      },
      pathToObj = '/winnery/winery.gltf'
  } = options;

  const { scene, camera, renderer, controls } = setupScene(sceneWidth, sceneHeight, backgroundColor, mouseDrag, cameraPosition, container);
  loadModel(scene, pathToObj);
  setupMouseMove(scene, dragSpeed, rotationAngles);
  addLights(scene);
  setupScrollRotation(scene, scrollSpeed);
  animateScene(scene, controls, camera, renderer);
}

globeDraw();