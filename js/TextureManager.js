class TextureManager {
    static Instance = null;

    constructor() {
        this.TextureLoader = new THREE.TextureLoader();
        this.TextureDictionary = [];
        this.BasePath = "../Tenetris/resource/texture/";
        this.Format = "png";
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new TextureManager();
        }

        return this.Instance;
    }

    loadTexture(path) {
        this.TextureLoader.load(this.BasePath + path + "." + this.Format, function(texture) {
            TextureManager.getInstance().TextureDictionary[path] = texture;
        });
    }
}