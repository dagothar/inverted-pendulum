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
    
    
    //! Draws the Uef plot.
    function drawUef(ctx, model, x, y, r, height, segments) {
      var maxUef = model.getUefMax();
      
      ctx.save();
      
      ctx.strokeStyle = 'rgb(255, 0, 0)';
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.font = '20px Sans';
      ctx.lineWidth = 2;
      ctx.translate(x, y);
      
      // effective potential
      ctx.beginPath();
      var dt = 2*Math.PI / segments;
      for (var t = 0.0; t <= 2*Math.PI; t += dt) {
        var uef = model.getUef(t);
        var ruef = r + height * uef / maxUef;
        
        ctx.lineTo(ruef*Math.sin(t), -ruef*Math.cos(t));
      };
      ctx.closePath();
      ctx.stroke();
      ctx.fillText('Uef', -250, 275);
      
      // gravitational potential
      ctx.strokeStyle = 'rgb(0, 255, 0)';
      ctx.fillStyle = 'rgb(0, 255, 0)';
   
      ctx.beginPath();
      var dt = 2*Math.PI / segments;
      for (var t = 0.0; t <= 2*Math.PI; t += dt) {
        var ug = model.getUg(t);
        var rug = r + height * ug / maxUef;
        
        ctx.lineTo(rug*Math.sin(t), -rug*Math.cos(t));
      };
      ctx.closePath();
      ctx.stroke();
      ctx.fillText('Ug', -250, 250);
      
      ctx.restore();
    };
    
 
    //! Renders the model.
    this.render = function(model) {
      // clear 
      ctx1.clearRect(0, 0, width, height);
      
      ctx1.font = '20px Sans';
      var Rinner = 175;
      var Rmiddle = 225;
      var Router = 275;
      
      // setup
      var scale = 150.0 / model.getLength();
      
      /* draw cart */
      ctx1.save();
        ctx1.lineWidth = 3;
        ctx1.translate(cx, cy);
        ctx1.rotate(model.getB());
        ctx1.beginPath();
        ctx1.rect(-3, -scale*model.getA()-3, 6, 2*scale*model.getA()+6);
        ctx1.closePath();
        ctx1.stroke();
        
        ctx1.lineWidth = 2;
        ctx1.setLineDash([3, 12]);
        ctx1.beginPath();
        ctx1.moveTo(0, -Router);
        ctx1.lineTo(0, Router);
        ctx1.closePath();
        ctx1.stroke();
        
        ctx1.rotate(-model.getB());
        ctx1.fillText('β', Router*Math.sin(model.getB()), -Router*Math.cos(model.getB()));
        
      ctx1.restore();
      
      /* draw pendulum */
      drawPendulum(ctx1, cx, cy, scale*model.getRx(), scale*model.getRy(), scale*model.getLength(), model.getTheta());  
      
      /* draw angle indicator */
      ctx1.save();
        ctx1.lineWidth = 1;
        ctx1.setLineDash([5, 10]);
        ctx1.beginPath();
        ctx1.moveTo(cx, cy);
        ctx1.lineTo(cx+Router*Math.sin(model.getTheta()), cy-Router*Math.cos(model.getTheta()));
        ctx1.closePath();
        ctx1.stroke();
        ctx1.fillText('θ', cx+Router*Math.sin(model.getTheta()), cy-Router*Math.cos(model.getTheta()));
      ctx1.restore();    
      
      /* draw grid */
      ctx1.save();
        ctx1.lineWidth = 2;
        ctx1.setLineDash([2, 4]);
        
        ctx1.beginPath(); ctx1.arc(cx, cy, Rinner, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();
        ctx1.beginPath(); ctx1.arc(cx, cy, Rmiddle, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();
        ctx1.beginPath(); ctx1.arc(cx, cy, Router, 0, 2*Math.PI); ctx1.closePath(); ctx1.stroke();

      ctx1.restore();
      
      /* draw Uef */
      drawUef(ctx1, model, cx, cy, Rmiddle, Router-Rmiddle, 360);
      
    };
  };
  
  
  return Render;
} ());
