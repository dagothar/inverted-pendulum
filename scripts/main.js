function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}


$(document).ready(function() {
  
  var layer1 = $('#layer1').get(0);
  var layer2 = $('#layer2').get(0);
  
  var defaultParams = {
    theta0:   0.0,
    dtheta0:  0.0,
    l:        0.5,
    g:        9.81,
    Amax:     0.1,
    wmax:     50.0,
    dmax:     0.0
  };
  
  var t = 0.0;
  var pendulum = undefined;
  var render = undefined;
  var stepTimer = undefined;
  var running = false;
  
  
  //! Updates the model info
  function update() {
    $('#time').text(t.toFixed(2) + ' [s]');
    $('#theta').text(pendulum.getTheta().toFixed(3) + ' [rad]');
    
    render.render(pendulum);
  };
  
  
  function getParameters() {
    var params = clone(defaultParams);
    
    params.theta0 = parseFloat($('#parameter-theta0').val());
    params.dtheta0 = parseFloat($('#parameter-dtheta0').val());
    params.l = parseFloat($('#parameter-l').val());
    params.g = parseFloat($('#parameter-g').val());
    params.Amax = parseFloat($('#parameter-Amax').val());
    params.wmax = parseFloat($('#parameter-wmax').val());
    params.dmax = parseFloat($('#parameter-dmax').val());
    
    return params;
  };
  
  
  function reset() {
    clearInterval(stepTimer);
    running = false;
        
    $('.button-start').show();
    $('.button-stop').hide();
    $('.form-control').prop('disabled', false);
    
    $('.slider-A').val(0);
    $('.slider-w').val(0);
    $('.slider-b').val(0);
    $('.slider-d').val(0);
    
    t = 0.0;
    
    var params = getParameters();
    
    var x0 = [params.theta0, params.dtheta0];
    
    var solver = new RK4();
    
    pendulum = new Pendulum(params, x0, solver);
    render = new Render(layer1, layer2);
    update();
  };
  
  
  reset();
  
  
  
  
  
  //! Updates the model
  function step() {
    var A = 0.001 * $('.slider-A').val();
    var w = 0.001 * $('.slider-w').val();
    var b = 0.001 * $('.slider-b').val();
    var d = 0.001 * $('.slider-d').val();
    
    dt = 0.005;
    t += dt;
    pendulum.step(t, [A, w, b, d], dt);
    
    update();
  };  
  
  
  $('.button-start').click(function() {
    $(this).hide();
    $('.button-stop').show();
    $('.form-control').prop('disabled', true);
    
    var params = getParameters();
    pendulum.setParameters(params);
    
    if (!running) {
      stepTimer = setInterval(step, 5);
      running = true;
    }
  });
  
  
  $('.button-stop').click(function() {
    $(this).hide();
    $('.button-start').show();
    $('.form-control').prop('disabled', false);
    clearInterval(stepTimer);
    running = false;
  });
  
  
  $('.button-reset').click(function() {
    reset();
  });
  
  
  $('.slider-z1').on('input change', function() {
    if (!running) {
      tank.setZ1(0.01 * $(this).val());
      update();
    }
  });
  
  $('.slider-z2').on('input change', function() {
    if (!running) {
      tank.setZ2(0.01 * $(this).val());
      update();
    }
  });
  
  $('.slider-z3').on('input change', function() {
    if (!running) {
      tank.setZ3(0.01 * $(this).val());
      update();
    }
  });
  
  $('.slider-heater').on('input change', function() {
    if (!running) {
      tank.setHeater(0.01 * $(this).val());
      update();
    }
  });
  
  $('.button-params').click(function() {
    if (!running) {
      $('#parameter-theta0').val(defaultParams.theta0);
      $('#parameter-dtheta0').val(defaultParams.dtheta0);
      $('#parameter-l').val(defaultParams.l);
      $('#parameter-g').val(defaultParams.g);
      $('#parameter-Amax').val(defaultParams.Amax);
      $('#parameter-wmax').val(defaultParams.wmax);
      $('#parameter-dmax').val(defaultParams.dmax);
    }
  });
  
});
