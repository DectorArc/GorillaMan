
/// <reference path="typings/tsd.d.ts" />

//Step 1 Create All Aliasies for scene
import Scene = THREE.Scene;
import Renderer =THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import CubeGeometry = THREE.CubeGeometry;
import LambertMaterial = THREE.MeshLambertMaterial;
import Mesh = THREE.Mesh;
import SpotLight = THREE.SpotLight;
import CubeColor = THREE.Color;
import Vector3 = THREE.Vector3;

//Step 2 Declare Functional Variables
var scene: Scene;
var renderer: Renderer;
var camera: PerspectiveCamera;
var cubeGeometry: CubeGeometry
var cubeMaterial: LambertMaterial;
var torso: Mesh;
var rightArm: Mesh;
var leftArm: Mesh;
var neck: Mesh;
var head: Mesh;
var rightLeg: Mesh;
var leftLeg: Mesh;
var spotLight: SpotLight;
var color: CubeColor;


function init():void{
    console.log("Testing Everything");
    
    scene = new Scene();
    console.log("Scene Created");
    
    setupRenderer();
    setupCamera();
    
    cubeGeometry = new CubeGeometry(2,2,2);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});

    torso = new Mesh(cubeGeometry,cubeMaterial);
    
    cubeGeometry = new CubeGeometry(4,5,2);
    rightArm = new Mesh(cubeGeometry,cubeMaterial);
    rightArm.position.x = 10;
    rightArm.position.y = 10;
    rightArm.position.z = 10;
    
    
    
    
    
    spotLight = new SpotLight(0xffffff);
	spotLight.position.set (10, 20, 20);
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
function setupRenderer():void {
	renderer = new Renderer();
	renderer.setClearColor(0xCCCCCC, 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
// Instantiates and adds camera to the scene
function setupCamera():void {
	camera = new PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.x =15;
	camera.position.y = 16;
	camera.position.z = 25;
	camera.lookAt(scene.position);
	console.log("Finished setting up Camera...");
}

function gameLoop():void{
    requestAnimationFrame(gameLoop);
    renderer.render(scene,camera);
}