/// <reference path="typings/tsd.d.ts" />
//Step 1 Create All Aliasies for scene
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var CubeGeometry = THREE.CubeGeometry;
var LambertMaterial = THREE.MeshLambertMaterial;
var Mesh = THREE.Mesh;
var SpotLight = THREE.SpotLight;
var CubeColor = THREE.Color;
var Vector3 = THREE.Vector3;
//Step 2 Declare Functional Variables
var scene;
var renderer;
var camera;
var cubeGeometry;
var cubeMaterial;
var torso;
var rightArm;
var leftArm;
var neck;
var head;
var rightLeg;
var leftLeg;
var spotLight;
var color;
function init() {
    console.log("Testing Everything");
    scene = new Scene();
    console.log("Scene Created");
    setupRenderer();
    setupCamera();
    cubeGeometry = new CubeGeometry(2, 2, 2);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    torso = new Mesh(cubeGeometry, cubeMaterial);
    cubeGeometry = new CubeGeometry(4, 5, 2);
    rightArm = new Mesh(cubeGeometry, cubeMaterial);
    rightArm.position.x = 10;
    rightArm.position.y = 10;
    rightArm.position.z = 10;
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(10, 20, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added Spot Light to Scene");
    scene.add(torso);
    scene.add(rightArm);
    document.body.appendChild(renderer.domElement);
    gameLoop();
}
// Setup default renderer
// Renders the Scene by taking the screen width
function setupRenderer() {
    renderer = new Renderer();
    renderer.setClearColor(0xCCCCCC, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
// Instantiates and adds camera to the scene
function setupCamera() {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 15;
    camera.position.y = 16;
    camera.position.z = 25;
    camera.lookAt(scene.position);
    console.log("Finished setting up Camera...");
}
function gameLoop() {
    requestAnimationFrame(gameLoop);
    renderer.render(scene, camera);
}
//# sourceMappingURL=gorilla.js.map