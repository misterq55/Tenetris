class Field {
    constructor() {
        this.FieldWidth = 10;
        this.FieldHeight = 22;

        this.FieldMesh = new THREE.Group();
        this.FieldMesh.position.set(-5.5, 0, 0);

        this.Mesh = new THREE.Group();
        this.Mesh.add(this.FieldMesh);

        this.Mesh.position.set(5.5, 0, 0);

        this.Buffer = null;
        this.ReverseBuffer = null;

        this.CurrentBufferPointer = null;
        this.AnotherBufferPointer = null;

        this.BaseCubes = null;

        this.CurrentTetromino = null;

        this.LineChecker = null;
        this.DeleteChecker = null;

        this.SInversionSwitch = 0;

        this.init();
    }

    setTetromino(currentTetromino) {
        this.CurrentTetromino = currentTetromino;

        
    }

    init() {
        this.BaseCubes = new Array(this.FieldHeight + 2);
        this.ReverseBaseCubes = new Array(this.FieldHeight + 2);

        this.CurrentBaseCubesPointer = this.BaseCubes;
        this.AnotherBaseCubesPointer = this.ReverseBaseCubes;

        this.Buffer = new Array(this.FieldHeight + 2);
        this.ReverseBuffer = new Array(this.FieldHeight + 2);

        this.CurrentBufferPointer = this.Buffer;
        this.AnotherBufferPointer = this.ReverseBuffer;

        this.LineChecker = new Array(this.FieldHeight + 2);
        this.DeleteChecker = new Array(this.FieldHeight + 2);

        for (var i = 0; i < this.FieldHeight + 2; i++) {
            this.Buffer[i] = new Array(this.FieldWidth + 2);
            this.ReverseBuffer[i] = new Array(this.FieldWidth + 2);
            this.BaseCubes[i] = new Array(this.FieldWidth + 2);
            this.ReverseBaseCubes[i] = new Array(this.FieldWidth + 2);
            this.LineChecker[i] = 0;
            this.DeleteChecker[i] = 0;

            for (var j = 0; j < this.FieldWidth + 2; j++) {
                this.Buffer[i][j] = 0;
                this.ReverseBuffer[i][j] = 0;

                if (i == 0 || i == this.FieldHeight + 1 ||
                    j == 0 || j == this.FieldWidth + 1) {
                    var baseCube = new BaseCube(0x808080, [j, i]);
                    // this.BaseCubes[i][j] = baseCube;
                    this.Buffer[i][j] = -1;
                    this.ReverseBuffer[i][j] = -1;
                    this.FieldMesh.add(baseCube.Mesh);
                }
            }
        }
    }

    spaceInversion(spaceInversionSwitch) {
        this.SInversionSwitch = spaceInversionSwitch;

        if (this.SInversionSwitch == 0) {
            this.CurrentBufferPointer = this.Buffer;
            this.AnotherBufferPointer = this.ReverseBuffer;

            this.CurrentBaseCubesPointer = this.BaseCubes;
            this.AnotherBaseCubesPointer = this.ReverseBaseCubes;
        }
        else if (this.SInversionSwitch == 1) {
            this.CurrentBufferPointer = this.ReverseBuffer;
            this.AnotherBufferPointer = this.Buffer;

            this.CurrentBaseCubesPointer = this.ReverseBaseCubes;
            this.AnotherBaseCubesPointer = this.BaseCubes;
        }
    }

    checkTetromino(preCheckIndex) {
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
                return 2;
            }
        }

        return 1;
    }

    lineDelete() {
        var tminoBuffer = this.CurrentTetromino.getPreMoveIndex();

        for (var i = 0; i < 4; i++) {
            var x = tminoBuffer[i][0];
            var y = tminoBuffer[i][1];

            this.CurrentBufferPointer[y][x] = this.CurrentTetromino.getTetrominoType();
            this.AnotherBufferPointer[y][this.FieldWidth - x + 1] = this.CurrentTetromino.getTetrominoType();

            var baseCube = this.CurrentTetromino.getBaseCubes(i);

            var index = baseCube.getIndex();
            var tx = index[0];
            var ty = index[1];
            
            if (this.SInversionSwitch == 1) {
                index[0] = this.FieldWidth - tx + 1;
                // x = this.FieldWidth - tx + 1;
                baseCube.setIndex(index);
            }

            this.CurrentBaseCubesPointer[y][x] = baseCube;
            this.AnotherBaseCubesPointer[y][this.FieldWidth - x + 1] = baseCube;

            // this.BaseCubes[y][x] = baseCube;

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

        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.LineChecker[i] > 0) {
                for (var j = 1; j < this.FieldWidth + 1; j++) {

                    var baseCube = this.CurrentBaseCubesPointer[i][j];
                    
                    if (baseCube != null) {
                        this.CurrentBaseCubesPointer[i][j] = null;
                        this.AnotherBaseCubesPointer[i][this.FieldWidth - j + 1] = null;

                        this.CurrentBufferPointer[i][j] = 0;
                        this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

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

        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.DeleteChecker[i] > 0) {
                for (var j = 1; j < this.FieldWidth + 1; j++) {

                    var baseCube = this.CurrentBaseCubesPointer[i][j];
                    
                    if (baseCube != null) {
                        // var index = baseCube.getIndex();

                        // var py = index[1];

                        // index[1] -= this.DeleteChecker[i];

                        // var x = index[0];
                        // var y = index[1];

                        // this.CurrentBufferPointer[y][x] = this.CurrentBufferPointer[py][x];
                        // this.CurrentBufferPointer[py][x] = 0;

                        // this.AnotherBufferPointer[y][this.FieldWidth - x + 1] = this.AnotherBufferPointer[py][this.FieldWidth - x + 1];
                        // this.AnotherBufferPointer[py][this.FieldWidth - x + 1] = 0;

                        // this.BaseCubes[y][x] = baseCube;
                        // this.BaseCubes[py][x] = null;

                        var index = baseCube.getIndex();
                        index[1] -= this.DeleteChecker[i];

                        this.CurrentBufferPointer[i - this.DeleteChecker[i]][j] = this.CurrentBufferPointer[i][j];
                        this.CurrentBufferPointer[i][j] = 0;

                        this.AnotherBufferPointer[i - this.DeleteChecker[i]][this.FieldWidth - j + 1] = this.AnotherBufferPointer[i][this.FieldWidth - j + 1];
                        this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

                        baseCube.setIndex(index);

                        this.CurrentBaseCubesPointer[i - this.DeleteChecker[i]][j] = baseCube;
                        this.CurrentBaseCubesPointer[i][j] = null;

                        this.AnotherBaseCubesPointer[i - this.DeleteChecker[i]][this.FieldWidth - j + 1] = baseCube;
                        this.AnotherBaseCubesPointer[i][j] = null;
                    }
                }
            }
            
            this.DeleteChecker[i] = 0;
        }
    }
}