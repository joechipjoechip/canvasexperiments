console.log('hey ok');

let canvas = document.getElementById('canvas');

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

let c = canvas.getContext('2d');

// rectangle
c.fillStyle = "rgba(255, 0, 0, 0.2)";
c.fillRect(100, 100, 100, 100);
c.fillStyle = "rgba(100, 0, 255, 0.2)";
c.fillRect(300, 300, 300, 300);
c.fillRect(500, 500, 500, 500);

// line
c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 100);
c.lineTo(500, 500);
c.lineTo(20, 300);
c.strokeStyle = "#ff00ff";
c.stroke();

// arc
for (let i = 0; i < 100; i++) {
    var ref = 350;
    var decay = i * 2;

    var x = ref + decay;
    var y = ref + decay;

    c.beginPath();
    c.arc(x, y, 80 + decay, 20, Math.PI, true);
    c.strokeStyle = 'orange';
    c.stroke();
    
}


console.log(canvas);