class BaseCube {
    constructor(CubeColor, index) {
        this.Position = new THREE.Vector3(0, 0, 0);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: CubeColor });
        this.Mesh = new THREE.Mesh(geometry, material);
        
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
}

class Tetromino {
    constructor () {
        this.BaseIndex = [0,0]
        this.Buffer = new Array(4);
        this.Mesh = new THREE.Group();
        this.BaseCubes = new Array(4);

        for (var i = 0; i < this.Buffer.length; i++) {
            this.Buffer[i] = new Array(4);
        }
    }

    setBaseCubes(color) {
        for (var i = 0; i < 4; i++) {
            var index = [this.BaseIndex[0] + this.IndexArr[i][0], this.BaseIndex[1] + this.IndexArr[i][1]]
            var basecube = new BaseCube(color, index)
            this.BaseCubes[i] = basecube
            this.Mesh.add(basecube.Mesh)
        }
    }

    setIndex(index) {
        for (var i = 0; i < 4; i++) {
            var currentIndex = this.BaseCubes[i].getIndex();
            var newX = parseInt(index[0], 10) + parseInt(currentIndex[0], 10);
            var newY = parseInt(index[1], 10) + parseInt(currentIndex[1], 10);
            
            var newIndex = [newX, newY]
            this.BaseCubes[i].setIndex(newIndex)
        }
    }

    update() {
        var moveIndex = [0, -1];

        this.move(moveIndex);
    }

    move(moveIndex) {
        this.BaseIndex[0] += moveIndex[0];
        this.BaseIndex[1] += moveIndex[1];

        this.setIndex(this.BaseIndex)
    }

    rotate() {

    }
}

class TMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,1], [1,2], [2,3], [3,0]]
        
        super.setBaseCubes(0x8b00ff)
    }
}

class ZMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,3], [2,2], [2,3], [3,2]]
        
        super.setBaseCubes(0xff0000)
    }
}

class SMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,2], [2,2], [2,3], [3,3]]
        
        super.setBaseCubes(0xf00ff00)
    }
}

class IMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,0], [1,1], [1,2], [1,3]]
        
        super.setBaseCubes(0x50bcdf)
    }
}

class OMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,1], [1,2], [2,1], [2,2]]
        
        super.setBaseCubes(0xffff00)
    }
}

class JMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,1], [2,1], [2,2], [2,3]]
        
        super.setBaseCubes(0x0000ff)
    }
}

class LMino extends Tetromino {
    constructor() {
        super()
        this.IndexArr = [[1,1], [1,2], [1,3], [2,1]]
        
        super.setBaseCubes(0xff7f00)
    }
}