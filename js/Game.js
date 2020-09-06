class Game {
    constructor() {
        this.GameBaseIndex = [-5, -8]
        this.StatIndex = [5, 18]

        this.StartIndex = [[this.GameBaseIndex[0] + this.StatIndex[0]], [this.GameBaseIndex[1] + this.StatIndex[1]]]

        this.tetrnominos = [new LMino(this.GameBaseIndex, this.StartIndex)
            , new ZMino(this.GameBaseIndex, this.StartIndex)
            , new IMino(this.GameBaseIndex, this.StartIndex)];

        this.TetrominoIdx = 0;

        this.CurrentTMino = null;
        this.CurrentTMino = this.tetrnominos[this.TetrominoIdx];
        this.Mesh = new THREE.Group();
        this.GameTimer = new Timer();

        this.PlayField = new Field(this.GameBaseIndex);
        this.PlayField.setTetromino(this.CurrentTMino);
        this.Mesh.add(this.PlayField.Mesh);

        this.DownIndex = [0, -1];
        this.MoveIndex = [0, 0];
    }

    init() {

    }

    start() {
        // this.GameTimer.start();
    }

    moveStateCheck(index) {
        this.CurrentTMino.preMove(index)

        var state = this.PlayField.checkTetromino(this.CurrentTMino.getPreMoveIndex());
        switch (state) {
            case 1:
                this.CurrentTMino.move(index);
                break;

            case -1:
                this.CurrentTMino.retrive(index)
                break;

            case 2:
                this.CurrentTMino.retrive(index)
                this.PlayField.setTMinoBuffer(this.CurrentTMino.getPreMoveIndex());
                this.TetrominoIdx++;

                if (this.TetrominoIdx >= this.tetrnominos.length){
                    this.CurrentTMino = null;
                    
                    break;
                }
                
                this.CurrentTMino = this.tetrnominos[this.TetrominoIdx];
                this.PlayField.setTetromino(this.CurrentTMino);
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

            case KeyManager.getInstance().getKey("Up"):
                if (this.CurrentTMino != null) {
                    this.CurrentTMino.rotate();
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