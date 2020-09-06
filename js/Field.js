class Field {
    constructor(index) {
        this.BaseIndex = index
        this.FieldWidth = 10;
        this.FieldHeight = 22;

        this.Mesh = new THREE.Group();
        
        this.Buffer = null;
        this.BaseCubes = null;

        this.CurrentTetromino = null;

        this.init();
    }

    setTetromino(currentTetromino) {
        this.CurrentTetromino = currentTetromino;
        this.Mesh.add(this.CurrentTetromino.Mesh);
    }

    init() {
        this.Buffer = new Array(this.FieldHeight + 1);
        this.BaseCubes = new Array((this.FieldHeight + 1) * (this.FieldWidth + 1));
        
        for (var i = 0; i < this.FieldHeight + 1; i++) {
            this.Buffer[i] = new Array(this.FieldWidth + 1);

            for (var j = 0; j < this.FieldWidth + 1; j++) {
                this.Buffer[i][j] = 0;

                if (i == 0 || i == this.FieldHeight||
                    j == 0 || j == this.FieldWidth)
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

            this.Buffer[y][x] = 1;
        }
    }
}