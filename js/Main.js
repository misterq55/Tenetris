var Renderer = null;
var Screen_width = 0.0;
var Screen_height = 0.0;
var Prev_screen_width = 0.0;
var Prev_screen_height = 0.0;
var Scene = null;
var WebGlCanvas = null;

var width = window.innerWidth
var height = window.innerHeight

TenettrisGame = null;
loadTexture();

initWebGL();

animate();

function loadTexture() {
	let timeInterval = 30;
	let p = Promise.resolve();
	
	for (let i = 0; i < OptionManager.getInstance().MinoTextureDictionary.length; i++) {
		let cubeTextureName = OptionManager.getInstance().MinoTextureDictionary[i];
		p = p.then(_ => new Promise(
			resolve =>
				setTimeout(function () {
					if (TextureManager.getInstance().Dictionary[cubeTextureName] == null) {
						TextureManager.getInstance().loadTexture(cubeTextureName, function (textureInstance) { }).then(async function (cubeTexture) {
							TextureManager.getInstance().Dictionary[cubeTextureName] = cubeTexture;
						})
					}

					resolve();
				}, Math.random() * timeInterval)
		))
	}

	p.then(_ => new Promise(
		resolve =>
		setTimeout(function () {
			TenettrisGame = new Game();
			Scene.add(TenettrisGame.Mesh);
			
			resolve();
		}, Math.random() * timeInterval)
	))
}

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
	// var light = new THREE.DirectionalLight(0xffffff, 0.5);
	// light.position.set(0, 1, 0);
	// Scene.add(light);
	// Scene.add(light.target);

	// Scene.add(new THREE.DirectionalLight(0xffffff, 0.5));
	// Scene.add(new THREE.HemisphereLight());

	Scene.add(new THREE.AmbientLight(0x404040));
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

function animate() {
	if (TenettrisGame) {
		TenettrisGame.update();
	}

	requestAnimationFrame(animate)
	Renderer.render(Scene, TCamera.getInstance().Camera)
}

document.addEventListener('keydown', function (event) {
	TenettrisGame.setKeyCode(event.keyCode);
})