class Timer {
    
    constructor() {
        this.TimerId = 0;
        this.TimeCounter = 0
        this.TimeInterval = 0.1;
    }

    time() {
        this.TimeCounter += this.TimeInterval;
    }

    setSpeed(speed) {
        this.TimeInterval = speed / 10.0;
    }

    start() {
        var that = this;
        this.TimerId = setInterval(
            function() {
                that.time()
            }, 100);
    }

    stop() {
        clearInterval(this.TimerId)
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    update(owner, timeInterval, callback) {
        if (this.TimeCounter > timeInterval){
            this.TimeCounter = 0;
            callback(owner);
        }
    }
}