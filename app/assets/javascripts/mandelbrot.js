;(function() {
  var maxIterations = 30;

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
  //
  // TODO: figure out a color scheme and optimize drawing code so that colors
  // aren't prohibitively slow.
  Fractal.prototype.drawFractal = function() {
    this.context.fillStyle = 'white';
    this.context.clearRect(0, 0, this.width, this.height);

    for (var y = 0; y < this.height; y++) {
      var iPart = this.maxI - y * this.iPixel;
      for (var x = 0; x < this.width; x++) {
        var realPart = this.minReal + x * this.realPixel;
        var n = this.calculateN(realPart, iPart);

        this.drawPoint(x, y, n);
      }
    }
  }

  // Given a real and imaginary value (a point on the graph of the fractal)
  // calculate how many iterations are required before the value 'escapes.' The
  // maximum is 30 iterations, and we consider the value to have escaped if the
  // square root of the real part plus the i part is greater than 2 (outside the
  // bounds of the fractal and display.
  Fractal.prototype.calculateN = function(realPart, iPart) {
    var n;
    var cReal      = realPart,
        cImaginary = iPart;

    for (n = 0; n < maxIterations; n++) {
      if (realPart * realPart + iPart * iPart > 4) { return n; }

      var z = this.generator(realPart, iPart, cReal, cImaginary);
      realPart = z[0];
      iPart    = z[1];
    }

    return n;
  }

  // Currently we only draw if n is equal to max iterations, which means the
  // point is a part of the set. If we want to make pretty colors we need to
  // have a color scheme for coloring points not in the set based on how long it
  // takes for the value at that point to escape.
  Fractal.prototype.drawPoint = function(x, y, n) {
    if (n == maxIterations) { draw(x, y, '#000000', this.context) }
  }

  // This is used for the Julia fractal to get around the point that every time
  // we update based on a new K value, we're sort of rendering a different
  // Fractal. Rather than initialize a totally new object, we just need to
  // update this function with new values of K, which we do using a closure
  // below in the window.onload function.
  Fractal.prototype.setGenerator = function(generator) {
    this.generator = generator;
  }

  // Draw a point a certain color.
  function draw(x, y, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  function getMousePos(jCanvas, evt) {
    var rect = jCanvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  window.onload = function() {
    // The function for calculating values in the Mandelbrot set.
    var mandelbrotFunc = function(realPart, iPart, cReal, cImaginary) {
      newReal = realPart*realPart - iPart*iPart + cReal;
      newI = 2 * realPart * iPart + cImaginary;
      return [newReal, newI];
    }

    var mandelbrot = new Fractal(mandelbrotFunc, 'mandelbrot', -2.0, 1.0, -1.5);
    mandelbrot.drawFractal();

    // We don't have a real generator for the Julia set yet. It requires a K
    // value which won't exist until mouseover. We set the generator below in
    // the event handler.
    var julia = new Fractal(function(){}, 'julia', -2.0, 2.0, -2.0);

    // setup event handling
    var mandelbrotCanvas = mandelbrot.canvas
    mandelbrotCanvas.addEventListener('mousemove', function(evt) {
      // This extra option is needed to create the Julia set
      mousePos = getMousePos(mandelbrotCanvas, evt);

      var kReal = julia.minReal + mousePos.x * julia.realPixel;
      var kImaginary = julia.maxI - mousePos.y * julia.iPixel;

      newJuliaFunc = function(realPart, iPart, cReal, cImaginary) {
        newReal = realPart*realPart - iPart*iPart + kReal;
        newI = 2 * realPart * iPart + kImaginary;
        return [newReal, newI];
      }
      julia.setGenerator(newJuliaFunc);

      julia.drawFractal();
    }, false);
  }
})();
