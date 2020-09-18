class OptionManager {
    static Instance = null;

    constructor() {
        this.MinoTextureDictionary = ["sky", "purple", "orange", "green", "yellow", "red", "blue", "grey"];
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new OptionManager();
        }

        return this.Instance;
    }
}