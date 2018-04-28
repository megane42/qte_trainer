// const GAME_WIDTH  = window.outerWidth * 0.7;
// const GAME_HEIGHT = window.outerHeight * 0.7;
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 450;
const GAME_BACKGROUND = '#000';

const TOTAL_SUBJECT = 10;

const FONT = 'Special Elite';
const FONT_COLOR_WHITE = '#fff';
const FONT_COLOR_RED   = '#f00';
const FONT_SIZE_L  = '64px';
const FONT_SIZE_LL = '128px';

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
        game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game_container');
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
        game.stage.backgroundColor = GAME_BACKGROUND;
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);

        var title_text = game.add.text(0, 0, 'S + F or R + V ?', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 0.333 * game.height - title_text.height / 2;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        desc_text.text = 'press R to start';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 0.666 * game.height - desc_text.height / 2;
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

        subject = game.add.text(16, 16, 'S + F', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
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

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        title_text.text = 'Clear.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 0.25 * game.height - title_text.height / 2;

        var average = records.reduce( (sum, x, _) => { return sum + x; }, 0 ) / records.length;
        average = average.toFixed(4) + ' s'

        var result_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        result_text.text = 'average: ' + average;
        result_text.x = game.world.centerX - result_text.width / 2;
        result_text.y = 0.5 * game.height - result_text.height / 2;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        desc_text.text = 'press R to restart';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 0.75 * game.height - desc_text.height / 2;
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
        game.load.image('oni', './oni.png');
    },

    create() {
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);

        var image = game.add.image(0, 0, "oni");
        image.width = game.width;
        image.height = game.height;
        image.alpha = 0.6;

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_LL, fill: FONT_COLOR_RED });
        title_text.text = 'Dead.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 0.25 * game.height - title_text.height / 2;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        desc_text.text = 'press R to restart';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 0.75 * game.height - desc_text.height / 2;
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

    var next_ms = 3000 * Math.random();
    setTimeout(function() {
        timer.destroy();
        timer.start();
        subject.revive();
    }, next_ms);
}


function success() {
    subject.kill();
    records.push(timer.seconds);

    if (records.length === TOTAL_SUBJECT) {
        game.state.start("success");
    }

    display_next_subject();
}

function gameover() {
    game.state.start("gameover");
}
