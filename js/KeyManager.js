class KeyManager {
    static Instance = null;

    constructor() {
        this.KeyBuffer = {};
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new KeyManager();
            this.Instance.init();
        }

        return this.Instance;
    }
    
    setKey(keyType, keyCode) {
        this.KeyBuffer[keyType] = keyCode;
    }

    getKey(keyType) {
        return this.KeyBuffer[keyType];
    }

    init () {
        this.setKey("Left", 37);
        this.setKey("Right", 39);
        this.setKey("Down", 40);
        this.setKey("Up", 38);
        this.setKey("Start", 81); 
        this.setKey("Stop", 83);
        this.setKey("TurnLeft", 88);
        this.setKey("TurnRight", 90);
        this.setKey("SpaceInversion", 17);
    }
}