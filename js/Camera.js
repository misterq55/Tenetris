class TCamera {
    static Instance = null;

    constructor() {
        this.CamHegith = 50;
        this.CamWidth = this.CamHegith / height * width;

        this.Camera = new THREE.OrthographicCamera(
            this.CamWidth / -2, this.CamWidth / 2, this.CamHegith / 2, this.CamHegith / -2, 1, 1000
        )

        this.Camera.position.set(0, 0, 10)
        this.Camera.lookAt(0, 0, -1)
    }

    static getInstance() {
        if (this.Instance == null)
            this.Instance = new TCamera();

        return this.Instance;
    }

    updateCamera() {
        this.CamWidth = this.CamHegith / height * width;
        this.Camera.left = this.CamWidth / -2;
        this.Camera.right = this.CamWidth / 2;
        this.Camera.top = this.CamHegith / 2;
        this.Camera.down = this.CamHegith / -2;
        this.Camera.updateProjectionMatrix();
    }
}