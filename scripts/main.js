function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}


function getMousePos(e, client) {
  var rect = client.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};


$(document).ready(function() {
  
  var layer1 = $('#layer1').get(0);
  
  var defaultParams = {
    theta0:   0.05,
    dtheta0:  0.0,
    m:        1.0,
    l:        0.5,
    g:        9.81,
    Amax:     0.1,
    wmax:     70.0,
    dmax:     0.1,
    k:        1.0
  };
  
  var t = 0.0;
  var dt = 0.005;
  var tscale = 1.0;
  var pendulum = undefined;
  var render = undefined;
  var stepTimer = undefined;
  var running = false;
  var torque = 0.0;
  
  
  //! Updates the model info
  function update() {
    var theta = pendulum.getTheta(); // 180.0 * pendulum.getTheta() / Math.PI;
    var dtheta = pendulum.getDTheta(); // 180.0 * pendulum.getDTheta() / Math.PI;
    
    $('#time').text(t.toFixed(2) + ' [s]');
    $('#theta').text(theta.toFixed(3) + ' [rad]'); // °
    $('#dtheta').text(dtheta.toFixed(3) + ' [rad/s]');
    
    $('.amplitude').text(pendulum.getA().toFixed(3) + ' [m]');
    $('.omega').text(pendulum.getW().toFixed(3) + ' [rad/s]');
    $('.beta').text(pendulum.getB().toFixed(3) + ' [rad]');
    $('.damping').text(pendulum.getD().toFixed(3) + ' [kg m²/s]');
    $('.dt').text('x ' + tscale.toFixed(3));
    
    render.render(pendulum);
  };
  
  
  function getParameters() {
    var params = clone(defaultParams);
    
    params.theta0 = parseFloat($('#parameter-theta0').val());
    params.dtheta0 = parseFloat($('#parameter-dtheta0').val());
    params.m = parseFloat($('#parameter-m').val());
    params.l = parseFloat($('#parameter-l').val());
    params.g = parseFloat($('#parameter-g').val());
    params.Amax = parseFloat($('#parameter-Amax').val());
    params.wmax = parseFloat($('#parameter-wmax').val());
    params.dmax = parseFloat($('#parameter-dmax').val());
    //params.k = parseFloat($('#parameter-k').val());
    
    return params;
  };
  
  
  function reset() {
    clearInterval(stepTimer);
    running = false;
        
    $('.button-start').show();
    $('.button-stop').hide();
    $('.form-control').prop('disabled', false);
    
    $('.slider-A').val(1000);
    $('.slider-w').val(1000);
    $('.slider-b').val(500);
    $('.slider-d').val(1000);
    $('.slider-dt').val(300);
    
    t = 0.0;
    
    var params = getParameters();
    
    var x0 = [params.theta0, params.dtheta0];
    
    var solver = new RK4();
    
    pendulum = new Pendulum(params, x0, solver);
    render = new Render(layer1);
    
    pendulum.setA(0.001 * $('.slider-A').val());
    pendulum.setW(0.001 * $('.slider-w').val());
    pendulum.setB(Math.PI * (0.002 * $('.slider-b').val()-1));
    pendulum.setD(0.001 * $('.slider-d').val());
    
    update();
  };
  
  
  reset();
  
  
  
  
  
  //! Updates the model
  function step() {
    var A = 0.001 * $('.slider-A').val();
    var w = 0.001 * $('.slider-w').val();
    var b = Math.PI * (0.002 * $('.slider-b').val()-1);
    var d = 0.001 * $('.slider-d').val();
    var M = torque; // torque
    
    var dts = dt / tscale;
    t += dts;
    pendulum.step(t, [A, w, b, d, M], dts);
    
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
  
  
  $('.slider-A').on('input change', function() {
    if (!running) {
      pendulum.setA(0.001 * $(this).val());
      update();
    }
  });
  
  $('.slider-w').on('input change', function() {
    if (!running) {
      pendulum.setW(0.001 * $(this).val());
      update();
    }
  });
  
  $('.slider-b').on('input change', function() {
    if (!running) {
      pendulum.setB(Math.PI * (0.002 * $(this).val()-1));
      update();
    }
  });
  
  $('.slider-d').on('input change', function() {
    if (!running) {
      pendulum.setD(0.001 * $(this).val());
      update();
    }
  });
  
  $('.slider-dt').on('input change', function() {
      tscale = Math.pow(1.01, 300-$(this).val());
      update();
  });
  
  
  $('.button-params').click(function() {
    if (!running) {
      $('#parameter-theta0').val(defaultParams.theta0);
      $('#parameter-dtheta0').val(defaultParams.dtheta0);
      $('#parameter-m').val(defaultParams.m);
      $('#parameter-l').val(defaultParams.l);
      $('#parameter-g').val(defaultParams.g);
      $('#parameter-Amax').val(defaultParams.Amax);
      $('#parameter-wmax').val(defaultParams.wmax);
      $('#parameter-dmax').val(defaultParams.dmax);
      $('#parameter-k').val(defaultParams.k);
    }
  });
  
  
  /*function pos2angle(pos) {
    var cx = layer1.width/2;
    var cy = layer1.height/2;
    
    var x = pos.x - cx;
    var y = -pos.y + cy;
    
    return Math.atan2(x, y);
  };
  
  
  function calculateTorque(pos) {
    var theta = pendulum.getTheta();
    var ang = pos2angle(pos);
    
    // find out the dtheta...
    if ((ang - theta) < Math.PI) {
      return ang - theta;
    } else {
      return 0.0;
    };
  };
  
  
  $('#layer1').mousedown(function(e) {
    var pos = getMousePos(e, layer1);
    torque = calculateTorque(pos);
    
    console.log(pos2angle(pos));
    
    $(this).bind('mousemove', function(e) {
      var pos = getMousePos(e, layer1);
      torque = calculateTorque(pos);
    });
  });
  
  
  $('#layer1').mouseup(function(e) {
    $(this).unbind('mousemove');
    
    torque = 0.0;
  });
  
  
  $('#layer1').mouseout(function(e) {
    $(this).unbind('mousemove');
    
    torque = 0.0;
  });*/
  
});
