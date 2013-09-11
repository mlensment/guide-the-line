var Level = function(params) {
  this.game = params.game;
  this.speed = 0;
  this.offset = 0;
  this.offsetX = 0;
  this.mapHeight = 0;
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
  this.offsetX = (this.game.canvas.width - map[0].length * this.tileSize) / 2;

  this.offset = this.tileSize * map.length * -1;
  this.mapHeight = Math.abs(this.offset);

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
  if(this.offset + (this.game.canvas.height - this.game.player.position.y) - (this.tileSize * 2) >= this.game.canvas.height) {
    this.loadNext();
  }

  //TODO: Rewrite this using map buffering and move logic from draw to here
  if(this.offset > 0 && this.mapHeight + this.offset > this.game.canvas.height + this.tileSize) {
    this.map.pop();
    this.mapHeight -= this.tileSize;
  } else if (Math.abs(this.mapHeight - Math.abs(this.offset)) > this.game.canvas.height + this.tileSize) {
    this.map.pop();
    this.mapHeight -= this.tileSize;
  }
};

Level.prototype.draw = function(ctx) {
  ctx.fillStyle = 'rgb(66, 66, 66)';
  //calculate how many map rows to loop through
  if(this.offset + this.tileSize > 0) {
    var tileCount = 0;
  } else {
    var pixelsOver = this.mapHeight - Math.abs(this.offset);
    var tileCount = Math.abs(this.map.length - 1 - Math.ceil(pixelsOver / this.tileSize));
  }

  var height = this.map.length - 1;
  for(var i = height; i >= tileCount; i--) {
    var len = this.map[i].length;
    for(var j in this.map[i]) {
      var tile = this.map[i][j];
      if(tile == 'x') {
        var posX = (j == 0) ? 0 : this.tileSize * j + this.offsetX;
        var posY = (this.tileSize * i) + this.offset;

        if (j == 0 || j == len - 1) {
          var sizeX = this.tileSize + this.offsetX;
          ctx.fillRect(posX, posY, sizeX, this.tileSize);
        } else {
          ctx.fillRect(posX, posY, this.tileSize, this.tileSize);
        }
      }
    }
  }
};