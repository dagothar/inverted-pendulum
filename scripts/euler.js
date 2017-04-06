var Euler = (function() {
  
  function Euler() {
    
    //! Solves a step of ODE
    this.solve = function(fun, t, u, x, dt) {
      // calculate derivatives
      var dx = fun(t, u, x);
      
      // update state
      var nx = x.slice();
      for (var i = 0; i < dx.length; ++i) {
        nx[i] += dx[i] * dt;
      }
      
      return nx;
    };
    
  };
  
  
  return Euler;
} ());
