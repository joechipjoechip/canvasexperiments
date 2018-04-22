let canvas, c;
let nbOccurences = 2000;
let circles = [];
let traits = [];
let speed = 2.2;
let ratioSpecials = nbOccurences / 20;

let activateBlur = false;
// let colors = ['#6DC0D5', '#DDFFF7', '#93E1D8', '#8CDFD6', '#424B54'];
// let colors = [
//     'rgba(109,192,213,0.5)',
//     'rgba(221,255,247,0.5)',
//     'rgba(147,225,216,0.5)',
//     'rgba(255,147,79,0.05)'
// ];

// let colors = [
//     'rgba(237,143,91,0.5)',
//     'rgba(227,109,96,0.5)',
//     'rgba(156,67,104,0.5)',
//     'rgba(51,34,59,0.5)',
//     'rgba(33,30,43,0.5)'
// ];

// let colors = [
//     'rgba(0,3,13,0.5)',
//     'rgba(1,74,87,0.5)',
//     'rgba(0,31,41,0.5)',
//     'rgba(4,102,115,0.5)',
//     'rgba(5,148,164,0.5)',
// ];

let colors = [
    'rgba(60,152,158,alpha)',
    'rgba(93,181,164,alpha)',
    'rgba(244,205,165,alpha)',
    'rgba(245,122,130,alpha)',
    'rgba(237,82,118,alpha)',
];

// let colorBg = colors[0];
let colorBg = 'rgba(255,255,255,0.4)';

let mouse = {
    x: undefined,
    y: undefined
};

let detectSeuil = 40;
let minRadius = 1;
let maxRadius = 80;

let clicked = false;

function init() {
    // colorAlphaMap();
    canvas = document.getElementById('canvas');
    setCanvasSize();
    c = canvas.getContext('2d');

    attachEvents();

    colorAlphaMap();
    createBubbles();
}

function setCanvasSize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    window.addEventListener('resize', e => {
        setCanvasSize();
    });

    window.addEventListener('click', e => {
        // circles = [];
        // traits = [];
        // colorAlphaMap();
        // createBubbles();
    });

}

function colorAlphaMap () {
    colors = colors.map( color => {
        return color.replace('alpha', ((Math.random()).toFixed(2)) * (1 - 0.5 + 1) + 0.5);
    });
    console.log('colorAlphaMap called');
}

class Particule {
    constructor (x, y, dx, dy, radius, i) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.size = radius;

        this.datColorIndex = Math.floor(Math.random() * (colors.length - 0 + 1));
        this.color = colors[this.datColorIndex];

        this.index = i;
        this.maxRadius = maxRadius;
        this.minRadius = minRadius;
    }

    // changeColor () {
    //     colorAlphaMap();
    //     this.color = colors[this.datColorIndex];
    // }

    borderLogic () {
        // Borders logic
        if (this.x > window.innerWidth - this.radius || this.x < 0) {
            this.dx = this.dx * -1;
        }
    
        if (this.y > window.innerHeight - this.radius || this.y < 0) {
            this.dy = this.dy * -1;
        }
    }

    moveLogic () {
        // Mouvement logic
        this.x += this.dx;
        this.y += this.dy;
    }

    insideShape () {
        if (mouse.x - this.x < detectSeuil && mouse.x - this.x > (detectSeuil * -1)
            && mouse.y - this.y < detectSeuil && mouse.y - this.y > (detectSeuil * -1)) {
            return true;
        } else {
            return false;
        }
    }

    interactivityLogic () {

        if (clicked) {
            this.maxRadius = maxRadius * 10;
        } 

        // Interactivity logic
        if (this.insideShape()) {
            
            if (this.radius < this.maxRadius) {
                this.diff = maxRadius - this.radius;
                
                this.radius += (this.diff * 0.05);
                this.x += this.dx;
                this.y += this.dy;

                if (clicked) {
                    if (this.radius < this.maxRadius) {

                        this.radius += 5;
                    }
                }
            }

        } else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }

        
    }

    colorLogic () {

        if (activateBlur) {
            if (this.index % ratioSpecials === 0) {
                this.color = 'white';
                c.shadowBlur = 50;
                c.shadowColor = 'white';
            } else {
                c.shadowBlur = 0;
            }
        }

        c.fillStyle = this.color;
        c.strokeStyle = this.color;
    }


    update () {
        this.borderLogic();
        this.moveLogic();
        this.interactivityLogic();
        this.colorLogic();

        // Draw call
        this.draw();
    }
}

class Circle extends Particule {

    constructor (x, y, dx, dy, radius, i) {
        super (x, y, dx, dy, radius, i);
    }

    
    draw () {
        // circle
        if (this.index % 4 === 0) {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();
        }
    }

    moveLogic () {
        // Mouvement logic
        this.x += (this.dx * 0.3);
        this.y += (this.dy * 0.3);
    }
}

class Trait extends Particule {

    constructor (x, y, dx, dy, radius, i) {
        super (x, y, dx, dy, radius, i);

        this.ratio1 = (Math.random() * 1.4).toFixed(2);
        this.ratio2 = (Math.random() * 2.4).toFixed(2);
        this.ratio3 = (Math.random() * 3.4).toFixed(2);

    }
    
    draw () {

        if (this.index % 3 === 0) {
            this.calculPos();

            c.beginPath();
            c.moveTo(this.x1, this.y1);
            c.lineTo(this.x2, this.y2);
            
            // if (this.index % ratioSpecials === 0) {
            //     c.lineTo(this.x3 * 1.2, this.y3 * 0.3);
            // }

            c.closePath();
            c.stroke();
            c.fill();
        }
    }

    calculPos () {
        this.size = this.radius * 0.5;

        this.x1 = this.x + this.size * this.ratio1 * -1;
        this.y1 = this.y + this.size * this.ratio1 * -1;

        this.x2 = this.x1 + this.size * this.ratio3;
        this.y2 = this.y1 + this.size * this.ratio3;

        this.x3 = this.x2 + this.size * this.ratio2;
        this.y3 = this.y2 - this.size * this.ratio2;
    }
}





function animate() {
    requestAnimationFrame(animate);
    // console.log('frame');
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    c.rect(0,0, canvas.width, canvas.height);
    c.fillStyle = colorBg;
    
    c.fill();

    circles.forEach( circle => circle.update());
    traits.forEach( triangle => triangle.update());
}

colorAlphaMap();

function createBubbles () {
    for (let i = 0; i < nbOccurences; i++) {
        let x, y, dx, dy, radius, size;
    
        x = Math.random() * window.innerWidth - 40;
        y = Math.random() * window.innerHeight - 40;
        dx = Math.random() * speed - (speed * -1) + (speed * -1);
        dy = Math.random() * speed - (speed * -1) + (speed * -1);
        radius = Math.random() * maxRadius;
        // size = radius;
    
        
    
        circles.push(new Circle(x, y, dx, dy, radius, i));
        traits.push(new Trait(x, y, dx, dy, radius, i));
    }
}




init();
animate();