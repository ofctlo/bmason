;(function() {
  var maxIterations = 30,
      colorConversion = (255 / (maxIterations / 2)),
      colors = {}; // memoized colors for n values

  function setupMandelbrot() {
    var minReal = -2.0,
        maxReal = 1.0,
        minI = -1.5;

    options = generateOptions('mandelbrot', minReal, maxReal, minI)

    var mandelbrot_func = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart*realPart - iPart*iPart + cReal;
      newI = 2 * realPart * iPart + cImaginary;
      return [newReal, newI];
    }

    drawFractal(mandelbrot_func, options);
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

    var mandelbrot = document.getElementById('mandelbrot');
    mandelbrot.addEventListener('mousemove', function(evt) {
      // This extra option is needed to create the Julia set
      options['mousePos'] = getMousePos(mandelbrot, evt);

      var juliaFunc = (function () {
        // First we need to find the value of k.
        var kReal = options.minReal + options.mousePos.x * options.realPixel;
        var kImaginary = options.maxI - options.mousePos.y * options.iPixel;

        return function(realPart, iPart, cReal, cImaginary) {
          newReal = realPart*realPart - iPart*iPart + kReal;
          newI = 2 * realPart * iPart + kImaginary;
          return [newReal, newI];
        }
      })();

      drawFractal(juliaFunc, options);
    }, false);
  }

  // Based on the dimensions of the canvas and the desired viewing window,
  // set up an options hash with the appropriate context and configurations
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

  // for each pixel, draw the appropriate color into the canvas. Delegated to
  // `#drawFranctalPoint`
  function drawFractal(func, options) {
    var height = options.height,
        width  = options.width,
        minReal = options.minReal,
        maxI    = options.maxI,
        realPixel = options.realPixel,
        iPixel    = options.iPixel,
        ctx       = options.ctx,
        mousePos  = options.mousePos;

    for (var y = 0; y < height; y++) {
      var iPart = maxI - y * iPixel; // y starts from top, so go reverse
      for (var x = 0; x < width; x++) {
        var realPart = minReal + x * realPixel; // x is bottom to top
        var n = calculateN(func, realPart, iPart)
        drawFractalPoint(x, y, n, ctx);
      }
    }
  }

  function calculateN(func, realPart, iPart) {
    var n,
        cReal = realPart,
        cImaginary = iPart;

    for (n = 0; n < maxIterations; n++) {
      if (realPart * realPart + iPart * iPart > 4) { return n; }

      // Perform whatever calculates the equation defining the fractal demands
      var z = func(realPart, iPart, cReal, cImaginary);
      realPart = z[0];
      iPart = z[1];
    }
    return n;
  }

  // Based on the value of n, color that pixel accordingly.
  function drawFractalPoint(x, y, n, context) {
    if (n == maxIterations) {
      draw(x, y, '#000000', context);
    } else if (n < maxIterations / 2) {
      blackToRed(x, y, n, context);
    } else if (n >= maxIterations / 2) {
      redToWhite(x, y, n, context);
    }
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
    return colors[n] = colors[n] || (colorConversion * n).toString(16);
  }

  function draw(x, y, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  window.onload = function() {
    setupMandelbrot();
    setupJulia();
  }
})();
