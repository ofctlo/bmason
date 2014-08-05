var maxIterations = 30;

var jMaxIterations = 30;

window.onload = function() {
  // Get the canvas object for drawing.
  canvas = document.getElementById('mandelbrot');
  ctx = canvas.getContext("2d");
  // Get the size of the canvas.
  imageHeight = canvas.getAttribute("height");
  imageWidth = canvas.getAttribute("width");

  // With height and width we can calculate all the necessary values.
  minReal = -2.0;
  maxReal = 1.0;
  minImaginary = -1.5;
  maxImaginary = minImaginary + (maxReal - minReal) * imageHeight / imageWidth;

  realPixel = (maxReal - minReal) / (imageWidth - 1);
  imaginaryPixel = (maxImaginary - minImaginary) / (imageHeight - 1);

  options = {
    ctx: ctx,
    height: imageHeight,
    width: imageWidth,
    minReal: minReal,
    maxI: maxImaginary,
    realPixel: realPixel,
    iPixel: imaginaryPixel
  }

  makeMandelbrot(options);

  setupJulia();
};

function setupJulia() {
  jCanvas = document.getElementById('julia');
  jCtx = jCanvas.getContext("2d");

  jImageHeight = jCanvas.getAttribute("height");
  jImageWidth = jCanvas.getAttribute("width");

  // With height and width we can calculate all the necessary values.
  jMinReal = -2.0;
  jMaxReal = 2.0;
  jMinImaginary = -2;
  jMaxImaginary = jMinImaginary + (jMaxReal - jMinReal) * jImageHeight / jImageWidth;

  jRealPixel = (jMaxReal - jMinReal) / (jImageWidth - 1);
  jImaginaryPixel = (jMaxImaginary - jMinImaginary) / (jImageHeight - 1);

  options = {
    ctx: jCtx,
    height: jImageHeight,
    width: jImageWidth,
    minReal: jMinReal,
    maxI: jMaxImaginary,
    realPixel: jRealPixel,
    iPixel: jImaginaryPixel
  }

  trackMouse(options);
}

function trackMouse(options) {
  mandelbrot = document.getElementById('mandelbrot');
  mandelbrot.addEventListener('mousemove', function(evt) {
    var mousePosition = getMousePos(mandelbrot, evt);
    makeJulia(mousePosition, options);
  }, false);
}

function getMousePos(jCanvas, evt) {
  var rect = jCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function makeMandelbrot(options) {
  var height = options['height'],
      width  = options['width'],
      minReal = options['minReal'],
      maxI    = options['maxI'],
      realPixel = options['realPixel'],
      iPixel    = options['iPixel'],
      ctx       = options['ctx'];

  var mandelbrot = function(zReal, zImaginary, cReal, cImaginary) {
    zReal = zReal2 - zImaginary2 + cReal;
    zImaginary = 2 * zReal * zImaginary + cImaginary;
    return [zReal, zImaginary];
  }

  drawFractal(mandelbrot,
              imageHeight,
              imageWidth,
              minReal,
              maxImaginary,
              realPixel,
              imaginaryPixel,
              ctx);
}

function makeJulia(mousePosition, options) {
  var height = options['height'],
      width  = options['width'],
      minReal = options['minReal'],
      maxI    = options['maxI'],
      realPixel = options['realPixel'],
      iPixel    = options['iPixel'],
      ctx       = options['ctx'];

  // First we need to find the value of k.
  var kReal = minReal + mousePosition.x * realPixel;
  var kImaginary = maxI - mousePosition.y * iPixel;

  var julia = function(zReal, zImaginary, cReal, cImaginary) {
    zReal = zReal2 - zImaginary2 + kReal;
    zImaginary = 2 * zReal * zImaginary + kImaginary;
    return [zReal, zImaginary];
  }

  drawFractal(julia,
              height,
              width,
              minReal,
              maxI,
              realPixel,
              iPixel,
              ctx);
}

function drawFractal(func, height, width, minReal, maxImaginary, realPixel, imaginaryPixel, context) {
  // Same as for the mandelbrot set, but add k each time instead of c.
  for (var y = 0; y < height; y++) {
    // y values start from the top, so we subtract from maxI.
    var cImaginary = maxImaginary - y * imaginaryPixel;

    // For each value of x, from 0 to the maximum.
    for (var x = 0; x < width; x++) {
      // x values start from the left (lowest) so we add appropriately.
      var cReal = minReal + x * realPixel;

      // Set z = c.
      var zReal = cReal;
      var zImaginary = cImaginary;

      drawFractalPoint(func, x, y, zReal, zImaginary, cReal, cImaginary, context);
    }
  }
}


function drawFractalPoint(func, x, y, zReal, zImaginary, cReal, cImaginary, context) {
  var result = calculateN(func, zReal, zImaginary, cReal, cImaginary);
  var n = result[0];
  var isInside = result[1];

  if (isInside || n == maxIterations) {
    draw(x, y, '#000000', context);
  } else if (n < maxIterations / 2) {
    blackToRed(x, y, n, context);
  } else if (n >= maxIterations / 2) {
    redToWhite(x, y, n, context);
  }
}

function calculateN(func, zReal, zImaginary, cReal, cImaginary) {
  var n;
  for (n = 0; n < maxIterations; n++) {
    zReal2 = zReal * zReal;
    zImaginary2 = zImaginary * zImaginary;
    // If absolute value of z is greater than 2.  Absolute value of complex
    // numbers is defined as distance from origin: sqrt(zR^2 + zI^2) Can
    // eliminate sqrt to get comparison below:
    if (zReal2 + zImaginary2 > 4) {
      return [n, false];
    }

    z = func(zReal, zImaginary, cReal, cImaginary);
    zReal = z[0];
    zImaginary = z[1];
  }
  return [n, true];
}

function blackToRed(x, y, n, ctx) {
  hex = hexColor(n);
  var color = '#' + hex + '0000';

  draw(x, y, color, ctx);
}

function redToWhite(x, y, n, ctx) {
  hex = hexColor(n);
  var color = '#ff' + hex + hex;

  draw(x, y, color, ctx);
}

function hexColor(n) {
  var color = (255 / (maxIterations / 2)) * n;
  return color.toString(16);
}

function draw(x, y, color, ctx) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}
