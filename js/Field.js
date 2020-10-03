class Field {
    constructor() {
        this.FieldWidth = 10;
        this.FieldHeight = 22;

        this.FieldMesh = new THREE.Group();
        this.FieldMesh.position.set(-5.5, 0, 0);

        this.EdgeMesh = new THREE.Group();
        this.EdgeMesh.position.set(0, 0, 0);

        this.CenterMesh = new THREE.Group();
        this.CenterMesh.add(this.FieldMesh);
        this.CenterMesh.position.set(5.5, 0, 0);

        this.Mesh = new THREE.Group();
        this.Mesh.add(this.CenterMesh);
        this.Mesh.add(this.EdgeMesh);

        this.TetrominoMesh = new THREE.Group();
        this.Mesh.add(this.TetrominoMesh);

        this.FieldTimer = new Timer();
        this.FieldTimer.setSpeed(1);

        this.Buffer = null;
        this.ReverseBuffer = null;

        this.CurrentBufferPointer = null;
        this.AnotherBufferPointer = null;

        this.BaseCubes = null;

        this.CurrentTetromino = null;
        this.PrevTetromino = null;

        this.LineChecker = null;
        this.DeleteChecker = null;

        this.PrevLineChecker = null;
        this.PrevDeleteChecker = null;

        this.TInversionSwitch = 0;
        this.SInversionSwitch = 0;

        this.RotateStatus = 0;
        this.YAngle = 0;
        this.RotateSpeed = 3;

        this.PrevSInversionSwitch = -1;

        this.ControllSwitch = 0;

        this.HeightBuffer = new Array(this.FieldWidth + 2);

        Tetromino.StartIndex = [4, 20];

        this.TMinoPool = new TetrominoPool();

        this.LineDeleteInterval = 250;
        this.TetrominoStartInterval = this.LineDeleteInterval * 2;
        this.LineInverseInterval = 50;
        this.TetrominoInverseInterval = this.LineInverseInterval * 2;

        this.init();
    }

    init() {
        this.BaseCubes = new Array(this.FieldHeight + 2);
        this.DeletedBaseCubes = new Array(this.FieldHeight + 2);

        this.Buffer = new Array(this.FieldHeight + 2);
        this.ReverseBuffer = new Array(this.FieldHeight + 2);

        this.CurrentBufferPointer = this.Buffer;
        this.AnotherBufferPointer = this.ReverseBuffer;

        this.LineChecker = new Array(this.FieldHeight + 2);
        this.DeleteChecker = new Array(this.FieldHeight + 2);

        this.PrevLineChecker = new Array(this.FieldHeight + 2);
        this.PrevDeleteChecker = new Array(this.FieldHeight + 2);

        let texture = TextureManager.getInstance().Dictionary["grey"];

        this.setTetromino(this.TMinoPool.shiftTetromino());

        for (var i = 0; i < this.FieldHeight + 2; i++) {
            this.Buffer[i] = new Array(this.FieldWidth + 2);
            this.ReverseBuffer[i] = new Array(this.FieldWidth + 2);
            this.BaseCubes[i] = new Array(this.FieldWidth + 2);
            this.DeletedBaseCubes[i] = new Array(this.FieldWidth + 2);
            this.LineChecker[i] = 0;
            this.DeleteChecker[i] = 0;
            this.PrevLineChecker[i] = 0;
            this.PrevDeleteChecker[i] = 0;

            this.HeightBuffer[i] = 0;

            for (var j = 0; j < this.FieldWidth + 2; j++) {
                this.Buffer[i][j] = 0;
                this.ReverseBuffer[i][j] = 0;

                if (i == 0 || i == this.FieldHeight + 1 ||
                    j == 0 || j == this.FieldWidth + 1) {

                    var baseCube = new BaseCube(texture, [j, i]);

                    this.EdgeMesh.add(baseCube.Mesh);
                    if (i != this.FieldHeight + 1) {
                        this.Buffer[i][j] = -1;
                        this.ReverseBuffer[i][j] = -1;
                    }
                }
            }
        }
    }

    setPosition(pos) {
        Tetromino.StartIndex[0] += pos.x;
        this.Mesh.position.set(pos.x, pos.y, pos.z);
    }

    setScale(scale) {
        this.Mesh.scale.set(scale.x, scale.y, scale.z);
    }

    setControlSwitch(controllSwitch) {
        this.ControllSwitch = controllSwitch;
    }

    getControlSwitch() {
        return this.ControllSwitch;
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

    setTetromino(tetromino) {
        if (this.CurrentTetromino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.CurrentTetromino.getBaseCubes(i);

                this.TetrominoMesh.remove(baseCube.Mesh);
            }
        }

        if (tetromino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = tetromino.getBaseCubes(i);

                this.TetrominoMesh.add(baseCube.Mesh);
            }
        }

        this.PrevTetromino = this.CurrentTetromino;
        this.CurrentTetromino = tetromino;

        this.CurrentTetromino.setSpaceInversionType(this.SInversionSwitch);
    }

    getTetromino() {
        return this.CurrentTetromino;
    }

    inverseSetTetromino() {
        if (this.PrevTetromino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.PrevTetromino.getBaseCubes(i);
                this.FieldMesh.remove(baseCube.Mesh);

                var index = baseCube.getIndex();
                var x = index[0];

                if (this.SInversionSwitch == 1) {
                    x = this.FieldWidth - x + 1;
                    index[0] = x;
                    baseCube.setIndex(index);
                }

                this.TetrominoMesh.add(baseCube.Mesh);
            }
        }

        if (this.CurrentTetromino != null) {
            for (var i = 0; i < 4; i++) {
                var baseCube = this.CurrentTetromino.getBaseCubes(i);

                this.TetrominoMesh.remove(baseCube.Mesh);
            }
        }

        this.CurrentTetromino = this.PrevTetromino;
        this.PrevTetromino = null;
    }

    start() {
        this.FieldTimer.start();
    }

    stop() {
        this.FieldTimer.stop();
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

        this.PrevSInversionSwitch = this.SInversionSwitch;

        if (this.SInversionSwitch == 0) {
            this.CurrentBufferPointer = this.Buffer;
            this.AnotherBufferPointer = this.ReverseBuffer;
        }
        else if (this.SInversionSwitch == 1) {
            this.CurrentBufferPointer = this.ReverseBuffer;
            this.AnotherBufferPointer = this.Buffer;
        }

        this.startRotate(this.SInversionSwitch);
    }

    getTimeInversion() {
        return this.TInversionSwitch;
    }

    update(index) {
        this.rotateField();

        if (this.RotateStatus != 0) {
            return;
        }

        switch (this.TInversionSwitch) {
            case 0:
                this.FieldTimer.update(this, 1,
                    function (owner) {
                        if (owner.CurrentTetromino != null) {
                            owner.moveStateCheck(index);
                        }
                    });

                break;

            case 1:
                this.FieldTimer.update(this, 0.05,
                    function (owner) {
                        if (owner.CurrentTetromino != null) {
                            if (owner.CurrentTetromino.inverseTetromino() == 1) {
                                if (owner.PrevTetromino == null) {
                                    if (owner.SInversionSwitch != owner.CurrentTetromino.getSpaceInversionType()) {
                                        owner.spaceInversion();
                                    }

                                    owner.timeInversion();
                                    owner.CurrentTetromino.initIndex();
                                }
                                else {
                                    owner.TMinoPool.unshiftTetromino(owner.CurrentTetromino);
                                    owner.inverseLines();
                                    owner.FieldTimer.sleep(owner.TetrominoInverseInterval).then(() => {
                                        owner.inverseSetTetromino();
                                    })
                                }
                            }
                        }
                    });
                break;
        }
    }

    startRotate(dir) {
        if (this.RotateStatus == 0) {
            this.RotateStatus = dir + 1;
        }
    }

    rotateField() {
        switch (this.RotateStatus) {
            case 0:
                return;

            case 1:
                this.YAngle -= (1 * this.RotateSpeed / 180.0 * Math.PI);
                break;

            case 2:
                this.YAngle += (1 * this.RotateSpeed / 180.0 * Math.PI);
                break;
        }

        if (this.YAngle <= 0) {
            this.YAngle = 0;
            this.RotateStatus = 0;
        }
        else if (this.YAngle >= Math.PI) {
            this.YAngle = Math.PI;
            this.RotateStatus = 0;
        }

        this.CenterMesh.rotation.set(0, this.YAngle, 0);
    }

    checkTetromino(moveIndex) {
        var preCheckIndex = this.CurrentTetromino.getPreMoveIndex();
        for (var i = 0; i < 4; i++) {
            var x = preCheckIndex[i][0];
            var y = preCheckIndex[i][1];

            if (this.CurrentBufferPointer[y][x] == -1) {
                if (y == 0) {
                    return 2;
                }

                return -1;
            }
            else if (this.CurrentBufferPointer[y][x] > 0) {
                if (moveIndex[1] < 0) {
                    return 2;
                }

                return -1;
            }
        }

        return 1;
    }

    moveStateCheck(index) {
        if (this.CurrentTetromino == null || this.ControllSwitch == 1) {
            return;
        }

        this.CurrentTetromino.move(index);

        var state = this.checkTetromino(index);
        switch (state) {
            case 1:
                this.CurrentTetromino.applyIndex();
                break;

            case -1:
                this.CurrentTetromino.retriveMove(index)
                break;

            case 2:
                this.CurrentTetromino.retriveMove(index)
                this.lineDelete();

                if (this.TMinoPool.getSize() <= 0) {
                    this.setTetromino(null);

                    break;
                }

                this.ControllSwitch = 1;

                if (this.TInversionSwitch != 1) {
                    this.FieldTimer.sleep(this.TetrominoStartInterval).then(() => {
                        this.ControllSwitch = 0;
                        this.setTetromino(this.TMinoPool.shiftTetromino());
                    })
                }

                break;
        }
    }

    rotateStateCheck(dir) {
        if (this.CurrentTetromino == null) {
            return;
        }

        this.CurrentTetromino.rotate(dir)

        var state = this.checkTetromino([0, 0]);
        switch (state) {
            case 1:
                this.CurrentTetromino.applyIndex();
                break;

            case -1:
            case 2:
                this.CurrentTetromino.retriveRotate();
                break;
        }
    }

    lineDelete() {
        var tminoBuffer = this.CurrentTetromino.getPreMoveIndex();

        for (var i = 0; i < 4; i++) {
            var x = tminoBuffer[i][0];
            var y = tminoBuffer[i][1];

            this.CurrentTetromino.setBuiltIndex(i, [x, y]);

            this.CurrentBufferPointer[y][x] = this.CurrentTetromino.getTetrominoType();
            this.AnotherBufferPointer[y][this.FieldWidth - x + 1] = this.CurrentTetromino.getTetrominoType();

            var baseCube = this.CurrentTetromino.getBaseCubes(i);

            var index = baseCube.getIndex();
            var tx = index[0];
            var ty = index[1];

            if (this.SInversionSwitch == 1) {

                tx = this.FieldWidth - tx + 1;
                index[0] = tx;
                baseCube.setIndex(index);
            }

            this.BaseCubes[ty][tx] = baseCube;

            this.LineChecker[y]++;

            this.FieldMesh.add(baseCube.Mesh);
        }

        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.LineChecker[i] > 0) {

                for (var j = 1; j < this.FieldWidth + 1; j++) {
                    if (this.CurrentBufferPointer[i][j] == 0) {
                        this.LineChecker[i] = 0;
                        break;
                    }
                }
            }
        }

        var deleteVar = 0;

        this.FieldTimer.sleep(this.LineDeleteInterval).then(() => {
            for (var i = 1; i < this.FieldHeight + 1; i++) {
                if (this.PrevLineChecker[i] > 0) {
                    this.PrevLineChecker[i] = 0;

                    for (var j = 1; j < this.FieldWidth + 1; j++) {
                        this.DeletedBaseCubes[i][j] = null;
                    }
                }

                if (this.LineChecker[i] > 0) {
                    this.PrevLineChecker[i] = this.LineChecker[i];

                    for (var j = 1; j < this.FieldWidth + 1; j++) {
                        var x = j;
                        var y = i;

                        if (this.SInversionSwitch == 1) {
                            x = this.FieldWidth - x + 1;
                        }

                        var baseCube = this.BaseCubes[y][x];

                        if (baseCube != null) {

                            this.CurrentBufferPointer[i][j] = 0;
                            this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

                            this.BaseCubes[y][x] = null;
                            this.DeletedBaseCubes[y][x] = baseCube;

                            this.FieldMesh.remove(baseCube.Mesh);
                        }
                    }

                    this.LineChecker[i] = 0;

                    deleteVar++;
                }
                else {
                    this.DeleteChecker[i] = deleteVar;
                }
            }
        })

        this.FieldTimer.sleep(this.LineDeleteInterval).then(() => {
            for (var i = 1; i < this.FieldHeight + 1; i++) {
                this.PrevDeleteChecker[i] = 0;
                if (this.DeleteChecker[i] > 0) {
                    for (var j = 1; j < this.FieldWidth + 1; j++) {
                        var x = j;
                        var y = i;

                        if (this.SInversionSwitch == 1) {
                            x = this.FieldWidth - x + 1;
                        }

                        var baseCube = this.BaseCubes[y][x];

                        if (baseCube != null) {
                            var index = baseCube.getIndex();

                            if (index[1] == y) {
                                index[1] -= this.DeleteChecker[i];

                                this.CurrentBufferPointer[i - this.DeleteChecker[i]][j] = this.CurrentBufferPointer[i][j];
                                this.CurrentBufferPointer[i][j] = 0;

                                this.AnotherBufferPointer[i - this.DeleteChecker[i]][this.FieldWidth - j + 1] = this.AnotherBufferPointer[i][this.FieldWidth - j + 1];
                                this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

                                baseCube.setIndex(index);

                                this.BaseCubes[y - this.DeleteChecker[i]][x] = baseCube;
                                this.BaseCubes[y][x] = null;
                            }
                        }
                    }
                }

                this.PrevDeleteChecker[i - this.DeleteChecker[i]] = this.DeleteChecker[i];
                this.DeleteChecker[i] = 0;
            }
        })

    }

    inverseLines() {
        this.FieldTimer.sleep(this.LineInverseInterval).then(() => {
            for (var i = this.FieldHeight; i >= 0; i--) {
                if (this.PrevDeleteChecker[i] > 0) {
                    for (var j = 1; j < this.FieldWidth + 1; j++) {
                        var x = j;
                        var y = i;

                        if (this.PrevTetromino.getSpaceInversionType() == 1) {
                            x = this.FieldWidth - x + 1;
                        }

                        var baseCube = this.BaseCubes[y][x];

                        if (baseCube != null) {
                            var index = baseCube.getIndex();

                            if (index[1] == y) {
                                index[1] += this.PrevDeleteChecker[i];

                                var prevCurrentPointer = 0;
                                var prevAnotherPointer = 0;

                                // if (this.SInversionSwitch == this.PrevTetromino.getSpaceInversionType()) 
                                {
                                    prevCurrentPointer = this.CurrentBufferPointer[i][j];
                                    prevAnotherPointer = this.AnotherBufferPointer[i][this.FieldWidth - j + 1];
                                }
                                // else {
                                //     prevCurrentPointer = this.AnotherBufferPointer[i][j];
                                //     prevAnotherPointer = this.CurrentBufferPointer[i][this.FieldWidth - j + 1];
                                // }

                                this.CurrentBufferPointer[i + this.PrevDeleteChecker[i]][j] = prevCurrentPointer;
                                this.CurrentBufferPointer[i][j] = 0;

                                this.AnotherBufferPointer[i + this.PrevDeleteChecker[i]][this.FieldWidth - j + 1] = prevAnotherPointer;
                                this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

                                baseCube.setIndex(index);

                                this.BaseCubes[y + this.PrevDeleteChecker[i]][x] = baseCube;
                                this.BaseCubes[y][x] = null;
                            }
                        }
                    }
                }

                this.PrevDeleteChecker[i] = 0;
            }
        })


        this.FieldTimer.sleep(this.LineInverseInterval).then(() => {
            for (var i = this.FieldHeight; i >= 0; i--) {
                if (this.PrevLineChecker[i]) {
                    for (var j = 1; j < this.FieldWidth + 1; j++) {
                        var x = j;
                        var y = i;

                        if (this.PrevTetromino.getSpaceInversionType() == 1) {
                            x = this.FieldWidth - x + 1;
                        }

                        var baseCube = this.DeletedBaseCubes[y][x];

                        if (baseCube != null) {
                            this.FieldMesh.add(baseCube.Mesh);

                            this.CurrentBufferPointer[y][x] = baseCube.getType();
                            this.AnotherBufferPointer[y][this.FieldWidth - x + 1] = baseCube.getType();

                            this.BaseCubes[y][x] = baseCube;
                        }
                    }
                }
            }

            var tminoBuffer = this.PrevTetromino.getBuiltIndex();

            for (var i = 0; i < 4; i++) {
                var x = tminoBuffer[i][0];
                var y = tminoBuffer[i][1];

                this.CurrentBufferPointer[y][x] = 0;
                this.AnotherBufferPointer[y][this.FieldWidth - x + 1] = 0;

                if (this.PrevTetromino.getSpaceInversionType() == 1) {
                    x = this.FieldWidth - x + 1;
                }

                this.BaseCubes[y][x] = null;
            }
        })
    }
}