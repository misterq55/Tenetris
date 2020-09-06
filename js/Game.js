class Game {
    constructor() {
        this.cuurentTMino = null;
        this.cuurentTMino = new LMino();
        this.Mesh = new THREE.Group();
        this.Mesh.add(this.cuurentTMino.Mesh)
        this.GameTimer = new Timer();
    }

    init() {
        
    }

    start() {
        // this.GameTimer.start();
    }

    update() {
        if (Timer.TimeCounter > 1) {
            Timer.TimeCounter = 0
            if (this.cuurentTMino != null) {
                this.cuurentTMino.update();
            }
        }

    }
}