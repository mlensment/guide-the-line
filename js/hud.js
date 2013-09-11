var Hud = function(params) {
  this.game = params.game;
  this.bindListeners();
  this.reset();
};

Hud.prototype.bindListeners = function(params) {
  this.game.ee.addListener('levelChanged', function() {
    this.showOverlay({
      title: 'Level ' + this.game.level.currentLevel,
      timeout: 3000
    });
  }.bind(this));

  this.game.ee.addListener('won', function() {
    this.showOverlay({
      title: 'Esikoht ja kuldmedal!',
      subTitle: 'Kogusid ' + this.game.player.score + ' punkti! Vajuta Enterit, et uuesti alustada!',
      transparent: false
    });
  }.bind(this));

  this.game.ee.addListener('lost', function() {
    this.showOverlay({
      title: 'Mäng läbi!',
      subTitle: 'Kogusid ' + this.game.player.score + ' punkti! Vajuta Enterit, et uuesti alustada!',
      transparent: false
    });
  }.bind(this));

  this.game.ee.addListener('pause', function() {
    if(this.game.gameEnded) return;
    this.showOverlay({
      title: 'Paus!',
      subTitle: 'Tõmbad hinge, jah?',
      transparent: false
    });
  }.bind(this));
  
  this.game.ee.addListener('start', function() {
    this.reset();
  }.bind(this));
};

Hud.prototype.showOverlay = function(obj) {
  this.overlay = obj;
  if(obj.timeout) {
    setTimeout(function() {
      this.overlay = null;
    }.bind(this), 3000);
  }
  this.draw();
};

Hud.prototype.reset = function() {
  this.overlay = null;
};

Hud.prototype.update = function() {

};

Hud.prototype.draw = function() {
  if(this.overlay) {
    this.game.ctx.fillStyle = 'white';
    if(this.overlay.transparent === false) {
      this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
      this.game.ctx.fillStyle = 'white';
    }
    var x = this.game.canvas.width / 2;
    var y = this.game.canvas.height / 2;

    this.game.ctx.font = '30pt Calibri';
    this.game.ctx.textAlign = 'center';
    this.game.ctx.textBaseline = 'middle';
    this.game.ctx.fillText(this.overlay.title, x, y);

    if(this.overlay.subTitle) {
      this.game.ctx.font = '12pt Calibri';
      this.game.ctx.textAlign = 'center';
      this.game.ctx.textBaseline = 'middle';
      this.game.ctx.fillText(this.overlay.subTitle, x,  y + 30);
    }
  }

  this.game.ctx.textAlign = 'start';
  this.game.ctx.textBaseline = 'alphabetic';

  //draw footer
  var x = this.game.canvas.width - 85;
  var y = this.game.canvas.height - 6;
  this.game.ctx.font = '12pt Calibri';
  this.game.ctx.fillStyle = 'white';
  this.game.ctx.fillText('Kiirus:', x, y);

  x = this.game.canvas.width - 40;
  y = this.game.canvas.height - 15;
  this.game.ctx.fillStyle = 'white';
  var speed = Math.round((Math.abs(this.game.player.velocity.x) + Math.abs(this.game.player.velocity.y)) / this.game.level.speed);
  for(var i = 0; i < speed; i++) {
    this.game.ctx.fillRect(x, y, 10, 10);
    x += 12;
  }  

  x = 5;
  y = this.game.canvas.height - 6;
  this.game.ctx.fillStyle = 'white';

  this.game.ctx.fillText('Skoor: ' + this.game.player.score, x, y);
};
