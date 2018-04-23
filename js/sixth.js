
let mouse = {
    x: undefined,
    y: undefined
};

let image;
let imageData;
let frame = 1;
let pixel, rgba, c;



function init() {

    canvas = document.getElementById('canvas');
    setCanvasSize();
    gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }


    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


    // Programme shader de sommet
    const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
    `;

    const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);

    

    // attachEvents();

}


function setCanvasSize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function attachEvents () {

    // canvas.addEventListener('mousemove', function(e) {
    //     mouse.x = e.x;
    //     mouse.y = e.y;
    //     var coord = `x=${mouse.x}, y=${mouse.y}`;

    //     // c = canvas.getContext('2d');
        

    //     var pixel = c.getImageData(mouse.x, mouse.y, 1, 1).data;
    //     var hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);

    //     // c.drawImage(image, 0, 0);

    //     console.log(hex);
    // });
    
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

function drawing () {
    // draw function
};


function initBuffers(gl) {

    // Créer un tampon des positions pour le carré.
    const positionBuffer = gl.createBuffer();
  
    // Définir le positionBuffer comme étant celui auquel appliquer les opérations
    // de tampon à partir d'ici.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Créer maintenant un tableau des positions pour le carré.
    const positions = [
       1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ];
  
    // Passer mainenant la liste des positions à WebGL pour construire la forme.
    // Nous faisons cela en créant un Float32Array à partir du tableau JavaScript,
    // puis en l'utilisant pour remplir le tampon en cours.
  
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(positions),
                  gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
    };
}


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Créer le programme shader
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // Si la création du programme shader a échoué, alerte
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Impossible d initialiser le programme shader : ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // Crée un shader du type fourni, charge le source et le compile.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Envoyer le source à l'objet shader
    gl.shaderSource(shader, source);
  
    // Compiler le programme shader
    gl.compileShader(shader);
  
    // Vérifier s'il a ét compilé avec succès
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }

  
  function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // effacement en noir, complètement opaque
    gl.clearDepth(1.0);                 // tout effacer
    gl.enable(gl.DEPTH_TEST);           // activer le test de profondeur
    gl.depthFunc(gl.LEQUAL);            // les choses proches cachent les choses lointaines
  
    // Effacer le canevas avant que nous ne commencions à dessiner dessus.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Créer une matrice de perspective, une matrice spéciale qui est utilisée pour
    // simuler la distorsion de la perspective dans une caméra.
    // Notre champ de vision est de 45 degrés, avec un rapport largeur/hauteur qui 
    // correspond à la taille d'affichage du canvas ;
    // et nous voulons seulement voir les objets situés entre 0,1 unité et 100 unités
    // à partir de la caméra.
  
    const fieldOfView = 45 * Math.PI / 180;   // en radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js a toujours comme premier argument la destination
    // où stocker le résultat.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Définir la position de dessin comme étant le point "origine", qui est
    // le centre de la scène.
    const modelViewMatrix = mat4.create();
  
    // Commencer maintenant à déplacer la position de dessin un peu vers là où
    // nous voulons commencer à dessiner le carré.
  
    mat4.translate(modelViewMatrix,     // matrice de destination
                   modelViewMatrix,     // matrice de déplacement
                   [-0.0, 0.0, -6.0]);  // quantité de déplacement
  
    // Indiquer à WebGL comment extraire les positions à partir du tampon des
    // positions pour les mettre dans l'attribut vertexPosition.
    {
      const numComponents = 2;  // extraire 2 valeurs par itération
      const type = gl.FLOAT;    // les données dans le tampon sont des flottants 32bit
      const normalize = false;  // ne pas normaliser
      const stride = 0;         // combien d'octets à extraire entre un jeu de valeurs et le suivant
                                // 0 = utiliser le type et numComponents ci-dessus
      const offset = 0;         // démarrer à partir de combien d'octets dans le tampon
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Indiquer à WebGL d'utiliser notre programme pour dessiner
  
    gl.useProgram(programInfo.program);
  
    // Définir les uniformes du shader
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
  
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }



// Initialiser un programme shader, de façon à ce que WebGL sache comment dessiner nos données



init();
// animate();