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

const scene = new THREE.Scene()

scene.add(TCamera.getInstance().Camera)

scene.add(new THREE.DirectionalLight())
scene.add(new THREE.HemisphereLight())

var cube = new BaseCube(0x00ff00);
scene.add(cube.Mesh);

animate()

function animate() {
    requestAnimationFrame(animate)
    Renderer.render(scene, TCamera.getInstance().Camera)
    //composer.render()
}