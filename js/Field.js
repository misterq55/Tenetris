class Field {
    constructor() {
        this.FieldWidth = 10;
        this.FieldHeight = 22;

        this.FieldMesh = new THREE.Group();
        this.FieldMesh.position.set(-5.5, 0, 0);

        this.EdgeMesh = new THREE.Group();
        this.EdgeMesh.position.set(0, 0, 0);

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

        this.RotateStatus = 0;
        this.YAngle = 0;

        this.HighestLevel = 0;

        this.init();
    }

    setTetromino(currentTetromino) {
        this.CurrentTetromino = currentTetromino;
    }

    init() {
        this.BaseCubes = new Array(this.FieldHeight + 2);

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
            this.LineChecker[i] = 0;
            this.DeleteChecker[i] = 0;

            for (var j = 0; j < this.FieldWidth + 2; j++) {
                this.Buffer[i][j] = 0;
                this.ReverseBuffer[i][j] = 0;

                if (i == 0 || i == this.FieldHeight + 1 ||
                    j == 0 || j == this.FieldWidth + 1) {
                    var baseCube = new BaseCube(0x808080, [j, i]);
                    
                    this.EdgeMesh.add(baseCube.Mesh);
                    if (i != this.FieldHeight + 1) {
                        this.Buffer[i][j] = -1;
                        this.ReverseBuffer[i][j] = -1;
                    }
                }
            }
        }
    }

    spaceInversion(spaceInversionSwitch) {
        this.SInversionSwitch = spaceInversionSwitch;

        if (this.SInversionSwitch == 0) {
            this.CurrentBufferPointer = this.Buffer;
            this.AnotherBufferPointer = this.ReverseBuffer;
        }
        else if (this.SInversionSwitch == 1) {
            this.CurrentBufferPointer = this.ReverseBuffer;
            this.AnotherBufferPointer = this.Buffer;
        }
    }

    update() {
        this.rotateField();
    }

    startRotate(dir) {
        if (this.RotateStatus == 0) {
            this.spaceInversion(dir);
            this.RotateStatus = dir + 1;
        }
    }

    rotateField() {
        switch (this.RotateStatus) {
            case 0:
                return;

            case 1:
                this.YAngle -= (1 / 180.0 * Math.PI);
                break;

            case 2:
                this.YAngle += (1 / 180.0 * Math.PI);
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

        this.Mesh.rotation.set(0, this.YAngle, 0);
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

            if (y > this.HighestLevel) {
                this.HighestLevel = y;
            }

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

                baseCube.setRotation(this.SInversionSwitch);
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

        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.LineChecker[i] > 0) {
                for (var j = 1; j < this.FieldWidth + 1; j++) {

                    var x = 0;
                    var y = 0;

                    if (this.SInversionSwitch == 0) {
                        x = j;
                        y = i;
                    }
                    else if (this.SInversionSwitch == 1) {
                        x = this.FieldWidth - j + 1;
                        y = i;
                    }

                    var baseCube = this.BaseCubes[y][x];
                    
                    if (baseCube != null) {

                        this.CurrentBufferPointer[i][j] = 0;
                        this.AnotherBufferPointer[i][this.FieldWidth - j + 1] = 0;

                        this.BaseCubes[y][x] = null;

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
                    
                    var x = 0;
                    var y = 0;

                    if (this.SInversionSwitch == 0) {
                        x = j;
                        y = i;
                    }
                    else if (this.SInversionSwitch == 1) {
                        x = this.FieldWidth - j + 1;
                        y = i;
                    }

                    var baseCube = this.BaseCubes[y][x];
                    
                    if (baseCube != null) {
                        var index = baseCube.getIndex();
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
            
            this.DeleteChecker[i] = 0;
        }
    }
}