var Player = function(params) {
  this.game = params.game;
  this.bindListeners();
  this.speedLimit = this.game.level.speed * 3;

  this.reset();
};

Player.prototype.reset = function() {
  this.colliding = false;
  this.velocity = new Vector(0, this.game.level.speed * -1);
  this.path = [new Vector(this.game.canvas.width / 2, this.game.canvas.height / 2), new Vector(this.game.canvas.width / 2, this.game.canvas.height / 2)];
  this.position = this.path[0];
  this.lastDirection = null;
  this.score = 0;
  this.scoreInternal = 0;
};

Player.prototype.detectCollision = function(ctx) {
  var p = ctx.getImageData(this.position.x, this.position.y, 1, 1).data;
  if(this.position.y > this.game.canvas.height || p[0] == 66 && p[1] == 66 && p[2] == 66) {
    this.colliding = true;
  }
};

Player.prototype.update = function(ctx) {
  this.scoreInternal += .015 * this.game.level.currentLevel;
  this.score = Math.floor(this.scoreInternal);

  this.detectCollision(ctx);

  if(this.colliding) {
    this.game.ee.emitEvent('lost');
  }

  if(this.position.y < 0) {
    this.velocity.y = -.1;
  }

  var speed = this.velocity.length();
  if(speed > this.speedLimit) {
    this.velocity.idiv(speed / this.speedLimit);
  }

  this.updatePath();

  for(var i in this.path) {
    var point = this.path[i];
    point.y += this.game.level.speed;
  }

  this.position = this.path[this.path.length - 1];

  if(this.path[1].y > this.game.canvas.height) {
    this.path.shift();
  }

  this.debug();
};

Player.prototype.updatePath = function() {
  var a = this.path[this.path.length - 2];
  var b = this.path[this.path.length - 1]; //last piece
  var newX = b.x + this.velocity.x;
  var newY = b.y + this.velocity.y;
  
  if(newX > this.game.canvas.width) {
    this.path.push(new Vector(0, newY));
    this.path.push(new Vector(0, newY));
    return;
  }

  if(newX < 0) {
    this.path.push(new Vector(this.game.canvas.width, newY));
    this.path.push(new Vector(this.game.canvas.width, newY));
    return;
  }

  if(newX == a.x && newX == b.x) {
    b.y = newY;
  } else if(newY == a.y && newY == b.y) {
    b.x = newX;
  } else {
    this.path.push(new Vector(newX, newY));
  }  
};

Player.prototype.draw = function(ctx) {
  ctx.strokeStyle = 'rgb(255, 255, 255)';

  ctx.beginPath();
  for(var i in this.path) {
      var point = this.path[i];
      var lastPoint = (i > 0) ? this.path[i - 1] : null;
      if(lastPoint && Math.abs(lastPoint.x - point.x) >= this.game.canvas.width - 4) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
        ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
};

Player.prototype.bindListeners = function() {
  this.game.ee.addListener('levelChanged', function() {
    this.speedLimit = this.game.level.speed * 3;
  }.bind(this));

  $(document).keydown(function(e) {
    if((!this.game.running && e.which != 13 && e.which != 80) || (this.game.gameEnded && e.which == 80)) {
      return;
    }

    switch(e.which) {
      case 80:
        //pause
        if(this.game.running) {
          this.game.ee.emitEvent('pause');
        } else {
          this.game.ee.emitEvent('start');
        }
      break;
      case 13:
        //enter
        if(this.game.gameEnded) {
          this.game.reset();
        }
      break;
      case 38:
        // up
        this.velocity.x = 0;
        this.velocity.y -= this.game.level.speed;
        this.lastDirection = 'up';
      break;
      case 40:
        // down
        this.velocity.x = 0;
        this.lastDirection = 'down';
        this.velocity.y += this.game.level.speed;
      break;
      case 37:
        // left
        this.velocity.y = 0;
        this.velocity.x -= this.game.level.speed;
        this.lastDirection = 'left';
      break;
      case 39:
        // right
        this.velocity.y = 0;
        this.velocity.x += this.game.level.speed;
        this.lastDirection = 'right';
      break;
    }
    return false;
  }.bind(this));
};

Player.prototype.debug = function() {
  var lastPosition = this.path[this.path.length - 1];
  $('#debug').html('Velocity vector: (' + Math.round(this.velocity.x) + ', ' + Math.round(this.velocity.y) + ')<br/>\
    Position: (' + Math.round(lastPosition.x) + ', ' + Math.round(lastPosition.y) + ')');
};
