const FONT = 'Special Elite';

var game;
var subject;
var timer;
var records = [];

var key_s;
var key_f;
var key_r;
var key_v;

var restart_key;

WebFont.load({
    google: { families: [ FONT ] },
    active: function() {
        game = new Phaser.Game(400, 300, Phaser.AUTO, 'game_container');
        game.state.add("title", title_scene);
        game.state.add("main", main_scene);
        game.state.add("success", success_scene);
        game.state.add("gameover", gameover_scene);
        game.state.start("title");
    }
});

// ============================================================


var title_scene = {
    preload() {},

    create() {
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);

        var title_text = game.add.text(0, 0, 'S + F or R + V ?', { font: FONT, fontSize: '32px', fill: '#FFF' });
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 30;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#FFF' });
        desc_text.text = 'press R to restart';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 200;
    },

    update() {
        if (restart_key.isDown) {
            game.state.start("main");
        }
    }
}

// ============================================================


var main_scene = {
    preload() {
        records = [];
    },

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
            } else {
                gameover();
            }
        }

        if (subject.alive && key_r.isDown && key_v.isDown) {
            if (subject.text === 'R + V') {
                success();
            } else {
                gameover();
            }
        }
    }
}


// ============================================================

var success_scene = {
    preload() {},

    create() {
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#FFF' });
        title_text.text = 'Clear.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 40;

        var average = records.reduce( (sum, x, _) => { return sum + x; }, 0 ) / records.length;
        var result_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#FFF' });
        result_text.text = 'average: ' + average;
        result_text.x = game.world.centerX - result_text.width / 2;
        result_text.y = 120;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#FFF' });
        desc_text.text = 'press R to restart';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 200;
    },

    update() {
        if (restart_key.isDown) {
            game.state.start("main");
        }
    }
}


// ============================================================

var gameover_scene = {
    preload() {
        game.load.image('oni', 'oni.png');
    },

    create() {
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);

        var image = game.add.image(0, 0, "oni");
        image.width = game.width;
        image.height = game.height;
        image.alpha = 40;

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#F00' });
        title_text.text = 'Dead.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 40;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: '32px', fill: '#FFF' });
        desc_text.text = 'press R to restart';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 200;
    },

    update() {
        if (restart_key.isDown) {
            game.state.start("main");
        }
    }
}


// ============================================================

function display_next_subject() {
    subject.text = Math.round(Math.random()) ? 'S + F' : 'R + V';

    var next_ms = 4000 * Math.random();
    setTimeout(function() {
        timer.destroy();
        timer.start();
        subject.revive();
    }, next_ms);
}


function success() {
    subject.kill();
    records.push(timer.seconds);

    if (records.length === 10) {
        game.state.start("success");
    }

    display_next_subject();
}

function gameover() {
    game.state.start("gameover");
}
