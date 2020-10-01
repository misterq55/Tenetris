class OptionManager {
    static Instance = null;

    constructor() {
        this.MinoTextureDictionary = ["yellow", "red", "sky", "blue", "orange", "purple", "green", "grey"];
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new OptionManager();
        }

        return this.Instance;
    }
}