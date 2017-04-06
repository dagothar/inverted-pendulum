var Render = (function() {
  
  function Render(layer1, layer2) {
    
    var layer1 = layer1;
    var layer2 = layer2;
    var ctx1 = layer1.getContext('2d');
    var ctx2 = layer2.getContext('2d');
    
    var width = layer1.width;
    var height = layer1.height;
    
    var cx = width / 2;
    var cy = height / 2;
    
    
    //! Draws the pendulum.
    function drawPendulum(ctx, x, y, rx, ry, length, theta, scale) {
      ctx.save();
      
      ctx.lineWidth = 3;
      
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.moveTo(rx, -ry);
      ctx.lineTo(rx + length*scale*Math.sin(theta), -ry - length*scale*Math.cos(theta));
      ctx.stroke();
      
      ctx.restore();
    };
    
 
    //! Renders the model.
    this.render = function(model) {
      // clear 
      ctx1.clearRect(0, 0, width, height);
      ctx2.clearRect(0, 0, width, height);
      
      // setup
      var scale = 100.0 / model.getLength();      
      
      /* draw pendulum */
      drawPendulum(ctx1, cx, cy, model.getRx(), model.getRy(), model.getLength(), model.getTheta(), scale);
      
      /* copy layer 1 to layer 2 */
      ctx2.drawImage(layer1, 0, 0);
      ctx1.clearRect(0, 0, width, height);
      
      /* draw ... */
      
      
    };
  };
  
  
  return Render;
} ());
