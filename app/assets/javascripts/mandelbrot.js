;(function() {
  var maxIterations = 30;

  window.onload = function() {
    var minReal = -2.0,
        maxReal = 1.0,
        minI = -1.5;

    options = generateOptions('mandelbrot', minReal, maxReal, minI)
    makeMandelbrot(options);
    setupJulia();
  }

  // This is similar to `#makeMandelbrot` but instead of actually drawing the
  // fractal, we merely set up a listener for later drawing.
  //
  // The min and max values are different to optimize Julia set viewing.
  function setupJulia() {
    var minReal = -2.0,
        maxReal = 2.0,
        minI = -2;

    options = generateOptions('julia', minReal, maxReal, minI);
    trackMouse(options);
  }

  // Based on the dimensions of the canvas and the desired viewing window,
  // set up an options hash with the appropriate context and configurations, to be
  // passed to `#drawFractal` at some point.
  function generateOptions(canvasId, minReal, maxReal, minI) {
    var canvas = document.getElementById(canvasId),
        ctx = canvas.getContext('2d'),
        height = parseInt(canvas.getAttribute('height')),
        width = parseInt(canvas.getAttribute('width')),
        maxI = minI + (maxReal - minReal) * height / width,
        realPixel = (maxReal - minReal) / (width - 1),
        iPixel = (maxI - minI) / (height - 1);

    return {
      ctx:       ctx,
      height:    height,
      width:     width,
      minReal:   minReal,
      maxI:      maxI,
      realPixel: realPixel,
      iPixel:    iPixel
    }
  }

  function makeMandelbrot(options) {
    var height    = options.height,
        width     = options.width,
        minReal   = options.minReal,
        maxI      = options.maxI,
        realPixel = options.realPixel,
        iPixel    = options.iPixel,
        ctx       = options.ctx;

    var mandelbrot = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart*realPart - iPart*iPart + cReal;
      newI = 2 * realPart * iPart + cImaginary;
      return [newReal, newI];
    }

    drawFractal(mandelbrot,
                height,
                width,
                minReal,
                maxI,
                realPixel,
                iPixel,
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

    var julia = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart*realPart - iPart*iPart + kReal;
      newI = 2 * realPart * iPart + kImaginary;
      return [newReal, newI];
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

  // for each pixel, draw the appropriate color into the canvas.
  // delegated to `#drawFranctalPoint`
  function drawFractal(func, height, width, minReal, maxI, realPixel, iPixel, context) {
    for (var y = 0; y < height; y++) {
      var iPart = maxI - y * iPixel; // y starts from top, so go reverse
      for (var x = 0; x < width; x++) {
        var realPart = minReal + x * realPixel; // x is bottom to top
        drawFractalPoint(func, x, y, realPart, iPart, context);
      }
    }
  }

  // calculate the n value for this location. Based on the result, color that
  // pixel accordingly.
  function drawFractalPoint(func, x, y, realPart, iPart, context) {
    var result = calculateN(func, realPart, iPart);
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

  function calculateN(func, realPart, iPart) {
    var n,
        cReal = realPart,
        cImaginary = iPart;

    for (n = 0; n < maxIterations; n++) {
      var realSquared = realPart * realPart, iSquared = iPart * iPart;

      if (realSquared + iSquared > 4) { return [n, false]; }

      var z = func(realPart, iPart, cReal, cImaginary);
      realPart = z[0];
      iPart = z[1];
    }
    return [n, true];
  }

  // When the user mouses over the Mandelbrot view, we want to rerender the Julia
  // with that K value.
  function trackMouse(options) {
    var mandelbrot = document.getElementById('mandelbrot');
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

  function blackToRed(x, y, n, ctx) {
    var hex = hexColor(n),
        color = '#' + hex + '0000';

    draw(x, y, color, ctx);
  }

  function redToWhite(x, y, n, ctx) {
    var hex = hexColor(n),
        color = '#ff' + hex + hex;

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
})();

