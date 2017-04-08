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
    var kpull;
    var dpull;
    var kpsi;
    var Tpsi;
    
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
      kpull = params.kpull;
      dpull = params.dpull;
      kpsi = params.kpsi;
      Tpsi = params.Tpsi;
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
    this.setTheta = function(th) { this.setState([th, 0.0]); };
    this.getDTheta = function() { return x[1]; };
    this.getPsi = function() { return x[2]; };
    this.setPsi = function(p) { x[2] = p; };
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
    this.getK = function() { return k; };
    this.setK = function(z) { k = z; };
    this.getLength = function() { return l; };
    
    this.getRx = function() { return rx; };
    this.getRy = function() { return ry; };
    
    
    //! Calculates the potential as the function of angle.
    this.getUg = function(a) {
      return 0.5*g*l*m*Math.cos(a);
    };
    
    
    //! Calculates the effective potential as the function of angle.
    this.getUef = function(a) {
      return 0.5*g*l*m*Math.cos(a) - 3.0/32.0 * A*A*m*w*w*Math.cos(2*(a-b));
    };
    
    
    //! Calculates the absolute maximum of the Uef.
    this.getUefMax = function() {
      return 0.5*g*l*m+ 3.0/32.0 * Amax*Amax*wmax*wmax*m;
    };
    
    
    /** Calculate derivatives of the state variables
     * State inputs are: [A, w, b, d, pull, angle ]
    */
    this.dxfun = function(t, u, x) {
      var dx = [0, 0];
      
      // calculate the pulling angle direction and magnitude
      var etheta = u[5]-x[0];
      if (etheta > Math.PI) {
        etheta = -2*Math.PI + etheta;
      }
      if (etheta < -Math.PI) {
        etheta = 2*Math.PI + etheta;
      }
      while (etheta > 2*Math.PI) etheta -= 2*Math.PI;
      while (etheta < -2*Math.PI) etheta += 2*Math.PI;
      
      //console.log(etheta);
      
      // calculate theta derivatives
      dx[0] = x[1];
      dx[1] = 3.0 * (-u[0]*u[1]*u[1] * Math.sin(u[1]*t+p) * Math.sin(u[2]-x[0]) + g*Math.sin(x[0])) / (2.0*l) - (3.0*u[3]*x[1])/(m*l*l) + 3.0*u[4]*(kpull*etheta - dpull*x[1])/(m*l*l);
      
      // calculate the psi angle direction and magnitude
      var ptheta = x[0]-x[2];
      if (ptheta > Math.PI) {
        ptheta = -2*Math.PI + ptheta;
      }
      if (ptheta < -Math.PI) {
        ptheta = 2*Math.PI + ptheta;
      }
      while (ptheta > 2*Math.PI) ptheta -= 2*Math.PI;
      while (ptheta < -2*Math.PI) ptheta += 2*Math.PI;
      
      //console.log(ptheta);
      
      // calculate psi (filtered theta) derivatives
      dx[2] = kpsi*ptheta / Tpsi;
      
      return dx;
    };
    
    
    //! Calculates next step state variables
    this.step = function(t, u, dt) {
      T = t;
      
      this.setA(u[0]);
      this.setW(u[1]);
      this.setB(u[2]);
      this.setD(u[3]);
      
      var pull = u[4];
      var angle = u[5];
      
 
      // solve for new x state
      x = solver.solve(this.dxfun, t, [A, w, b, d, pull, angle], x, dt);

      // take care of bounds
      if (x[0] < -Math.PI) x[0] += 2*Math.PI;
      if (x[0] > Math.PI) x[0] -= 2*Math.PI;
      
      if (x[2] < -Math.PI) x[2] += 2*Math.PI;
      if (x[2] > Math.PI) x[2] -= 2*Math.PI;
      
      rx = A * Math.sin(b) * Math.sin(w*t+p);
      ry = A * Math.cos(b) * Math.sin(w*t+p);
      
      return x;
    };
  };
  
  
  return Pendulum;
} ());
