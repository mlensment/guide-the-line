var Level = function(params) {
  this.game = params.game;
  this.tileSize = 20;
  this.speed = 0;
  this.offset = 0;
  this.currentLevel = 1;
  this.loading = false;
  this.map = [];
  this.loadLevel();
};

Level.prototype.loadLevel = function(level) {
  level = level || 0;
  if(level >= levels.length) {
    return false;
  }
  this.currentLevel = level + 1;

  level = levels[level];
  this.map = [];
  this.speed = level.speed;

  var map = level.map.replace(/\s+/g, ' ');
  map = map.trim();
  map = map.split(' ');

  this.tileSize = Math.round(this.game.canvas.width / map[0].length);

  this.offset = this.tileSize * map.length * -1;
  var line = [];
  for(var i in map) {
    for(var j in map[i]) {
      line.push(map[i][j]);
    }

    this.map.push(line);
    line = [];
  }

  this.game.ee.emitEvent('levelChanged');
  return true;
};

Level.prototype.loadNext = function() {
  if(!this.loading) {
    this.loading = true;
    this.speed = 2;
    this.game.player.speedLimit = this.speed * 3;
    this.game.player.velocity.y = this.speed * -1;
  }

  if(this.offset >= this.game.canvas.height) {
    this.loading = false;
    if(!this.loadLevel(this.currentLevel)) {
      this.game.ee.emitEvent('won');
    }
  }
};

Level.prototype.reset = function() {
  this.loadLevel();
};

Level.prototype.update = function() {
  this.offset += this.speed;
  var height = (this.map.length * this.tileSize);
  if(this.offset + (this.game.canvas.height - this.game.player.position.y) - (this.tileSize * 2) >= this.game.canvas.height) {
    this.loadNext();
  }
};

Level.prototype.draw = function(ctx) {
  ctx.fillStyle = 'red';
  for(var i in this.map) {
    for(var j in this.map[i]) {
      var tile = this.map[i][j];
      if(tile == 'x'){
        var posX = this.tileSize * j;
        var posY = (this.tileSize * i) + this.offset;
        ctx.fillRect(posX, posY, this.tileSize, this.tileSize);
      }
    }
  }
};