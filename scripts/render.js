var Render = (function() {
  
  function Render(layer1) {
    
    var layer1 = layer1;
    var ctx1 = layer1.getContext('2d');
    
    var width = layer1.width;
    var height = layer1.height;
    
    var cx = width / 2;
    var cy = height / 2;
    
    
    //! Draws the pendulum.
    function drawPendulum(ctx, x, y, rx, ry, length, theta) {
      ctx.save();
      
      ctx.lineWidth = 3;
      
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.moveTo(rx, -ry);
      ctx.lineTo(rx + length*Math.sin(theta), -ry - length*Math.cos(theta));
      ctx.stroke();
      ctx.closePath();
      
      ctx.restore();
    };
    
 
    //! Renders the model.
    this.render = function(model) {
      // clear 
      ctx1.clearRect(0, 0, width, height);
      
      // setup
      var scale = 150.0 / model.getLength();
      
      /* draw cart */
      ctx1.save();
        ctx1.lineWidth = 3;
        ctx1.translate(cx, cy);
        ctx1.rotate(model.getB());
        ctx1.beginPath();
        ctx1.rect(-3, -scale*model.getA()/2-3, 6, scale*model.getA()+6);
        ctx1.closePath();
        ctx1.stroke();
        
        ctx1.setLineDash([3, 12]);
        ctx1.beginPath();
        ctx1.moveTo(0, -300);
        ctx1.lineTo(0, 300);
        ctx1.closePath();
        ctx1.stroke();
      ctx1.restore();
      
      /* draw pendulum */
      drawPendulum(ctx1, cx, cy, scale*model.getRx(), scale*model.getRy(), scale*model.getLength(), model.getTheta());  
      
      /* draw angle indicator */
      ctx1.save();
        ctx1.lineWidth = 1;
        ctx1.setLineDash([5, 10]);
        ctx1.beginPath();
        ctx1.moveTo(cx, cy);
        ctx1.lineTo(cx+300*Math.sin(model.getTheta()), cy-300*Math.cos(model.getTheta()));
        ctx1.closePath();
        ctx1.stroke();
      ctx1.restore();    
      
      /* draw grid */
      ctx1.save();
        ctx1.lineWidth = 2;
        ctx1.setLineDash([2, 4]);
        
        ctx1.beginPath(); ctx1.arc(cx, cy, 200, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();
        ctx1.beginPath(); ctx1.arc(cx, cy, 250, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();
        ctx1.beginPath(); ctx1.arc(cx, cy, 300, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();

      ctx1.restore();   
      
    };
  };
  
  
  return Render;
} ());
