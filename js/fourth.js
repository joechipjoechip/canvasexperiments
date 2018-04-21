let canvas, c;
let nbOccurences = 700;
let circles = [];
let traits = [];
let colorz = ['orange', 'red', 'purple', 'rebeccapurple'];
// let colors = ['#6DC0D5', '#DDFFF7', '#93E1D8', '#8CDFD6', '#424B54'];
let colors = [
    'rgba(109,192,213,0.5)',
    'rgba(221,255,247,0.5)',
    'rgba(147,225,216,0.5)',
    'rgba(255,147,79,0.2)'
];

let mouse = {
    x: undefined,
    y: undefined
};

let detectSeuil = 45;
let minRadius = 1;
let maxRadius = 150;

let clicked = false;

function init() {
    canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    c = canvas.getContext('2d');

    attachEvents();
}

function attachEvents () {
    
    window.addEventListener('mousemove', e => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mousedown', e => {
        clicked = true;
    });
    
    window.addEventListener('mouseup', e => {
        clicked = false;
    });
    
    window.addEventListener('touchstart', e => {
        clicked = true;
    });
    
    window.addEventListener('touchend', e => {
        clicked = false;
    });

}


class Particule {

    constructor (x, y, dx, dy, radius) {
        
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.size = radius;

        this.datColorIndex = Math.floor(Math.random() * (colors.length - 0 + 1));
        this.color = colors[this.datColorIndex];

    }

    update () {

        // Borders logic
        if (this.x > window.innerWidth - this.radius || this.x < 0) {
            this.dx = this.dx * -1;
        }
    
        if (this.y > window.innerHeight - this.radius || this.y < 0) {
            this.dy = this.dy * -1;
        }

        // Mouvement logic
        this.x += this.dx;
        this.y += this.dy;

        // Interactivity logic
        if (mouse.x - this.x < detectSeuil && mouse.x - this.x > (detectSeuil * -1)
            && mouse.y - this.y < detectSeuil && mouse.y - this.y > (detectSeuil * -1)) {
            
            if (this.radius < maxRadius) {
                // this.radius += 1;
                // this.x += this.dx;
                // this.y += this.dy;

                if (clicked) {
                    this.radius += 3;
                    this.size += 3;
                    this.x += (this.dx * -0.2);
                    this.y += (this.dy * -0.2); 
                }
            }

        } else if (this.radius > minRadius) {
            this.radius -= 1;
        }

        // Draw call
        this.draw();
    }
}

class Circle extends Particule {

    constructor (x, y, dx, dy, radius) {

        super (x, y, dx, dy, radius);

    }
    
    draw () {
        // circle
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
}

class Trait extends Particule {

    constructor (x, y, dx, dy, radius) {

        super (x, y, dx, dy, radius);

    }
    
    draw () {
        this.calculPos();
        // triangle
        // c.fillStyle = 'red';
        this.color = "white";
        c.fillStyle = this.color;
        c.strokeStyle = this.color;

        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
        // c.lineTo(this.x3, this.y3);
        c.closePath();
        c.stroke();
    }

    calculPos () {
        this.size = this.radius * 2;

        this.x1 = this.x - 50;
        this.y1 = this.y - 50;

        this.x2 = this.x1 + this.size;
        this.y2 = this.y1 + this.size;

        this.x3 = this.x2 - this.size;
        this.y3 = this.y2 - this.size;
    }
}





function animate() {
    requestAnimationFrame(animate);
    // console.log('frame');
    // c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    c.rect(0,0, canvas.width, canvas.height);
    c.fillStyle = 'rgba(221,255,247,0.8)';
    c.fill();

    circles.forEach(circle => circle.update());
    traits.forEach(triangle => triangle.update());

}



for (let i = 0; i < nbOccurences; i++) {
    let x, y, dx, dy, radius, size;

    x = Math.random() * window.innerWidth - 40;
    y = Math.random() * window.innerHeight - 40;
    dx = Math.random() * 1.2;
    dy = Math.random() * 1.2;
    radius = Math.random() * 80;
    // size = radius;

    circles.push(new Circle(x, y, dx, dy, radius));
    traits.push(new Trait(x, y, dx, dy, radius));
}


init();
animate();