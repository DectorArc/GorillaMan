
/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/dat-gui/dat-gui.d.ts" />

module controlObject{
    export class Control{
        rotationSpeed: number;
        opacity:number;
        color:number;
        constructor(rotationSpeed:number,opacity:number,color:number){
            this.rotationSpeed = rotationSpeed;
            this.opacity = opacity;
            this.color = color;
        }
    }
}

//Step 1 Create All Aliasies for scene 
//these are going to be everything you need to 
//run your graphics objects
import Scene = THREE.Scene;
import Renderer =THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import CubeGeometry = THREE.CubeGeometry;
import LambertMaterial = THREE.MeshLambertMaterial;
import Mesh = THREE.Mesh;
import ObjectD = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import CubeColor = THREE.Color;
import Vector3 = THREE.Vector3;
import Sphere = THREE.SphereGeometry;
import GUI = dat.GUI;

//Step 2 Declare Functional Variables
var scene: Scene;
var renderer: Renderer;
var camera: PerspectiveCamera;
var cubeGeometry: CubeGeometry
var cubeMaterial: LambertMaterial;
var sphereJoints: Sphere;
var sphereMaterial : LambertMaterial;
var spotLight: SpotLight;
var color: CubeColor;
var gui: GUI;
var control: controlObject.Control; 


//Step 2b delcare all the body parts
var torso: Mesh;
var rightArm: Mesh;
var leftArm: Mesh;
var rightSphereJoint: Mesh;
var leftSphereJoint: Mesh;
var rightHand: Mesh;
var leftHand: Mesh;
var hips: Mesh;
var neck: Mesh;
var head: Mesh;
var rightLeg: Mesh;
var leftLeg: Mesh;
var rad;


function init():void{
    rad = 0;
    
    console.log("Testing Everything");
    
    scene = new Scene();
    console.log("Scene Created");
    
    var axisHelper = new THREE.AxisHelper(100);
    scene.add( axisHelper );
    
    setupRenderer();
    setupCamera();
    bodySetup();
    //guiSetup();
    
    gui = new GUI();
    control = new controlObject.Control(0.005, cubeMaterial.opacity, cubeMaterial.color.getHex());
    addControl(control);
    
    spotLight = new SpotLight(0xffffff);
	spotLight.position.set (20, 20, 20);
    spotLight.distance = 200;
    spotLight.intensity = 3;
    spotLight.angle = Math.PI/2;
	spotLight.castShadow = true;
	scene.add(spotLight);
	console.log("Added Spot Light to Scene");
    
    
    scene.add(torso);
    scene.add(rightArm);
    scene.add(leftArm);
    scene.add(hips);
    scene.add(rightSphereJoint);
    scene.add(leftSphereJoint);
    scene.add(rightHand);
    scene.add(leftHand);
    
    document.body.appendChild(renderer.domElement);
    gameLoop();
}

function guiSetup():void{
  
}

function addControl(controlObject:controlObject.Control):void{
    gui.add(controlObject, 'rotationSpeed',-0.2,0.2);
    gui.add(controlObject,'opacity',0.1,1);
    gui.addColor(controlObject, 'color');
    
}

function bodySetup():void{
    
    //From blender Switch all the y and z values to make replica (Position)
    //From blender middle value for cubeGeometry determines length
    
    
    //Adding Torso
    cubeGeometry = new CubeGeometry(1,3,1);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});

    torso = new Mesh(cubeGeometry,cubeMaterial);
    torso.position.x = 0;
    torso.position.y = 3;
    torso.position.z = 0;
    
    
    //Adding Right Arm
    cubeGeometry = new CubeGeometry(0.2,0.2,1);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    rightArm = new Mesh(cubeGeometry,cubeMaterial);
    rightArm.position.x = 0;
    rightArm.position.y = 4;
    rightArm.position.z = -1;
    
    
    //Adding Left Arm
    cubeGeometry = new CubeGeometry(0.2,0.2,1);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    leftArm = new Mesh(cubeGeometry,cubeMaterial);
    leftArm.position.x = 0;
    leftArm.position.y = 4;
    leftArm.position.z = 1;
    
    //Adding Hips
    cubeGeometry = new CubeGeometry(0.2,0.2,1.75);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    hips = new Mesh(cubeGeometry,cubeMaterial);
    hips.position.x = 0;
    hips.position.y = 1.5;
    hips.position.z = 0;
    
    //Adding Right Shoulder Joint
    sphereJoints = new Sphere(0.3,32,32);
    sphereMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    rightSphereJoint  = new Mesh(sphereJoints,sphereMaterial);
    rightSphereJoint.position.x = 0;
    rightSphereJoint.position.y = 4;
    rightSphereJoint.position.z = -1.75;
    
    
    //Adding Left Shoulder Joint
    sphereJoints = new Sphere(0.3,32,32);
    sphereMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    leftSphereJoint = new Mesh(sphereJoints,sphereMaterial);
    leftSphereJoint.position.x = 0;
    leftSphereJoint.position.y = 4;
    leftSphereJoint.position.z = 1.75;
    
    
    //Adding Right Hand
    cubeGeometry = new CubeGeometry(0.2,3,0.2);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    rightHand  = new Mesh(cubeGeometry,cubeMaterial);
    rightHand.position.x = -0.04;
    rightHand.position.y = 2.4;
    rightHand.position.z = 1.67;
    
    //Adding Left Hand
    cubeGeometry = new CubeGeometry(0.2,3,0.2);
    cubeMaterial = new LambertMaterial({color:0x003300, opacity:0});
    
    leftHand = new Mesh(cubeGeometry,cubeMaterial);
    leftHand.position.x = 0;
    leftHand.position.y = 2.4;
    leftHand.position.z = -1.67;
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
    
    var rightArmPX = rightArm.position.x;
    var rightArmPZ = rightArm.position.z;
    
    var leftArmPX = leftArm.position.x;
    var leftArmPZ = leftArm.position.z;
    
    torso.material.opacity = control.opacity;
    torso.rotation.y += control.rotationSpeed; 
    
    rightArm.material.opacity = control.opacity;
    rightArm.position.x = rightArmPX * Math.cos(control.rotationSpeed) + rightArmPZ * Math.sin(control.rotationSpeed);
    rightArm.position.z = rightArmPZ * Math.cos(control.rotationSpeed) - rightArmPX * Math.sin(control.rotationSpeed);
    rightArm.rotation.x = control.rotationSpeed;
    rightArm.rotation.z = control.rotationSpeed;
    
    leftArm.material.opacity = control.opacity;
    leftArm.position.x = leftArmPX * Math.cos(control.rotationSpeed) + leftArmPZ * Math.sin(control.rotationSpeed);
    leftArm.position.z = leftArmPZ * Math.cos(control.rotationSpeed) - leftArmPX * Math.sin(control.rotationSpeed);
    renderer.render(scene,camera);
}