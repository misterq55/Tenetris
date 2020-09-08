class Game {
    constructor() {
        this.GameBaseIndex = [-5, -9]
        this.StatIndex = [4, 20]

        this.StartIndex = [[this.GameBaseIndex[0] + this.StatIndex[0]], [this.GameBaseIndex[1] + this.StatIndex[1]]]

        Tetromino.GameBaseIndex = this.GameBaseIndex;
        Tetromino.StartIndex = this.StartIndex;

        this.TMinoPool = new TetrominoPool();

        this.TetrominoIdx = 0;

        this.CurrentTMino = this.TMinoPool.popTetromino();

        this.PrevTMino = null;

        this.Mesh = new THREE.Group();
        this.GameTimer = new Timer();

        this.PlayField = new Field(this.GameBaseIndex);
        this.PlayField.setTetromino(this.CurrentTMino);
        this.Mesh.add(this.PlayField.Mesh);

        this.DownIndex = [0, -1];
        this.MoveIndex = [0, 0];

        this.GameTimer.start();
    }

    init() {

    }

    start() {
        this.GameTimer.start();
    }

    moveStateCheck(index) {
        this.CurrentTMino.move(index)

        var state = this.PlayField.checkTetromino(this.CurrentTMino.getPreMoveIndex());
        switch (state) {
            case 1:
                this.CurrentTMino.applyIndex();
                break;

            case -1:
                this.CurrentTMino.retriveMove(index)
                break;

            case 2:
                this.CurrentTMino.retriveMove(index)
                this.PlayField.lineDelete();

                if (this.TMinoPool.getSize() <= 0){
                    this.CurrentTMino = null;
                    
                    break;
                }
                
                this.CurrentTMino = this.TMinoPool.popTetromino();
                this.PlayField.setTetromino(this.CurrentTMino);
                break;
        }
    }

    rotateStateCheck(dir) {
        this.CurrentTMino.rotate(dir)

        var state = this.PlayField.checkTetromino(this.CurrentTMino.getPreMoveIndex());
        switch (state) {
            case 1:
                this.CurrentTMino.applyIndex();
                break;

            case -1:
            case 2:
                this.CurrentTMino.retriveRotate();
                break;
        }
    }

    update() {
        if (Timer.TimeCounter > 1) {
            Timer.TimeCounter = 0
            if (this.CurrentTMino != null) {
                this.moveStateCheck(this.DownIndex);
            }
        }

    }

    setKeyCode(keyCode) {
        switch (keyCode) {
            case KeyManager.getInstance().getKey("Left"):
                if (this.CurrentTMino != null) {
                    this.MoveIndex = [-1, 0];
                    
                    this.moveStateCheck(this.MoveIndex);
                }
                break;

            case KeyManager.getInstance().getKey("Right"):
                if (this.CurrentTMino != null) {
                    this.MoveIndex = [1, 0];
                    
                    this.moveStateCheck(this.MoveIndex);
                }
                break;

            case KeyManager.getInstance().getKey("Down"):
                if (this.CurrentTMino != null) {
                    this.MoveIndex = [0, -1];
                    
                    this.moveStateCheck(this.MoveIndex);
                }
                break;

            case KeyManager.getInstance().getKey("TurnLeft"):
                if (this.CurrentTMino != null) {
                    this.rotateStateCheck(0);
                }
                break;

            case KeyManager.getInstance().getKey("TurnRight"):
            case KeyManager.getInstance().getKey("Up"):
                if (this.CurrentTMino != null) {
                    this.rotateStateCheck(1);
                }
                break;

            case KeyManager.getInstance().getKey("Start"):
                this.GameTimer.start();
                break;

            case KeyManager.getInstance().getKey("Stop"):
                this.GameTimer.stop();
                break;
        }
    }
}