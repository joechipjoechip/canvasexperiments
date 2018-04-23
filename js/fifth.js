let mouse = {
    x: undefined,

    y: undefined
};

let clicked = false;

let image, largeur, hauteur;
let imageData;
let frame = 1;
let pixRatio = 10;
let pixel, hex, rgba, c;
let pixelMap = [];
let particules = [];

let particuleSizeSmall = 1;
let particuleSizeMedium = 3;
let particuleSizeLarge = 6;

let speed = 2;
let pdx = speed;
let pdy = speed;

let detectSeuilMin = 20;
let detectSeuilMax = 120;



function init() {

    canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');

    image = document.getElementById('image');
    
    setCanvasSize();
    setSizeImage();

    attachEvents();

    setTimeout(function() {
        c.drawImage(image, 0, 0);
        imageMapping();

        createParticules();
    }, 100);
}

function setCanvasSize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setSizeImage () {

    let ratio = image.width / image.height;

    if (image.height > canvas.height) {
        image.height = canvas.height;
        image.width = image.height * ratio;
    }

    // c.scale(ratio, ratio);

    largeur = image.width;
    hauteur = image.height;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function attachEvents () {

    canvas.addEventListener('mousemove', function(e) {
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
}

function imageMapping () {

    for (let j = 0; j < hauteur; j++) {

        if (j % pixRatio === 0 && j !== 0) {

            for (let i = 0; i < largeur; i++) {
    
                if (i % pixRatio === 0 && i !== 0) {
                    pixel = c.getImageData(i, j, 1, 1).data;
                    hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
                    pixelMap.push({
                        "x": i,
                        "y": j,
                        "color": hex
                    });
                }
            }
        }
    }
}


class Particule {
    constructor (x, y, dx, dy, radius, color, i) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
        this.index = i;

        this.detectSeuil = detectSeuilMin;
    }

    draw () {

        if (this.radius > 0) {
            c.fillStyle = this.color;
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();
        }
    }

    mouseTrigger () {
        if (mouse.x - this.x < this.detectSeuil && mouse.x - this.x > (this.detectSeuil * -1)
            && mouse.y - this.y < this.detectSeuil && mouse.y - this.y > (this.detectSeuil * -1)) {
            return true;
        } else {
            return false;
        }
    }

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
        this.x += this.dx;
        this.y += this.dy;
    }

    interactivityLogic () {

        if (clicked) {
            if (this.detectSeuil < detectSeuilMax) {
                this.detectSeuil += 0.7;
            }
        }  else {
            if (this.detectSeuil > detectSeuilMin) {
                this.detectSeuil -= 0.2;
            }
        }

        // Interactivity logic
        if (this.mouseTrigger()) {
            
            if (this.radius < particuleSizeMedium) {
                this.radius += 0.6;
            }

            if (clicked) {
                if (this.radius < particuleSizeLarge) {
                    this.radius += 1.5;
                }
            }

        } else if (this.radius > particuleSizeSmall) {
            this.radius -= 0.2;
        }   
    }

    randomed (min, max) {
        return (Math.random() * (max - min + 1)) + min;
        // return Math.floor((Math.random() * (particuleSizeLarge - particuleSizeSmall + 1)) + particuleSizeSmall);
        // return Math.random() * (2 + 2 + 1) -2;
        // return Math.random() * (2 + 2 + 1) -2;
    }

    randomizes () {
        if (this.radius <= particuleSizeLarge && this.radius >= particuleSizeSmall) {
            // this.radius += this.randomed(3);
            this.radius += this.randomed(-2, 2);

            // for (let i = 0; i < this.randomed(1, 5); i++) {
            //     this.radius++;
            // }
        }
    }

    update () {
        this.borderLogic();
        this.randomizes();
        // this.moveLogic();
        this.interactivityLogic();
        this.draw();
    }
}

function animate() {
    requestAnimationFrame(animate);
    //   frame++;
    c.clearRect(0, 0, canvas.width, canvas.height);

    
    particules.forEach( oneParticule => {
        oneParticule.update();
    });
    // c.fillStyle = 'rgba(255, 0, 0, 0.05)';
    // c.rect(0, 0, canvas.width, canvas.height);
    // c.fill();


}

function createParticules () {
    let particule;

    pixelMap.forEach( (pixel, index) => {
        oneParticule = new Particule(pixel.x, pixel.y, pdx, pdy, particuleSizeSmall, pixel.color, index);
        particules.push(oneParticule);
        oneParticule.update();

    });

    // debugger;
}

init();
animate();

// animate();