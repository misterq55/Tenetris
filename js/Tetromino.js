class BaseCube {
    constructor(cubeTexture, index) {
        this.Position = new THREE.Vector3(0, 0, 0);

        var geometry = new THREE.BoxGeometry(1, 1, 1);

        var tex = new THREE.MeshLambertMaterial({map: cubeTexture});

        this.Mesh = new THREE.Mesh(geometry, tex);
        this.setIndex(index)
    }

    setIndex(index) {
        this.Index = index
        this.Position.x = this.Index[0];
        this.Position.y = this.Index[1];

        this.Mesh.position.set(this.Position.x, this.Position.y, this.Position.z)
    }

    getIndex() {
        return this.Index;
    }

    setRotation(dir) {
        if (dir == 1) {
            this.Mesh.rotation.set(0, Math.PI, 0);
        }
    }
}

class Tetromino {
    static StartIndex = null;

    constructor(cubeTexture) {
        this.BaseIndex = Tetromino.StartIndex
        this.Buffer = new Array(4);
        this.Mesh = new THREE.Group();
        this.BaseCubes = new Array(4);
        this.MoveAccumulate = [0, 0];
        this.PrevRotateIndex = [];
        
        this.TetrominoType = 0;

        this.CubeTexture = cubeTexture;

        this.MoveIndexArray = [];

        this.StartIndex = new Array(4);

        for (var i = 0; i < this.Buffer.length; i++) {
            this.Buffer[i] = new Array(4);
        }
    }

    getTetrominoType() {
        return this.TetrominoType;
    }

    setBaseCubes() {
        this.PreMoveIndex = new Array(4);
        var moveIndex = new Array(4);

        for (var i = 0; i < 4; i++) {

            this.PreMoveIndex[i] = [this.IndexArr[i][0], this.IndexArr[i][1]];
            this.StartIndex[i] = [this.IndexArr[i][0], this.IndexArr[i][1]];

            var newX = parseInt(this.BaseIndex[0], 10) + parseInt(this.IndexArr[i][0], 10);
            var newY = parseInt(this.BaseIndex[1], 10) + parseInt(this.IndexArr[i][1], 10);

            var index = [newX, newY]

            this.PreMoveIndex[i][0] = index[0];
            this.PreMoveIndex[i][1] = index[1];

            moveIndex[i] = [newX, newY];

            var basecube = new BaseCube(this.CubeTexture, index)
            this.BaseCubes[i] = basecube
        }

        this.MoveIndexArray.push(moveIndex);
    }
    
    getBaseCubes(idx) {
        return this.BaseCubes[idx];
    }

    setIndex(index) {
        for (var i = 0; i < 4; i++) {
            var newX = parseInt(index[i][0], 10);
            var newY = parseInt(index[i][1], 10);

            var newIndex = [newX, newY]

            this.BaseCubes[i].setIndex(newIndex)
        }
    }

    calculatePreMove() {
        for (var i = 0; i < 4; i++) {
            this.PreMoveIndex[i][0] = parseInt(this.IndexArr[i][0], 10) + parseInt(this.BaseIndex[0], 10) + parseInt(this.MoveAccumulate[0], 10);
            this.PreMoveIndex[i][1] = parseInt(this.IndexArr[i][1], 10) + parseInt(this.BaseIndex[1], 10) + parseInt(this.MoveAccumulate[1], 10);
        }
    }

    move(moveIndex) {
        this.MoveAccumulate[0] = parseInt(this.MoveAccumulate[0], 10) + parseInt(moveIndex[0], 10);
        this.MoveAccumulate[1] = parseInt(this.MoveAccumulate[1], 10) + parseInt(moveIndex[1], 10);

        this.calculatePreMove();
    }

    retriveMove(moveIndex) {
        this.MoveAccumulate[0] = parseInt(this.MoveAccumulate[0], 10) - parseInt(moveIndex[0], 10);
        this.MoveAccumulate[1] = parseInt(this.MoveAccumulate[1], 10) - parseInt(moveIndex[1], 10);

        this.calculatePreMove();
    }

    retriveRotate() {
        this.IndexArr = this.PrevRotateIndex.slice();
    }

    getPreMoveIndex() {
        return this.PreMoveIndex;
    }

    rotate(dir) {
        this.PrevRotateIndex = this.IndexArr.slice();
        var rotateIndex = this.IndexArr.slice();

        for (var i = 0; i < 4; i++) {
            var x = this.IndexArr[i][0];
            var y = this.IndexArr[i][1];

            if (dir == 0) {
                switch (x) {
                    case 0:
                        if (y == 0) {
                            y = 2;
                        }
                        else if (y == 1) {
                            x = 1;
                            y = 2;
                        }
                        else if (y == 2) {
                            x = 2;
                        }
                        break;

                    case 1:
                        if (y == 0) {
                            x = 0;
                            y = 1;
                        }
                        else if (y == 2) {
                            x = 2;
                            y = 1;
                        }
                        break;

                    case 2:
                        if (y == 0) {
                            x = 0;
                        }
                        else if (y == 1) {
                            x = 1;
                            y = 0;
                        }
                        else if (y == 2) {
                            y = 0;
                        }
                        break;
                }
            }
            else if (dir == 1) {
                switch (x) {
                    case 0:
                        if (y == 0) {
                            x = 2;
                            y = 0;
                        }
                        else if (y == 1) {
                            x = 1;
                            y = 0;
                        }
                        else if (y == 2) {
                            y = 0;
                        }
                        break;

                    case 1:
                        if (y == 0) {
                            x = 2;
                            y = 1;
                        }
                        else if (y == 2) {
                            x = 0;
                            y = 1;
                        }
                        break;

                    case 2:
                        if (y == 0) {
                            x = 2;
                            y = 2
                        }
                        else if (y == 1) {
                            x = 1;
                            y = 2;
                        }
                        else if (y == 2) {
                            x = 0;
                        }
                        break;
                }
            }

            rotateIndex[i][0] = x;
            rotateIndex[i][1] = y;
        }

        this.IndexArr = rotateIndex;

        this.calculatePreMove();
    }

    applyIndex() {
        var moveIndex = new Array(4);
        
        for (var i = 0; i < 4; i++) {
            moveIndex[i] = [this.PreMoveIndex[i][0], this.PreMoveIndex[i][1]];
        }

        this.MoveIndexArray.push(moveIndex);
        this.setIndex(this.PreMoveIndex)
    }

    inverseTetromino() {
        if (this.MoveIndexArray.length <= 0) {
            this.MoveAccumulate[0] = this.MoveAccumulate[1] = 0;
            
            for (var i = 0; i < 4; i++) {
                this.IndexArr[i][0] = this.StartIndex[i][0];
                this.IndexArr[i][1] = this.StartIndex[i][1];
            }

            return 1;
        }

        var moveIndex = this.MoveIndexArray[this.MoveIndexArray.length - 1];
        this.MoveIndexArray.pop();
        this.setIndex(moveIndex);

        return 0;
    }
}

class TMino extends Tetromino {
    constructor(cubeTexture) {
        super(cubeTexture)
        this.IndexArr = [[0, 1], [1, 1], [1, 2], [2, 1]]

        this.TetrominoType = 1;
        super.setBaseCubes();
    }

    rotate(dir) {
        super.rotate(dir);
    }
}

class ZMino extends Tetromino {
    constructor(cubeTexture) {
        super(cubeTexture)
        this.IndexArr = [[0, 2], [1, 2], [1, 1], [2, 1]]

        this.TetrominoType = 2;
        super.setBaseCubes();
    }

    rotate(dir) {
        super.rotate(dir);
    }
}

class SMino extends Tetromino {
    constructor(cubeTexture) {
        super(cubeTexture)
        this.IndexArr = [[0, 1], [1, 1], [1, 2], [2, 2]]

        this.TetrominoType = 3;

        super.setBaseCubes();
    }

    rotate(dir) {
        super.rotate(dir);
    }
}

class IMino extends Tetromino {
    constructor(cubeTexture) {
        super(cubeTexture)
        this.IndexArr = [[0, 2], [1, 2], [2, 2], [3, 2]]

        this.TetrominoType = 4;

        super.setBaseCubes();

        this.IMinoStatus = 0;
        this.PrevIMinoStatus = 0;
    }

    rotate(dir) {
        this.PrevRotateIndex = this.IndexArr.slice();
        this.PrevIMinoStatus = this.IMinoStatus;

        if (dir == 0) {
            this.IMinoStatus++;
        }
        else if (dir == 1) {
            this.IMinoStatus--;
        }

        if (this.IMinoStatus > 3) {
            this.IMinoStatus = 0;
        }
        else if (this.IMinoStatus < 0) {
            this.IMinoStatus = 3;
        }

        switch (this.IMinoStatus) {
            case 0:
                this.IndexArr = [[0, 2], [1, 2], [2, 2], [3, 2]];
                break;

            case 1:
                this.IndexArr = [[2, 0], [2, 1], [2, 2], [2, 3]];
                break;

            case 2:
                this.IndexArr = [[0, 1], [1, 1], [2, 1], [3, 1]];
                break;

            case 3:
                 this.IndexArr = [[1, 0], [1, 1], [1, 2], [1, 3]];
                 break;
        }
        
        this.calculatePreMove();
    }

    retriveRotate() {
        this.IndexArr = this.PrevRotateIndex.slice();
        this.IMinoStatus = this.PrevIMinoStatus;
    }
}

class OMino extends Tetromino {
    constructor(cubeTexture) {
        super(cubeTexture)
        this.IndexArr = [[1, 0], [1, 1], [2, 0], [2, 1]]

        this.TetrominoType = 5;

        super.setBaseCubes();
    }

    rotate(dir) {

    }
}

class JMino extends Tetromino {
    constructor(cubeTextureName) {
        super(cubeTextureName)
        this.IndexArr = [[0, 1], [1, 1], [2, 1], [0, 2]]

        this.TetrominoType = 6;

        super.setBaseCubes(cubeTextureName);
    }

    rotate(dir) {
        super.rotate(dir);
    }
}

class LMino extends Tetromino {
    constructor(cubeTextureName) {
        super(cubeTextureName)
        this.IndexArr = [[0, 1], [1, 1], [2, 1], [2, 2]]

        this.TetrominoType = 7;

        super.setBaseCubes(cubeTextureName);
    }

    rotate(dir) {
        super.rotate(dir);
    }
}

class GuideMino extends Tetromino {
    constructor(cubeTextureName) {
        super(cubeTextureName)

        super.setBaseCubes(cubeTextureName);
    }

    resetBaseCubes(newIndexArr) {
        this.IndexArr = newIndexArr;

        for (var i = 0; i < 4; i++) {

            this.PreMoveIndex[i] = [this.IndexArr[i][0], this.IndexArr[i][1]];

            var newX = parseInt(this.BaseIndex[0], 10) + parseInt(this.IndexArr[i][0], 10);
            var newY = parseInt(this.BaseIndex[1], 10) + parseInt(this.IndexArr[i][1], 10);

            var index = [newX, newY]

            this.PreMoveIndex[i][0] = index[0];
            this.PreMoveIndex[i][1] = index[1];

            this.BaseCubes[i].setIndex(index);
        }
    }
}