class TextureManager {
    static Instance = null;

    constructor() {
        this.TextureLoader = new THREE.TextureLoader();
        this.Dictionary = [];
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
        return new Promise(resolve => {
            new THREE.TextureLoader().load(this.BasePath + path + "." + this.Format, resolve);
        })

        // this.TextureLoader.load(this.BasePath + path + "." + this.Format, function(texture) {
        //     TextureManager.getInstance().TextureDictionary[path] = texture;
        //     callBack(texture);
        // });
    }
}