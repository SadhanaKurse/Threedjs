import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('mainArea').appendChild(renderer.domElement);


// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

camera.position.set(0, 2, 25)

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

var gridXY = new THREE.GridHelper(100, 50);
gridXY.rotation.x = Math.PI / 2;
scene.add(gridXY);

var gridYZ = new THREE.GridHelper(100, 10);
gridYZ.rotation.z = Math.PI / 2;
scene.add(gridYZ);




var vertices = [], copiedPolygon;

var polygonVertices = []
document.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event) {
    event.preventDefault();

    var mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {


        var point = intersects[0].point;

        vertices.push(point.x, point.y, point.z);
        polygonVertices.push(point.x, point.y, point.z);
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        var geometryP = new THREE.BufferGeometry();
        geometryP.setAttribute('position', new THREE.Float32BufferAttribute(polygonVertices, 3));

        var material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 10, scale: 1 });
        var line = new THREE.Line(geometry, material);

        scene.add(line);

        // if (intersects.length > 2) {
        //     var material = new THREE.MeshLambertMaterial({
        //         color: new THREE.Color(0xff0000),
        //         lineWidth:10,
        //         wireframe: true,
        //         wireframeLinewidth: 2,
        //         side: THREE.DoubleSide,
        //     });

        //     var mesh = new THREE.Mesh(geometry, material);
        //     scene.add(mesh);
        //     polygonVertices = []

        // }

        if (intersects.length > 3) {
            var color = new THREE.Color(0xff0000); // Generate a random color
            var material = new THREE.MeshLambertMaterial({ color: color });

            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        renderer.render(scene, camera)
    }

    // paste if there is any copied polygon 
    if (event.button === 0 && copiedPolygon) { // Left mouse button
        var newPolygon = new THREE.Mesh(originalPolygon.geometry, originalPolygon.material);
        newPolygon.position.copy(originalPolygon.position);
        scene.add(newPolygon);
    }



}

document.addEventListener('keydown', onKeyDown, false);
function onKeyDown(event) {
    if (event.keyCode == 82) { // "R" key
        reset();
    } else if (event.keyCode == 67) { // "C" key
        copy();
    }
}

// Define a function to reset the polygon drawing
function reset() {
    vertices = [];
    var mesh = scene.children.find(child => child.find(child => child instanceof THREE.Line));
    if (mesh !== undefined) {
        scene.remove(mesh);
    }
}

// Define a function to copy the polygon vertices to the clipboard
function copy() {
    var string = "";
    for (var i = 0; i < vertices.length; i += 3) {
        string += vertices[i] + ", " + vertices[i + 1] + ", " + vertices[i + 2] + "\n";
    }
    copiedPolygon = string
    navigator.clipboard.writeText(string).then(function () {
        console.log("Copied to clipboard: \n" + string);
    }, function () {
        console.log("Failed to copy to clipboard");
    });
}


renderer.render(scene, camera)






