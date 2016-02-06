/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/dat-gui/dat-gui.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var basicGameObject;
(function (basicGameObject) {
    var gameObject = (function (_super) {
        __extends(gameObject, _super);
        function gameObject(geometry, material, x, y, z) {
            _super.call(this, geometry, material);
            this.geometry = geometry;
            this.material = material;
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.receiveShadow = true;
            this.castShadow = true;
        }
        return gameObject;
    })(THREE.Mesh);
    basicGameObject.gameObject = gameObject;
})(basicGameObject || (basicGameObject = {}));
var controlObject;
(function (controlObject) {
    var Control = (function () {
        function Control(rotationSpeed, opacity, color) {
            this.rotationSpeed = rotationSpeed;
            this.opacity = opacity;
            this.color = color;
            this.planeWidth = 100;
            this.planeHeight = 5;
        }
        Control.prototype.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };
        Control.prototype.addCube = function () {
            var cubeSize = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
            var cube = new basicGameObject.gameObject(cubeGeometry, cubeMaterial, -30 + Math.round((Math.random() * this.planeWidth)), Math.round((Math.random() * 5)), -20 + Math.round(((Math.random() * this.planeHeight))));
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };
        Control.prototype.outputObjects = function () {
            console.log(scene.children);
        };
        return Control;
    })();
    controlObject.Control = Control;
})(controlObject || (controlObject = {}));
//Step 1 Create All Aliasies for scene 
//these are going to be everything you need to 
//run your graphics objects
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var CubeGeometry = THREE.CubeGeometry;
var LambertMaterial = THREE.MeshLambertMaterial;
var Mesh = THREE.Mesh;
var ObjectD = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var CubeColor = THREE.Color;
var Vector3 = THREE.Vector3;
var Sphere = THREE.SphereGeometry;
var GUI = dat.GUI;
//Step 2 Declare Functional Variables
var scene;
var renderer;
var camera;
var cubeGeometry;
var cubeMaterial;
var sphereJoints;
var sphereMaterial;
var spotLight;
var color;
var gui;
var control;
//Step 2b delcare all the body parts
var torso;
var rightArm;
var leftArm;
var rightSphereJoint;
var leftSphereJoint;
var rightHand;
var leftHand;
var hips;
var neck;
var head;
var rightLeg;
var leftLeg;
var rad;
function init() {
    rad = 0;
    console.log("Testing Everything");
    scene = new Scene();
    console.log("Scene Created");
    var axisHelper = new THREE.AxisHelper(100);
    scene.add(axisHelper);
    setupRenderer();
    setupCamera();
    bodySetup();
    //guiSetup();
    gui = new GUI();
    control = new controlObject.Control(0.005, cubeMaterial.opacity, cubeMaterial.color.getHex());
    addControl(control);
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(20, 20, 20);
    spotLight.distance = 200;
    spotLight.intensity = 3;
    spotLight.angle = Math.PI / 2;
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
function guiSetup() {
}
function addControl(controlObject) {
    gui.add(controlObject, 'rotationSpeed', -0.2, 0.2);
    gui.add(controlObject, 'opacity', 0.1, 1);
    gui.addColor(controlObject, 'color');
}
function bodySetup() {
    //From blender Switch all the y and z values to make replica (Position)
    //From blender middle value for cubeGeometry determines length
    //Adding Torso
    cubeGeometry = new CubeGeometry(1, 3, 1);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    torso = new Mesh(cubeGeometry, cubeMaterial);
    torso.position.x = 0;
    torso.position.y = 3;
    torso.position.z = 0;
    //Adding Right Arm
    cubeGeometry = new CubeGeometry(0.2, 0.2, 1);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    rightArm = new Mesh(cubeGeometry, cubeMaterial);
    rightArm.position.x = 0;
    rightArm.position.y = 4;
    rightArm.position.z = -1;
    //Adding Left Arm
    cubeGeometry = new CubeGeometry(0.2, 0.2, 1);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    leftArm = new Mesh(cubeGeometry, cubeMaterial);
    leftArm.position.x = 0;
    leftArm.position.y = 4;
    leftArm.position.z = 1;
    //Adding Hips
    cubeGeometry = new CubeGeometry(0.2, 0.2, 1.75);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    hips = new Mesh(cubeGeometry, cubeMaterial);
    hips.position.x = 0;
    hips.position.y = 1.5;
    hips.position.z = 0;
    //Adding Right Shoulder Joint
    sphereJoints = new Sphere(0.3, 32, 32);
    sphereMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    rightSphereJoint = new Mesh(sphereJoints, sphereMaterial);
    rightSphereJoint.position.x = 0;
    rightSphereJoint.position.y = 4;
    rightSphereJoint.position.z = -1.75;
    //Adding Left Shoulder Joint
    sphereJoints = new Sphere(0.3, 32, 32);
    sphereMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    leftSphereJoint = new Mesh(sphereJoints, sphereMaterial);
    leftSphereJoint.position.x = 0;
    leftSphereJoint.position.y = 4;
    leftSphereJoint.position.z = 1.75;
    //Adding Right Hand
    cubeGeometry = new CubeGeometry(0.2, 3, 0.2);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    rightHand = new Mesh(cubeGeometry, cubeMaterial);
    rightHand.position.x = -0.04;
    rightHand.position.y = 2.4;
    rightHand.position.z = 1.67;
    //Adding Left Hand
    cubeGeometry = new CubeGeometry(0.2, 3, 0.2);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    leftHand = new Mesh(cubeGeometry, cubeMaterial);
    leftHand.position.x = 0;
    leftHand.position.y = 2.4;
    leftHand.position.z = -1.67;
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
    /*var rightArmPX = rightArm.position.x;
    var rightArmPZ = rightArm.position.z;
    
    var leftArmPX = leftArm.position.x;
    var leftArmPZ = leftArm.position.z;
    
    torso.material.opacity = control.opacity;
    torso.rotation.y += control.rotationSpeed;
    
    rightArm.material.opacity = control.opacity;
    rightArm.position.set(0,4,-1);
    rightArm.position.x = (-0.5 * Math.PI);
    rightArm.position.z = (0.5 * Math.PI);

    leftArm.material.opacity = control.opacity;
    leftArm.position.x = leftArmPX * Math.cos(control.rotationSpeed) + leftArmPZ * Math.sin(control.rotationSpeed);
    leftArm.position.z = leftArmPZ * Math.cos(control.rotationSpeed) - leftArmPX * Math.sin(control.rotationSpeed);
    
    */
    renderer.render(scene, camera);
}
//# sourceMappingURL=gorilla.js.map