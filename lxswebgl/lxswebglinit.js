var gl;
var programInfo;
var points = [];

function CanvasDrawIDWImage() {
    let canvas = document.getElementById(canvas_name);

    let imgdata = outputcolor(canvas.clientWidth, canvas.clientHeight);
    let dataarray = new Uint8ClampedArray(imgdata);
    let imagedata = new ImageData(dataarray, canvas.clientWidth, canvas.clientHeight);

    const ctx = canvas.getContext("2d");
    ctx.putImageData(imagedata, 0, 0);
}

function WebGLContext(canvas_name, vs, fs) {
    let canvas = document.getElementById(canvas_name);
    gl = twgl.getContext(canvas);
    programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    const bufferArrays = {
        a_position: [
            -1, -1, 0,
            -1, 1, 0,
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0
        ],
        points: RandomPoints(300, canvas.clientWidth, canvas.clientHeight)
    };
    points = RandomPoints(300, canvas.clientWidth, canvas.clientHeight);
    const bufferinfo = twgl.createBufferInfoFromArrays(gl, bufferArrays);

    function render(time) {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferinfo);

        //buffer uniform data
        //points=RandomPoints(300,gl.canvas.clientWidth,gl.canvas.clientHeight);
        const uniforms = {
            points: points
        };
        twgl.setUniforms(programInfo, uniforms);

        twgl.drawBufferInfo(gl, bufferinfo);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function fetchshaders(vertscript, fragscript) {
    let vertPromise = fetch(vertscript).then(vresponse => {
        return vresponse.text();
    });
    let fragPromise = fetch(fragscript).then(fresponse => {
        return fresponse.text();
    });

    Promise.all([vertPromise, fragPromise])
        .then(([vs, fs]) => {
            WebGLContext('lxsWebGL', vs, fs);
        })
}

fetchshaders(
    'lxswebgl/shader/vs.glsl',
    'lxswebgl/shader/fs.glsl'
)