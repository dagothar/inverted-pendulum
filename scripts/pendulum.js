var Pendulum = (function() {
  
  function Pendulum(params, x0, solver) {
    var theta0;
    var dtheta0;
    var m;
    var l;
    var g;
    var Amax;
    var wmax;
    var dmax;
    
    // parameters
    this.setParameters = function(params) {
      theta0 = params.theta0;
      dtheta0 = params.dtheta0;
      m = params.m;
      l = params.l;
      g = params.g;
      Amax = params.Amax;
      wmax = params.wmax;
      dmax = params.dmax;
    };
    
    this.setParameters(params);
    
    // state
    var x = x0;
    var rx = 0, ry = 0;
    var A = 0.0, w = 0.0, b = 0.0, d = 0.0;
    var p = 0.0; // phase
    var T = 0.0;
    
    // solver
    var solver = solver;
    
    
    this.getState = function() { return x; };
    this.setState = function(nx) { x = nx; };
    this.getTheta = function() { return x[0]; };
    this.getDTheta = function() { return x[1]; };
    this.getA = function() { return A; };
    this.setA = function(z) { A = Amax * z; };
    this.getW = function() { return w; };
    
    this.setW = function(z) {
      var w1 = w;
      var w2 = wmax * z;
      
      if (w1 != w2) {
        var p1 = w1*T+p - Math.floor(0.5*(w1*T+p)/Math.PI) * 2*Math.PI;
        var p2 = w2*T - Math.floor(0.5*w2*T/Math.PI) * 2*Math.PI;
        p = p1-p2;
      }
      w = w2;
    };
    
    this.getB = function() { return b; };
    this.setB = function(z) { b = z; };
    this.getD = function() { return d; };
    this.setD = function(z) { d = dmax * z; };
    this.getLength = function() { return l; };
    
    this.getRx = function() { return rx; };
    this.getRy = function() { return ry; };
    
    
    //! Calculates the potential as the function of angle.
    this.getUg = function(psi) {
      return 0.5*g*l*m*Math.cos(psi);
    };
    
    
    //! Calculates the effective potential as the function of angle.
    this.getUef = function(psi) {
      return 0.5*g*l*m*Math.cos(psi) - 3.0/32.0 * A*A*m*w*w*Math.cos(2*(psi-b));
    };
    
    
    //! Calculates the absolute maximum of the Uef.
    this.getUefMax = function() {
      return 0.5*g*l*m+ 3.0/32.0 * A*A*w*w*m;
    };
    
    
    //! Calculate derivatives of the state variables
    this.dxfun = function(t, u, x) {
      var dx = [0, 0];
      
      // calculate derivatives
      dx[0] = x[1];
      dx[1] = 3.0 * (-u[0]*u[1]*u[1] * Math.sin(u[1]*t+p) * Math.sin(u[2]-x[0]) + g*Math.sin(x[0])) / (2.0*l) - (3.0 * u[3] * x[1]) / (m*l*l);
      
      return dx;
    };
    
    
    //! Calculates next step state variables
    this.step = function(t, u, dt) {
      //A = Amax * u[0];
      //w = wmax * u[1];
      //b = u[2];
      //d = dmax * u[3];
      
      T = t;
      
      this.setA(u[0]);
      this.setW(u[1]);
      this.setB(u[2]);
      this.setD(u[3]);
      
      // solve for new x state
      x = solver.solve(this.dxfun, t, [A, w, b, d], x, dt);

      // take care of bounds
      if (x[0] < -Math.PI) x[0] = 2*Math.PI - x[0];
      if (x[0] > Math.PI) x[0] = -2*Math.PI + x[0];
      
      rx = A * Math.sin(b) * Math.sin(w*t+p);
      ry = A * Math.cos(b) * Math.sin(w*t+p);
      
      return x;
    };
  };
  
  
  return Pendulum;
} ());
