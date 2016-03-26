var canvas = document.querySelector("canvas");

var PIXEL_RATIO = (function() {
    var ctx = canvas.getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


var createHiDPICanvas = function() {
    var ratio = PIXEL_RATIO;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    // canvas.style.width = window.innerWidth + "px";
    // canvas.style.height = window.innerHeight + "px";
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
};


var canvas = createHiDPICanvas();
var ctx = canvas.getContext("2d");

var TAU = 2 * Math.PI;

times = [];

var loop = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(loop);
};

var Ball = function(startX, startY, startVelX, startVelY) {
    this.x = startX || Math.random() * canvas.width;
    this.y = startY || Math.random() * canvas.height;
    this.vel = {
        x: startVelX || (Math.random() * 2 - 1) / 5,
        y: startVelY || (Math.random() * 2 - 1) / 5
    };
    this.update = function(canvas) {
        if (this.x > canvas.width + 50 || this.x < -50) {
            this.vel.x = -this.vel.x;
        }
        if (this.y > canvas.height + 50 || this.y < -50) {
            this.vel.y = -this.vel.y;
        }
        this.x += this.vel.x;
        this.y += this.vel.y;
    };
    this.draw = function(ctx, can) {
        ctx.beginPath();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#000';
        ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, 3, 0, TAU, false);
        // ctx.arc((0 + this.x) | 0, (0 + this.y) | 0, 3, 0, TAU, false);
        ctx.fill();
    };
};

var balls = [];
for (var i = 0; i < canvas.width * canvas.height / (75 * 75); i++) {
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height));
}

var lastTime = Date.now();

var update = function() {
    var diff = Date.now() - lastTime;
    for (var frame = 0; frame * 16.6667 < diff; frame++) {
        for (var index = 0; index < balls.length; index++) {
            balls[index].update(canvas);
        }
    }
    lastTime = Date.now();
};

function draw() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var index = 0; index < balls.length; index++) {
        var ball = balls[index];
        ball.draw(ctx, canvas);
        ctx.beginPath();
        for (var index2 = balls.length - 1; index2 > index; index2 += -1) {
            var ball2 = balls[index2];
            var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
            if (dist < 100) {
                ctx.strokeStyle = "#000";
                ctx.globalAlpha = 1 - (dist > 100 ? 0.8 : dist / 150);
                ctx.lineWidth = "1px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }
}

// Start
loop();

$(window).resize(function() {
    canvas = createHiDPICanvas();
    ctx = canvas.getContext("2d");
});

console.info("Props to Alex Wendland for this dope particle animation. http://codepen.io/awendland/pen/XJExGv");