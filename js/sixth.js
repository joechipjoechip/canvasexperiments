let mouse = {
    x: undefined,

    y: undefined
};

let clicked = false;

let image, largeur, hauteur;
let imageData;
let frame = 1;
let pixRatio = 50;
let pixel, hex, rgba, c;
let pixelMap = [];
let particules = [];

let particuleSizeSmall = 0;
let particuleSizeMedium = 20;
let particuleSizeLarge = 35;

let spiralSpace = 15;
let lineWidth = 1;

let speed = 2;
let pdx = speed;
let pdy = speed;

let detectSeuilMin = 30;
let detectSeuilMax = 160;



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

    largeur = image.width;
    hauteur = image.height;
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

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
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
        this.alteredRadius = radius;
        this.color = color;
        this.index = i;

        this.detectSeuil = detectSeuilMin;
    }

    draw () {

        c.beginPath();
        if (this.radius > particuleSizeMedium) {
            console.log('on passe dans le altered');

            this.alteredRadius++;
            // if (this.alteredRadius < 0) {
            //     this.alteredRadius = this.alteredRadius * -1;
            // }

            for (let i = 0; i < 5; i++) {
                let alteredFinal = this.alteredRadius + (i * spiralSpace);
                c.strokeStyle = this.color;
                c.lineWidth = lineWidth;
                
                // c.arc(this.x, this.y, alteredFinal, 0, Math.PI * 2, false);
                // c.rect(this.x - (alteredFinal / 2), this.y - (alteredFinal / 2), alteredFinal, alteredFinal);
                // c.fill();
                // c.closePath();
                // c.beginPath();

                c.moveTo(this.x - (alteredFinal / 2), this.y - (alteredFinal / 2));
                c.lineTo(mouse.x, mouse.y);
                c.lineTo(this.x - (alteredFinal * 2), this.y);

                c.stroke();
            }
            

        } else if (this.radius > 0) {
            console.log('on passe dans le normal');
            c.fillStyle = this.color;

            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fill();
        }

        c.closePath();



        // if (this.alteredRadius > this.radius * 4) {
        //     this.alteredRadius = this.radius;
        // }

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
            this.alteredRadius = this.radius;
        }  
        
        // size the strokes
        if (clicked && lineWidth < 4) {
            lineWidth = lineWidth + 0.1;
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
        // this.randomizes();
        // this.moveLogic();
        this.interactivityLogic();

        // for (let i = 0; i < this.radius; i++) {
        //     this.radius--;
        // }
        this.draw();
    }
}

function animate() {
    requestAnimationFrame(animate);
    frame++;
    
    // if (frame % 500 === 0) {
    //     c.clearRect(0, 0, canvas.width, canvas.height);
    //     c.drawImage(image, 0, 0);
    // } else {
    //     c.fillStyle = 'rgba(255,255,255,0.005)';
    //     c.rect(0, 0, canvas.width, canvas.height);
    //     c.fill();
    // }

    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(image, 0, 0);

    particules.forEach( oneParticule => {
        oneParticule.update();
    });
}

function createParticules () {
    pixelMap.forEach( (pixel, index) => {
        let oneParticule = new Particule(pixel.x, pixel.y, pdx, pdy, particuleSizeSmall, pixel.color, index);
        particules.push(oneParticule);
        oneParticule.update();
    });
}

init();
animate();

// animate();