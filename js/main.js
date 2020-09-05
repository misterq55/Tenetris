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

var textureDic = {}

new THREE.FBXLoader().load("./resource/shirt/shirt.FBX"
    , function (object) {
        model = object
        model.position.set(0, 0, 0)
        model.scale.set(1, 1, 1)
        scene.add(model)
    }
)

new THREE.TextureLoader().load("./resource/shirt/sol_body_v001.jpg"
    , function (texture) { textureDic["texture1"] = texture })

new THREE.TextureLoader().load("./resource/shirt/sol_body_v002.jpg"
    , function (texture) { textureDic["texture2"] = texture })

var ssaoPass = new THREE.SSAOPass(scene, camera, width, height);
ssaoPass.kernelRadius = 16;
composer.addPass(ssaoPass);

animate()

function animate() {
    requestAnimationFrame(animate)
    Renderer.render(scene, camera)
    //composer.render()
}