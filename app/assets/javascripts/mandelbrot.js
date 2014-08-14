;(function() {
  var maxIterations = 100;
  var juliaMode = 'mousemove';

  // The Fractal object is initialized with a generator that is the defining
  // function for that fractal. The canvas and bounds are passed in as well for
  // drawing purposes.
  //
  // TODO: break out drawing/rendering code from the Fractal object which
  // doesn't need to know about that.
  function Fractal(generator, canvasId, minReal, maxReal, minI) {
    this.generator = generator;
    this.canvasId  = canvasId;
    this.canvas    = document.getElementById(this.canvasId);
    this.context   = this.canvas.getContext('2d');
    this.width     = parseInt(this.canvas.getAttribute('width'));
    this.height    = parseInt(this.canvas.getAttribute('height'));
    this.minReal   = minReal;
    this.maxReal   = maxReal;
    this.minI      = minI;
    this.maxI      = this.minI + (this.maxReal - this.minReal) * this.height / this.width;
    this.realPixel = (this.maxReal - this.minReal) / (this.width - 1);
    this.iPixel    = (this.maxI - this.minI) / (this.height - 1);
  }

  // For each point on the canvas calculate n = number of iterations to escape
  // and then colorize appropriately.
  // This function can take c values to override the default when calculating N.
  // This allows us to use the K value from the Mandelbrot mouseover to generate
  // the Julia set.
  //
  // TODO: figure out a color scheme and optimize drawing code so that colors
  // aren't prohibitively slow.
  Fractal.prototype.drawFractal = function(cReal, cImaginary) {
    // the 'c' params are optional.
    cReal = typeof cReal !== 'undefined' ? cReal : null;
    cImaginary = typeof cImaginary !== 'undefined' ? cImaginary : null;

    this.context.fillStyle = 'white';
    this.context.clearRect(0, 0, this.width, this.height);

    imageData = this.context.getImageData(0, 0, this.width, this.height);
    data = imageData.data
    for (var y = 0; y < this.height; y++) {
      var iPart = this.maxI - y * this.iPixel;
      for (var x = 0; x < this.width; x++) {
        var realPart = this.minReal + x * this.realPixel;
        var n = this.calculateN(realPart, iPart, cReal, cImaginary);

        // TODO: allow some customization of color options
        var r, g, b;
        var i = (this.width * y + x) * 4
        //this.drawPoint(x, y, n);
        if (n == maxIterations) {
          r = 0, g = 0, b = 0;
        //} else if (n > maxIterations / 10) {
        //  b = 255;
        //  g = (255 / (maxIterations / 2)) * n;
        //  r = g;
        } else {
          b = (255 / (maxIterations / 2)) * n;
          g = 0, r = 0;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255; // alpha
      }
    }
    this.context.putImageData(imageData, 0, 0);
  }

  // Given a real and imaginary value (a point on the graph of the fractal)
  // calculate how many iterations are required before the value 'escapes.' The
  // maximum is 30 iterations, and we consider the value to have escaped if the
  // square root of the real part plus the i part is greater than 2 (outside the
  // bounds of the fractal and display.
  //
  // If c is given, use that. Otherwise default to c is the same as realPart and
  // iPart.
  Fractal.prototype.calculateN = function(realPart, iPart, cReal, cImaginary) {
    var n;

    var cReal      = cReal || realPart,
        cImaginary = cImaginary || iPart;

    for (n = 0; n < maxIterations; n++) {
      if (realPart * realPart + iPart * iPart > 4) { return n; }

      var z = this.generator(realPart, iPart, cReal, cImaginary);
      realPart = z[0];
      iPart    = z[1];
    }

    return n;
  }

  Fractal.prototype.setUpdateFunction = function(updateFunction) {
    this.updateFunction = updateFunction;
  }

  function getMousePos(jCanvas, e) {
    var rect = jCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  window.onload = function() {
    // The function for calculating values in the Mandelbrot set.
    var mandelbrotFunc = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart * realPart - iPart * iPart + cReal;
      newI = 2 * realPart * iPart + cImaginary;
      return [newReal, newI];
    }
    var mandelbrot = new Fractal(mandelbrotFunc, 'mandelbrot', -2.0, 1.0, -1.5);
    mandelbrot.drawFractal();

    // When this function is called the cReal and cImaginary values correspond
    // to K.
    var juliaFunc = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart * realPart - iPart * iPart + cReal;
      newI = 2 * realPart * iPart + cImaginary;
      return [newReal, newI];
    }
    var julia = new Fractal(juliaFunc, 'julia', -2.0, 2.0, -2.0);

    // setup event handling
    var mandelbrotCanvas = mandelbrot.canvas;

    julia.setUpdateFunction(function(e) {
      // This extra option is needed to create the Julia set
      mousePos = getMousePos(mandelbrotCanvas, e);

      var kReal = julia.minReal + mousePos.x * julia.realPixel;
      var kImaginary = julia.maxI - mousePos.y * julia.iPixel;

      // update UI to show K
      var realValue = Math.round(kReal * 100) / 100,
          iValue    = Math.round(kImaginary * 100) / 100;
      var valueString = realValue + ' + ' + iValue + 'i';

      document.getElementById('k-label').innerHTML = valueString;

      // We can pass in K to override the default of K = C
      julia.drawFractal(kReal, kImaginary);
    }, false);

    mandelbrotCanvas.addEventListener('mousemove', julia.updateFunction);

    // set up toggling of mode
    var modeToggle = document.getElementById('mode-toggle');
    modeToggle.addEventListener('click', function(e) {
      button = e.currentTarget;
      if (juliaMode === 'mousemove') {
        mandelbrotCanvas.removeEventListener(juliaMode, julia.updateFunction);
        juliaMode = 'click';
        mandelbrotCanvas.addEventListener(juliaMode, julia.updateFunction);

        button.innerHTML = 'use mouse move';
      } else if (button.innerHTML === 'use mouse move') {
        mandelbrotCanvas.removeEventListener(juliaMode, julia.updateFunction);
        juliaMode = 'mousemove'
        mandelbrotCanvas.addEventListener(juliaMode, julia.updateFunction);
        button.innerHTML = 'use click';
      }
    });
  }
})();
