class TetrominoBag {
    constructor() {
        // this.MinoTextureDictionary = ["sky", "purple", "orange", "green", "yellow", "red", "blue"];
        this.Bag = [];
        // this.Bag = [new IMino()
        //     , new TMino()
        //     , new LMino()
        //     , new SMino()
        //     , new OMino()
        //     , new ZMino()
        //     , new JMino()]

        // let timeInterval = 30;

        // for (let i = 0, p = Promise.resolve(); i < this.MinoTextureDictionary.length; i++) {
        //     let cubeTextureName = this.MinoTextureDictionary[i];
        //     p = p.then(_=> new Promise(
        //         resolve =>
        //             setTimeout(function () {
        //                 if (TextureManager.getInstance().Dictionary[cubeTextureName] == null) {
        //                     TextureManager.getInstance().loadTexture(cubeTextureName, function (textureInstance) {}).then(async function (cubeTexture) {
        //                         TextureManager.getInstance().Dictionary[cubeTextureName] = cubeTexture;
        //                         this.Bag.push(createTetromino(i, cubeTexture));
        //                     })
        //                 }
        //                 else {
        //                     this.Bag.push(createTetromino(i, TextureManager.getInstance().Dictionary[cubeTextureName]));
        //                 }
        //             }, Math.random() * timeInterval)
        //     ))
        // }        

        for (var i = 0; i < 7; i++) {
            var cubeTextureName = OptionManager.getInstance().MinoTextureDictionary[i];
            this.Bag.push(this.createTetromino(i, TextureManager.getInstance().Dictionary[cubeTextureName]));
        }

        this.shuffle();

        this.Size = this.Bag.length;
    }

    createTetromino(idx, texture) {
        var tetromino = null;

        switch (idx) {
            case 0:
                tetromino = new IMino(texture);
                break;
            case 1:
                tetromino = new TMino(texture);
                break;
            case 2:
                tetromino = new LMino(texture);
                break;
            case 3:
                tetromino = new SMino(texture);
                break;
            case 4:
                tetromino = new OMino(texture);
                break;
            case 5:
                tetromino = new ZMino(texture);
                break;
            case 6:
                tetromino = new JMino(texture);
                break;
        }

        return tetromino;
    }

    getSize() {
        return this.Size;
    }

    popTetromino() {
        var tetromino = this.Bag[0];
        this.Bag.shift();

        return tetromino;
    }

    shuffle () {
        for (var i = this.Bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            var temp = this.Bag[i];
            this.Bag[i] = this.Bag[j];
            this.Bag[j] = temp;
        }
    }
}

class TetrominoPool {
    constructor() {
        this.Pool = [];

        for (var i = 0; i < 2; i ++) {
            this.addBag();
        }

        this.Count = 0;

        this.AdvisedSize = 7;
    }

    addBag() {
        var tetrominoBag = new TetrominoBag();
        
        for (var i = 0; i < tetrominoBag.getSize(); i++) {
            this.Pool.push(tetrominoBag.popTetromino());
        }
    }

    popTetromino() {
     var tetromino = this.Pool[0];
     this.Pool.shift();

     if (this.Pool.length < this.AdvisedSize) {
         this.addBag();
     }

     return tetromino;
    }

    getSize() {
        return this.Pool.length;
    }
}