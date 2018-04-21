let canvas, c;
let nbOccurences = 500;
let circles = [];
let colors = ['orange', 'red', 'purple'];
// let colors = ['6DC0D5', 'DDFFF7', '93E1D8', '8CDFD6'];

let mouse = {
    x: undefined,
    y: undefined
};

let detectSeuil = 60;
let minRadius = 1;
let maxRadius = 40;

function init() {
    canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    c = canvas.getContext('2d');
}

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.datColorIndex = Math.floor(Math.random() * (colors.length - 0 + 1));

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // c.shadowColor = colors[this.datColorIndex];
        // c.shadowBlur = 20;
        
        c.fillStyle = colors[this.datColorIndex];
        c.fill();
    }

    this.update = function() {

        // Borders logic
        if (this.x > window.innerWidth - this.radius || this.x < 0) {
            this.dx = this.dx * -1;
        }
    
        if (this.y > window.innerHeight - this.radius || this.y < 0) {
            this.dy = this.dy * -1;
        }

        this.x += this.dx;
        this.y += this.dy;

        // interactivity
        if (mouse.x - this.x < detectSeuil && mouse.x - this.x > (detectSeuil * -1)
            && mouse.y - this.y < detectSeuil && mouse.y - this.y > (detectSeuil * -1)) {
            
            if (this.radius < maxRadius) {
                this.radius += 1;
                this.x += (this.dx * 4);
                this.y += (this.dy * 4);
                // this.dx *= 2;
                // this.dy *= 2;
                // c.shadowBlur = 20;
            }

        } else if (this.radius > minRadius) {
            this.radius -= 1;
        }

        this.draw();
    }
}

function animate() {
    requestAnimationFrame(animate);
    console.log('frame');

    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    circles.forEach(circle => circle.update());
}



for (let i = 0; i < nbOccurences; i++) {
    let x, y, dx, dy, radius;

    x = Math.random() * window.innerWidth - 40;
    y = Math.random() * window.innerHeight - 40;
    dx = Math.random() * 1.2;
    dy = Math.random() * 1.2;
    radius = Math.random() * 80;

    circles.push(new Circle(x, y, dx, dy, radius));
}


init();
animate();