class TCamera {
    static Instance = null;

    constructor() {

        this.Camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            .1,
            10000
        )

        this.Camera.position.set(0, 0, 50)
        this.Camera.lookAt(0, 0, -1)
    }

    static getInstance() {
        if (this.Instance == null)
            this.Instance = new TCamera();

        return this.Instance;
    }

    setAspect(aspect) {
        this.Camera.aspect = aspect;
        this.Camera.updateProjectionMatrix();
    }
}