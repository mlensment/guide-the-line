var LineGame = function() {
  this.ee = new EventEmitter();
  this.gameEnded = false;

  this.setupCanvas();
  this.bindListeners();

  levels.reverse();
  this.level = new Level({
    game: this
  });

  this.player = new Player({
    game: this
  });


  this.hud = new Hud({
    game: this
  });

  this.start();
};

LineGame.prototype.bindListeners = function() {
  this.ee.addListener('won', function() {
    this.endGame();
  }.bind(this));

  this.ee.addListener('lost', function() {
    this.endGame();
  }.bind(this));

  this.ee.addListener('pause', function() {
    if(!this.gameEnded) {
      this.pause();
    }
  }.bind(this));

  this.ee.addListener('start', function() {
    this.start();
  }.bind(this));
};

LineGame.prototype.endGame = function() {
  this.gameEnded = true;
  this.pause();
};

LineGame.prototype.reset = function() {
  this.gameEnded = false;
  this.hud.reset();
  this.level.reset();
  this.player.reset();
  this.start();
};

LineGame.prototype.start = function() {
  this.running = setInterval(function() {
    this.update();
    this.draw();
  }.bind(this), 15);
};

LineGame.prototype.pause = function() {
  clearInterval(this.running);
  this.running = null;
};

LineGame.prototype.update = function() {
  this.player.update(this.ctx);
  this.level.update();
  this.hud.update();
};

LineGame.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.player.draw(this.ctx);
  this.level.draw(this.ctx);
  this.hud.draw();
};

LineGame.prototype.setupCanvas = function() {
  $('#lineGame').prepend('<canvas style="border: 1px solid #424242;" id="guide-the-line" width="' + 652 + '" height="' + 500 + '"></canvas>');
  this.canvas = document.getElementById('guide-the-line');
  this.ctx = this.canvas.getContext('2d');
};