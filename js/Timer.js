class Timer {
    static TimeCounter = 0
    static TimeInterval = 1;
    
    constructor() {
        this.TimerId = 0;
    }

    time() {
        Timer.TimeCounter += Timer.TimeInterval;
    }

    start() {
        this.TimerId = setInterval(this.time, 1000);
    }

    stop() {
        clearInterval(this.TimerId)
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}