class Game {
    static Instance = null;

    constructor() {
        this.PlayField = new Field();
        this.PlayField.setPosition(new THREE.Vector3(0, 0, 0));
        this.PlayField.setScale(new THREE.Vector3(1, 1, 1));

        this.TetrominoIdx = 0;

        // this.PrevTMino = null;

        this.Mesh = new THREE.Group();

        // this.CurrentTMino = this.PlayField.getTetromino();
        this.ControllSwitch = 0;

        this.Mesh.add(this.PlayField.Mesh);

        this.SInversionSwitch = 0;
        this.TInversionSwitch = 0;

        this.DownIndex = [0, -1];
        this.MoveIndex = [0, 0];

        this.start();
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new Game();
        }

        return this.Instance;
    }

    init() {

    }

    start() {
        this.PlayField.FieldTimer.start();
    }

    moveStateCheck(index) {
        this.PlayField.moveStateCheck(index);
    }

    rotateStateCheck(dir) {
        this.PlayField.rotateStateCheck(dir);
    }

    update() {
        this.PlayField.update(this.DownIndex);
    }

    spaceInversion() {
        switch (this.SInversionSwitch) {
            case 0:
                this.SInversionSwitch = 1;
                break;

            case 1:
                this.SInversionSwitch = 0;
                break;
        }

        this.PlayField.spaceInversion(this.SInversionSwitch);
    }

    timeInversion() {
        switch (this.TInversionSwitch) {
            case 0:
                this.TInversionSwitch = 1;
                break;

            case 1:
                this.TInversionSwitch = 0;
                break;
        }

        this.PlayField.timeInversion(this.TInversionSwitch);
    }

    setKeyCode(keyCode) {
        if (this.TInversionSwitch == 1 || this.PlayField.getControlSwitch()) {
            return;
        }

        switch (keyCode) {
            case KeyManager.getInstance().getKey("Left"):
                this.MoveIndex = [-1, 0];
                this.PlayField.moveStateCheck(this.MoveIndex);
                break;

            case KeyManager.getInstance().getKey("Right"):
                this.MoveIndex = [1, 0];
                this.PlayField.moveStateCheck(this.MoveIndex);
                break;

            case KeyManager.getInstance().getKey("Down"):
                this.MoveIndex = [0, -1];
                this.PlayField.moveStateCheck(this.MoveIndex);
                break;

            case KeyManager.getInstance().getKey("TurnLeft"):
                this.PlayField.rotateStateCheck(0);
                break;

            case KeyManager.getInstance().getKey("TurnRight"):
            case KeyManager.getInstance().getKey("Up"):
                this.PlayField.rotateStateCheck(1);
                break;

            case KeyManager.getInstance().getKey("Start"):
                this.PlayField.FieldTimer.start();
                break;

            case KeyManager.getInstance().getKey("Stop"):
                this.PlayField.FieldTimer.stop();
                break;

            // case KeyManager.getInstance().getKey("SpaceInversion"):
            //     this.spaceInversion();
            //     break;

            case KeyManager.getInstance().getKey("TimeInversion"):
                this.timeInversion();
                break;
        }
    }
}