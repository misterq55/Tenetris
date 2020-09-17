var Renderer = null;
var Screen_width = 0.0;
var Screen_height = 0.0;
var Prev_screen_width = 0.0;
var Prev_screen_height = 0.0;
var Scene = null;
var WebGlCanvas = null;

var width = window.innerWidth
var height = window.innerHeight

initWebGL();

const TenettrisGame = new Game();

animate();

function initWebGL() {
	setupRenderer();
	setupScene();

}

function setupRenderer() {
	Renderer = new THREE.WebGLRenderer();

	const glDiv = document.getElementById('canvasDiv');
	if (glDiv != null) {
        glDiv.appendChild(Renderer.domElement);
        
        Renderer.domElement.width = width;
		Renderer.domElement.height = height;
	}

	calcScreenSize();

	Renderer.setSize(Screen_width, Screen_height);
	Renderer.setClearColor(0xffffff, 1.0);
	Renderer.gammaOutput = true;

	// where to add the WebGlCanvas element
}

function setupScene() {
	Scene = new THREE.Scene();
	addLight();

	Scene.add(TCamera.getInstance().Camera);
}

function addLight() {
    Scene.add(new THREE.DirectionalLight())
    // Scene.add(new THREE.HemisphereLight())
}

function calcScreenSize() {
	Prev_screen_width = Screen_width;
	Prev_screen_height = Screen_height;

	Screen_width = window.innerWidth - 50;
	Screen_height = window.innerHeight - 50;
}

window.addEventListener('resize', function () {
    calcScreenSize();

	Renderer.setSize(Screen_width, Screen_height);
	TCamera.getInstance().updateCamera();
});

Scene.add(TenettrisGame.Mesh);

function animate() {
	TenettrisGame.update();
    requestAnimationFrame(animate)
    Renderer.render(Scene, TCamera.getInstance().Camera)
}

document.addEventListener('keydown', function(event) {
	TenettrisGame.setKeyCode(event.keyCode);
})