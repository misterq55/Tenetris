class TextureManager {
    static Instance = null;

    constructor() {
        this.TextureLoader = new THREE.TextureLoader();
        this.TextureDictionary = [];
        this.BasePath = "../resource/texture/";
        this.Format = "png";
    }

    static getInstance() {
        if (Instance == null) {
            Instance = new TextureManager();
        }

        return Instance;
    }

    loadTexture(path) {
        this.TextureLoader.load(this.BasePath + path + "." + this.Format, function(texture) {
            this.TextureDictionary[path] = texture;
        });
    }
}