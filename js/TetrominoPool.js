class TetrominoBag {
    constructor() {
        // this.Bag = [new IMino()
        //     , new TMino()
        //     , new LMino()
        //     , new SMino()
        //     , new OMino()
        //     , new ZMino()
        //     , new JMino()]

        //     this.shuffle();

        this.Bag = [new TMino()
                , new TMino()
                , new TMino()]

            this.Size = this.Bag.length;
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