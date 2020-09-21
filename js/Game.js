class Game {
    static Instance = null;

    constructor() {
        Tetromino.StartIndex = [4, 20];

        this.TMinoPool = new TetrominoPool();

        this.TetrominoIdx = 0;

        this.PrevTMino = null;

        this.Mesh = new THREE.Group();
        this.GameTimer = new Timer();
        this.GameTimer.setSpeed(1);

        this.CurrentTMino = null;
        this.PlayField = new Field();

        this.setTetromino(this.TMinoPool.shiftTetromino());
        this.ControllSwitch = 0;

        this.Mesh.add(this.PlayField.Mesh);
        this.Mesh.add(this.PlayField.EdgeMesh);

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
        this.GameTimer.start();
    }

    setTetromino(tetromino) {
        if (this.CurrentTMino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.CurrentTMino.getBaseCubes(i);

                this.Mesh.remove(baseCube.Mesh);
            }
        }

        if (tetromino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = tetromino.getBaseCubes(i);

                this.Mesh.add(baseCube.Mesh);
            }
        }

        this.PrevTMino = this.CurrentTMino;
        this.PlayField.setPrevTetromino(this.PrevTMino);
        this.CurrentTMino = tetromino;
        this.PlayField.setTetromino(this.CurrentTMino);
    }

    inverseSetTetromino() {
        if (this.PrevTMino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.PrevTMino.getBaseCubes(i);

                this.Mesh.add(baseCube.Mesh);
            }
        }

        if (this.CurrentTMino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.CurrentTMino.getBaseCubes(i);

                this.Mesh.remove(baseCube.Mesh);
            }
        }

        this.CurrentTMino = this.PrevTMino;
        this.PrevTMino = null;
    }

    moveStateCheck(index) {
        this.CurrentTMino.move(index)

        var state = this.PlayField.checkTetromino(this.CurrentTMino.getPreMoveIndex(), this.MoveIndex);
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

                if (this.TMinoPool.getSize() <= 0) {
                    this.setTetromino(null);

                    break;
                }

                this.ControllSwitch = 1;

                if (this.TInversionSwitch != 1) {
                    this.GameTimer.sleep(0).then(() => {
                        this.ControllSwitch = 0;
                        this.setTetromino(this.TMinoPool.shiftTetromino());
                    })
                }

                break;
        }
    }

    rotateStateCheck(dir) {
        this.CurrentTMino.rotate(dir)

        var state = this.PlayField.checkTetromino(this.CurrentTMino.getPreMoveIndex(), [0, 0]);
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
        this.PlayField.update();

        switch (this.TInversionSwitch) {
            case 0:
                this.GameTimer.update(this, 1,
                    function (owner) {
                        if (owner.CurrentTMino != null) {
                            owner.moveStateCheck(owner.DownIndex);
                        }
                    });

                break;

            case 1:
                this.GameTimer.update(this, 0.05,
                    function (owner) {
                        if (owner.CurrentTMino != null) {
                            if (owner.CurrentTMino.inverseTetromino() == 1) {
                                if (owner.PrevTMino == null) {
                                    owner.timeInversion();
                                }
                                else {
                                    owner.PlayField.inverseLines();
                                    owner.TMinoPool.unshiftTetromino(owner.CurrentTMino);
                                    owner.GameTimer.sleep(0).then(() => {
                                        owner.inverseSetTetromino();
                                    })
                                }
                            }
                        }
                    });
                break;
        }
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

        this.PlayField.startRotate(this.SInversionSwitch);
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
    }

    setKeyCode(keyCode) {
        if (this.TInversionSwitch == 1 || this.ControllSwitch == 1) {
            return;
        }

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

            // case KeyManager.getInstance().getKey("SpaceInversion"):
            //     this.spaceInversion();
            //     break;

            case KeyManager.getInstance().getKey("TimeInversion"):
                this.timeInversion();
                break;
        }
    }
}