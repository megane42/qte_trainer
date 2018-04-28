const FONT = 'Special Elite';

var game;
var subject;
var timer;
var records = [];

var key_s;
var key_f;
var key_r;
var key_v;

WebFont.load({
    google: { families: [ FONT ] },
    active: function() {
        game = new Phaser.Game(400, 300, Phaser.AUTO, '', main_scene);
    }
});


var title_scene = {
    preload() {},
    create() {},
    update() {}
}


var main_scene = {

    preload() {},

    create() {
        key_s = game.input.keyboard.addKey(Phaser.KeyCode.S);
        key_f = game.input.keyboard.addKey(Phaser.KeyCode.F);
        key_r = game.input.keyboard.addKey(Phaser.KeyCode.R);
        key_v = game.input.keyboard.addKey(Phaser.KeyCode.V);

        timer = game.time.create(false);

        subject = game.add.text(16, 16, 'S + F', { font: FONT, fontSize: '32px', fill: '#FFF' });
        subject.kill();

        display_next_subject();
    },

    update() {
        if (subject.alive && key_s.isDown && key_f.isDown) {
            if (subject.text === 'S + F') {
                success();
            }
        }

        if (subject.alive && key_r.isDown && key_v.isDown) {
            if (subject.text === 'R + V') {
                success();
            }
        }
    }
}

// ============================================================


function display_next_subject() {
    subject.text = Math.round(Math.random()) ? 'S + F' : 'R + V';

    var next_ms = 1000 + Math.random(4000);
    setTimeout(function() {
        timer.destroy();
        timer.start();
        subject.revive();
    }, next_ms);
}


function success() {
    subject.kill();
    records.push(timer.seconds);

    display_next_subject();
}
