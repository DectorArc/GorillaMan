/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/threejs/three.d.ts" />
/// <reference path="typings/dat-gui/dat-gui.d.ts" />
var controlObject;
(function (controlObject) {
    var Control = (function () {
        function Control(rotationSpeed, opacity, color) {
            this.rotationSpeed = rotationSpeed;
            this.opacity = opacity;
            this.color = color;
        }
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
var Object3D = THREE.Object3D;
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
var pivotPoint;
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
var plane;
function init() {
    rad = 0;
    console.log("Testing Everything");
    scene = new Scene();
    console.log("Scene Created");
    var axisHelper = new THREE.AxisHelper(100);
    scene.add(axisHelper);
    cubeGeometry = new CubeGeometry(10, 3, 1);
    cubeMaterial = new LambertMaterial({ color: 0x000000, opacity: 0 });
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
    scene.add(rightLeg);
    scene.add(leftLeg);
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
    torso.position.set(0, 3, 0);
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
    //Adding Right Leg
    cubeGeometry = new CubeGeometry(0.2, 2, 0.2);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    rightLeg = new Mesh(cubeGeometry, cubeMaterial);
    rightLeg.position.x = 0;
    rightLeg.position.y = 0.5;
    rightLeg.position.z = -1;
    //Adding Left Leg
    cubeGeometry = new CubeGeometry(0.2, 2, 0.2);
    cubeMaterial = new LambertMaterial({ color: 0x003300, opacity: 0 });
    leftLeg = new Mesh(cubeGeometry, cubeMaterial);
    leftLeg.position.x = 0;
    leftLeg.position.y = 0.5;
    leftLeg.position.z = 1;
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
    torso.material.opacity = control.opacity;
    torso.rotation.y += control.rotationSpeed;
    hips.rotation.y += control.rotationSpeed;
    //---Setting up the X and X values for the right arm
    var rightArmPX = rightArm.position.x;
    var rightArmPZ = rightArm.position.z;
    var leftArmPX = leftArm.position.x;
    var leftArmPZ = leftArm.position.z;
    //---Setting up the X and X values for the right arm
    //--Spinning right and left arm position angle rotates in a circle because of cos and sin working on opposite axis
    rightArm.position.x = rightArmPX * Math.cos(control.rotationSpeed) - leftArmPZ * Math.sin(control.rotationSpeed);
    rightArm.position.z = rightArmPZ * Math.cos(control.rotationSpeed) + leftArmPX * Math.sin(control.rotationSpeed);
    leftArm.position.x = leftArmPX * Math.cos(control.rotationSpeed) + leftArmPZ * Math.sin(control.rotationSpeed);
    leftArm.position.z = leftArmPZ * Math.cos(control.rotationSpeed) - leftArmPX * Math.sin(control.rotationSpeed);
    //--Spinning right and left arm position angle rotates in a circle because of cos and sin working on opposite axis
    rightArm.rotation.y += control.rotationSpeed;
    leftArm.rotation.y += control.rotationSpeed;
    var rightShoulderJointPX = rightSphereJoint.position.x;
    var rightShoulderJointPZ = rightSphereJoint.position.z;
    var leftShoulderJointPX = leftSphereJoint.position.x;
    var leftShoulderJointPZ = leftSphereJoint.position.z;
    rightSphereJoint.position.x = rightShoulderJointPX * Math.cos(control.rotationSpeed) - leftShoulderJointPZ * Math.sin(control.rotationSpeed);
    rightSphereJoint.position.z = rightShoulderJointPZ * Math.cos(control.rotationSpeed) + leftShoulderJointPX * Math.sin(control.rotationSpeed);
    leftSphereJoint.position.x = leftShoulderJointPX * Math.cos(control.rotationSpeed) + leftShoulderJointPZ * Math.sin(control.rotationSpeed);
    leftSphereJoint.position.z = leftShoulderJointPZ * Math.cos(control.rotationSpeed) - leftShoulderJointPX * Math.sin(control.rotationSpeed);
    var rightHandPX = rightHand.position.x;
    var rightHandPZ = rightHand.position.z;
    var leftHandPX = leftHand.position.x;
    var leftHandPZ = leftHand.position.z;
    //--Spinning right and left Hand position angle rotates in a circle because of cos and sin working on opposite axis
    rightHand.position.x = rightHandPX * Math.cos(control.rotationSpeed) - leftHandPZ * Math.sin(control.rotationSpeed);
    rightHand.position.z = rightHandPZ * Math.cos(control.rotationSpeed) + leftHandPX * Math.sin(control.rotationSpeed);
    leftHand.position.x = leftHandPX * Math.cos(control.rotationSpeed) + leftHandPZ * Math.sin(control.rotationSpeed);
    leftHand.position.z = leftHandPZ * Math.cos(control.rotationSpeed) - leftHandPX * Math.sin(control.rotationSpeed);
    //--Spinning right and left Hand position angle rotates in a circle because of cos and sin working on opposite axis
    rightHand.rotation.y += control.rotationSpeed;
    leftHand.rotation.y += control.rotationSpeed;
    var rightLegPX = rightLeg.position.x;
    var rightLegPZ = rightLeg.position.z;
    var leftLegPX = leftLeg.position.x;
    var leftLegPZ = leftLeg.position.z;
    rightLeg.position.x = rightLegPX * Math.cos(control.rotationSpeed) - leftLegPZ * Math.sin(control.rotationSpeed);
    rightLeg.position.z = rightLegPZ * Math.cos(control.rotationSpeed) + leftLegPX * Math.sin(control.rotationSpeed);
    leftLeg.position.x = leftLegPX * Math.cos(control.rotationSpeed) + leftLegPZ * Math.sin(control.rotationSpeed);
    leftLeg.position.z = leftLegPZ * Math.cos(control.rotationSpeed) - leftLegPX * Math.sin(control.rotationSpeed);
    rightLeg.rotation.y += control.rotationSpeed;
    leftLeg.rotation.y += control.rotationSpeed;
    torso.material = new LambertMaterial({ color: control.color, opacity: 0 });
    rightHand.material = new LambertMaterial({ color: control.color - Math.random(), opacity: 0 });
    leftHand.material = new LambertMaterial({ color: control.color - Math.random(), opacity: 0 });
    renderer.render(scene, camera);
}
//# sourceMappingURL=gorilla.js.map