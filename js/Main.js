var Renderer = null;
var Screen_width = 0.0;
var Screen_height = 0.0;
var Prev_screen_width = 0.0;
var Prev_screen_height = 0.0;
var Scene = null;
var WebGlCanvas = null;

var width = window.innerWidth
var height = window.innerHeight

const TenettrisGame = new Game();

initWebGL();
animate();

function initWebGL() {
	setupRenderer();
	setupScene();

}


function setupRenderer() {
	Renderer = new THREE.WebGLRenderer();

	const glDiv = document.getElementById('canvasDiv');
	if (glDiv != null) {
		//Renderer.domElement.id = 'cv';
        glDiv.appendChild(Renderer.domElement);
        
        Renderer.domElement.width = width;
		Renderer.domElement.height = height;
		
		// document.getElementById('cv').width = width;
		// document.getElementById('cv').height = height;
	}

	calcScreenSize();

	Renderer.setSize(Screen_width, Screen_height);
	Renderer.setClearColor(0x808080, 1.0);
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
    Scene.add(new THREE.HemisphereLight())
}

function calcScreenSize() {
	Prev_screen_width = Screen_width;
	Prev_screen_height = Screen_height;

	Screen_width = window.innerWidth;
	Screen_height = window.innerHeight;
}

window.addEventListener('resize', function () {
    calcScreenSize();

	Renderer.setSize(Screen_width, Screen_height);
	TCamera.getInstance().setAspect(Screen_width / Screen_height)
});

Scene.add(TenettrisGame.Mesh);

TenettrisGame.start();

function animate() {
	TenettrisGame.update();
    requestAnimationFrame(animate)
    Renderer.render(Scene, TCamera.getInstance().Camera)
}