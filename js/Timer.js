class Timer {
    static TimeCounter = 0
    constructor() {
        this.timerId = 0;
    }

    time() {
        Timer.TimeCounter += 1;
    }

    start() {
        this.timerId = setInterval(this.time, 1000);
        // this.timerId = setInterval(_.bind(function() {this.time();}, this), 1000);
    }

    stop() {
        clearInterval(this.timerId)
    }
}