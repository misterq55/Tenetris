class Field {
    constructor(index) {
        this.BaseIndex = index
        this.FieldWidth = 10;
        this.FieldHeight = 22;

        this.Mesh = new THREE.Group();
        
        this.Buffer = null;
        this.BaseCubes = null;

        this.CurrentTetromino = null;

        this.LineChecker = null;

        this.init();
    }

    setTetromino(currentTetromino) {
        this.CurrentTetromino = currentTetromino;

        for (var i = 0; i < 4; i++) {
            this.Mesh.add(this.CurrentTetromino.getBaseCubes(i).Mesh);
        }
    }

    init() {
        this.Buffer = new Array(this.FieldHeight + 2);
        this.BaseCubes = new Array((this.FieldHeight + 2) * (this.FieldWidth + 2));

        this.LineChecker = new Array(this.FieldHeight + 2);
        
        for (var i = 0; i < this.FieldHeight + 2; i++) {
            this.Buffer[i] = new Array(this.FieldWidth + 1);
            this.LineChecker[i] = 0;

            for (var j = 0; j < this.FieldWidth + 2; j++) {
                this.Buffer[i][j] = 0;

                if (i == 0 || i == this.FieldHeight + 1||
                    j == 0 || j == this.FieldWidth + 1)
                    {
                        var baseCube = new BaseCube(0x808080, [j + this.BaseIndex[0], i + this.BaseIndex[1]]);
                        this.BaseCubes[j + i * (this.FieldWidth + 2)] = baseCube;
                        this.Buffer[i][j] = -1;
                        this.Mesh.add(baseCube.Mesh);    
                    }
            }
        }
    }

    checkTetromino (preCheckIndex) {
        for (var i = 0; i < 4; i++) {
            var x = preCheckIndex[i][0];
            var y = preCheckIndex[i][1];

            if (this.Buffer[y][x] == -1) {
                if (y == 0) {
                    return 2;
                }
                
                return -1;
            }
            else if (this.Buffer[y][x] == 1) {
                return 2;
            }
        }

        return 1;
    }

    setTMinoBuffer (tminoBuffer) {
        for (var i = 0; i < 4; i++) {
            var x = tminoBuffer[i][0];
            var y = tminoBuffer[i][1];

            this.Buffer[y][x] = this.CurrentTetromino.getTetrominoType();

            var baseCube = this.CurrentTetromino.getBaseCubes(i);
            this.BaseCubes[x + y * (this.FieldWidth + 2)] = baseCube;

            this.LineChecker[y]++;
        }

        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.LineChecker[i] > 0) {

                for (var j = 1; j < this.FieldWidth + 1; j++) {
                    if (this.Buffer[i][j] == 0) {
                        this.LineChecker[i] = 0;
                        break;
                    }    
                }
            }
        }
        
        for (var i = 1; i < this.FieldHeight + 1; i++) {
            if (this.LineChecker[i] > 0) {
                for (var j = 1; j < this.FieldWidth + 1; j++) {
                    var baseCube = this.BaseCubes[j + i * (this.FieldWidth + 2)];
                    this.BaseCubes[j + i * (this.FieldWidth + 2)] = null;

                    this.Mesh.remove(baseCube.Mesh);
                }
            }
        }
    }
}