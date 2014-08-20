;(function() {
  var maxIterations = 100;
  var juliaMode = 'mousemove';

  // 0 = red
  // 1 = green
  // 2 = blue
  var colorMode = 2;

  var red = 255,
      green = 0,
      blue = 0;

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
    cReal = (typeof cReal !== 'undefined') ? cReal : null;
    cImaginary = (typeof cImaginary !== 'undefined') ? cImaginary : null;

    imageData = this.context.getImageData(0, 0, this.width, this.height);
    data = imageData.data
    for (var y = 0; y < this.height; y++) {
      var iPart = this.maxI - y * this.iPixel;
      for (var x = 0; x < this.width; x++) {
        var realPart = this.minReal + x * this.realPixel;
        var n = this.calculateN(realPart, iPart, cReal, cImaginary);

        // reset to black
        var i = (this.width * y + x) * 4
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255; // alpha

        // color unless this point belongs to the set
        if (n !== maxIterations) {
          var r = (red / (maxIterations / 2)) * n;
          var g = (green / (maxIterations / 2)) * n;
          var b = (blue / (maxIterations / 2)) * n;
          data[i + 0] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
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

  function validColor(value) {
    return (value >= 0 && value <= 255);
  }

  function generateJuliaUpdateFunction(mandelbrot, julia) {
    return function(e) {
      // This extra option is needed to create the Julia set
      mousePos = getMousePos(mandelbrot.canvas, e);

      var kReal = julia.minReal + mousePos.x * julia.realPixel;
      var kImaginary = julia.maxI - mousePos.y * julia.iPixel;

      // update UI to show K
      var realValue = Math.round(kReal * 100) / 100,
          iValue    = Math.round(kImaginary * 100) / 100;
      var valueString = realValue + ' + ' + iValue + 'i';

      document.getElementById('k-label').innerHTML = valueString;

      // We can pass in K to override the default of K = C
      julia.drawFractal(kReal, kImaginary);
    }
  }

  function setupColorToggle(fractal) {
    //var colorToggle = document.getElementById('color-toggle');
    var colorToggle = document.getElementById('redraw');
    colorToggle.addEventListener('click', function(e) {
      r = document.getElementById('red_Red').value;
      g = document.getElementById('green_Green').value;
      b = document.getElementById('blue_Blue').value;

      if (validColor(r) && validColor(g) && validColor(b)) {
        red   = r,
        green = g,
        blue  = b;
        // apparently this is jQuery :(
        //colorToggle.removeClass('invalid');
        fractal.drawFractal();
      } else {
        //colorToggle.addClass('invalid');
      }
    });
  }

  function setupModeToggle(triggerFractal, updateFractal) {
    // set up toggling of mode
    var modeToggle = document.getElementById('mode-toggle');
    modeToggle.addEventListener('click', function(e) {
      button = e.currentTarget;
      if (juliaMode === 'mousemove') {
        triggerFractal.canvas
          .removeEventListener(juliaMode, updateFractal.updateFunction);
        juliaMode = 'click';
        triggerFractal.canvas
          .addEventListener(juliaMode, updateFractal.updateFunction);
        button.innerHTML = 'use mouse move';
      } else if (button.innerHTML === 'use mouse move') {
        triggerFractal.canvas
          .removeEventListener(juliaMode, updateFractal.updateFunction);
        juliaMode = 'mousemove'
        triggerFractal.canvas
          .addEventListener(juliaMode, updateFractal.updateFunction);
        button.innerHTML = 'use click';
      }
    });
  }

  $(function() {
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

    juliaUpdateFunction = generateJuliaUpdateFunction(mandelbrot, julia);
    julia.setUpdateFunction(juliaUpdateFunction, false);

    // default mode setup
    mandelbrotCanvas.addEventListener('mousemove', julia.updateFunction);

    setupModeToggle(mandelbrot, julia)
    setupColorToggle(mandelbrot);
  });
})();
