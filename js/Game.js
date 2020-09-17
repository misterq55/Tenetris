class Game {
    constructor() {
        this.loadTexture();

        Tetromino.StartIndex = [4, 20];

        this.TMinoPool = new TetrominoPool();

        this.TetrominoIdx = 0;

        this.PrevTMino = null;

        this.Mesh = new THREE.Group();
        this.GameTimer = new Timer();

        this.CurrentTMino = null;
        this.PlayField = new Field();
        
        this.setTetromino(this.TMinoPool.popTetromino());

        this.Mesh.add(this.PlayField.Mesh);
        this.Mesh.add(this.PlayField.EdgeMesh);

        this.SInversionSwitch = 0;

        this.DownIndex = [0, -1];
        this.MoveIndex = [0, 0];

        this.start();
    }

    loadTexture() {
        TextureManager.getInstance().loadTexture("blue");
        TextureManager.getInstance().loadTexture("green");
        TextureManager.getInstance().loadTexture("orange");
        TextureManager.getInstance().loadTexture("purple");
        TextureManager.getInstance().loadTexture("red");
        TextureManager.getInstance().loadTexture("sky");
        TextureManager.getInstance().loadTexture("yellow");
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

        this.CurrentTMino = tetromino;
        this.PlayField.setTetromino(this.CurrentTMino);
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
                
                this.setTetromino(this.TMinoPool.popTetromino());
                
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
        this.PlayField.update();

        if (Timer.TimeCounter > 1) {
            Timer.TimeCounter = 0
            
            if (this.CurrentTMino != null) {
                this.moveStateCheck(this.DownIndex);
            }
        }

    }

    spaceInversion() {
        switch(this.SInversionSwitch) {
            case 0:
                this.SInversionSwitch = 1;
                break;

            case 1:
                this.SInversionSwitch = 0;
                break;
        }

        this.PlayField.startRotate(this.SInversionSwitch);

        // if (this.SInversionSwitch == 0) {
        //     this.PlayField.Mesh.rotation.set(0, 0, 0);
        // }
        // else if (this.SInversionSwitch == 1) {
        //     this.PlayField.Mesh.rotation.set(0, Math.PI, 0);
        // }
        
        // this.PlayField.spaceInversion(this.SInversionSwitch);
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

            case KeyManager.getInstance().getKey("SpaceInversion"):
                this.spaceInversion();
                break;
        }
    }
}