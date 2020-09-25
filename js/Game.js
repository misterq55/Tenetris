class Game {
    constructor() {
        this.PlayField = new Field();
        this.PlayField.setPosition(new THREE.Vector3(0, 0, 0));
        this.PlayField.setScale(new THREE.Vector3(1, 1, 1));

        this.Mesh = new THREE.Group();

        this.ControllSwitch = 0;

        this.Mesh.add(this.PlayField.Mesh);

        this.SInversionSwitch = 0;
        this.TInversionSwitch = 0;

        this.DownIndex = [0, -1];
        this.MoveIndex = [0, 0];

        this.PlayField.start();
    }

    init() {

    }

    update() {
        this.PlayField.update(this.DownIndex);
    }

    setKeyCode(keyCode) {
        if (this.PlayField.getTimeInversion() == 1 || this.PlayField.getControlSwitch()) {
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
                this.PlayField.start();
                break;

            case KeyManager.getInstance().getKey("Stop"):
                this.PlayField.stop();
                break;

            case KeyManager.getInstance().getKey("SpaceInversion"):
                this.PlayField.spaceInversion();
                break;

            case KeyManager.getInstance().getKey("TimeInversion"):
                this.PlayField.timeInversion();
                break;
        }
    }
}