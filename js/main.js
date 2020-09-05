const Renderer = new THREE.WebGLRenderer()
const composer = new THREE.EffectComposer(Renderer)

var width = window.innerWidth
var height = window.innerHeight

Renderer.setSize(width, height);
Renderer.setClearColor(0x808080, 1.0);
Renderer.gammaOutput = true;

const glDiv = document.getElementById('canvasDiv')
Renderer.domElement.id = 'cv'
glDiv.appendChild(Renderer.domElement)

const camera = new THREE.PerspectiveCamera(
    60,
    width / height,
    .1,
    10000
)

camera.position.set(0, 0, 3)
camera.lookAt(0, 0, -1)

const scene = new THREE.Scene()

scene.add(camera)

scene.add(new THREE.DirectionalLight())
scene.add(new THREE.HemisphereLight())

var model = null

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

animate()

function animate() {
    requestAnimationFrame(animate)
    Renderer.render(scene, camera)
    //composer.render()
}