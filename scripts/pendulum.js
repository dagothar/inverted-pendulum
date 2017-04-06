var Pendulum = (function() {
  
  function Pendulum(params, x0, solver) {
    var theta0;
    var dtheta0;
    var l;
    var g;
    var Amax;
    var wmax;
    var dmax;
    
    // parameters
    this.setParameters = function(params) {
      theta0 = params.theta0;
      dtheta0 = params.dtheta0;
      l = params.l;
      g = params.g;
      Amax = params.Amax;
      wmax = params.wmax;
      dmax = params.dmax;
    };
    
    this.setParameters(params);
    
    // state
    var x = x0;
    var A = 0.0, w = 0.0, b = 0.0, d = 0.0;
    
    // solver
    var solver = solver;
    
    
    this.getState = function() { return x; };
    this.setState = function(nx) { x = nx; };
    this.getTheta = function() { return x[0]; };
    this.getThetaDot = function() { return x[1]; };
    this.getA = function() { return A; };
    this.setA = function(z) { A = z; };
    this.getW = function() { return w; };
    this.setW = function(z) { w = z; };
    this.getB = function() { return b; };
    this.setB = function(z) { b = z; };
    this.getD = function() { return d; };
    this.setD = function(z) { d = z; };
    this.getLength = function() { return l; };
    
    this.getRx = function() { return 0; };
    this.getRy = function() { return 0; };
    
    
    //! Calculate derivatives of the state variables
    this.dxfun = function(t, u, x) {
      var dx = [0, 0];
      
      // state variables and inputs
      var theta = x[0];
      var dtheta = x[1];
      
      A = Amax * u[0];
      w = wmax * u[1];
      b = 2*Math.PI * (u[2] - 0.5);
      d = u[3];
      
      // calculate derivatives
      dx[0] = dtheta;
      dx[1] = (-3*A*w*w * Math.sin(w*t) * Math.sin(b-theta) + g*Math.sin(theta)) / (2.0*l) - d * dtheta;
      
      //console.log(w, g, dx, g*Math.sin(theta) / (2.0*l));
      
      return dx;
    };
    
    
    //! Calculates next step state variables
    this.step = function(t, u, dt) {
      // solve for new x state
      x = solver.solve(this.dxfun, t, u, x, dt);

      // take care of bounds
      if (x[0] < -Math.PI) x[0] = 2*Math.PI - x[0];
      if (x[0] > Math.PI) x[0] = -2*Math.PI + x[0];
      
      return x;
    };
  };
  
  
  return Pendulum;
} ());
