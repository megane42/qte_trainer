// const GAME_WIDTH  = window.outerWidth * 0.7;
// const GAME_HEIGHT = window.outerHeight * 0.7;
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 450;
const GAME_BACKGROUND = '#000';

const TOTAL_SUBJECT = 10;

const FONT = 'Special Elite';
const FONT_MONO = 'VT323';
const FONT_COLOR_WHITE = '#fff';
const FONT_COLOR_RED   = '#f00';
const FONT_SIZE_S  = '32px';
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
var tweet_key;

WebFont.load({
    google: { families: [ FONT, FONT_MONO ] },
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
    preload() {
        game.load.image('oni', './img/oni.png');
    },

    create() {
        game.stage.backgroundColor = GAME_BACKGROUND;

        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);
        game.input.keyboard.removeKeyCapture(Phaser.KeyCode.R); // to enable ctrl + r (browser reload)

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
        game.input.keyboard.removeKeyCapture(Phaser.KeyCode.R); // to enable ctrl + r (browser reload)

        timer = game.time.create(false);

        subject = game.add.text(0, 0, 'S + F', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        subject.kill();

        record_text = game.add.text(0, 0, '', { font: FONT_MONO, fontSize: FONT_SIZE_S, fill: FONT_COLOR_WHITE });
        record_text.text = records_to_s();
        record_text.x = game.world.centerX - record_text.width / 2;
        record_text.y = 0.75 * game.height - record_text.height / 2;

        display_next_subject();
    },

    update() {
        record_text.text = records_to_s();

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
        tweet_key   = game.input.keyboard.addKey(Phaser.KeyCode.T);
        game.input.keyboard.removeKeyCapture(Phaser.KeyCode.R); // to enable ctrl + r (browser reload)

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        title_text.text = 'Clear.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 0.25 * game.height - title_text.height / 2;

        var average = records_to_avg();
        var result_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        result_text.text = 'average: ' + average + 's';
        result_text.x = game.world.centerX - result_text.width / 2;
        result_text.y = 0.5 * game.height - result_text.height / 2;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_S, fill: FONT_COLOR_WHITE });
        desc_text.text = 'press R to retry\npress T to tweet';
        desc_text.x = game.world.centerX - desc_text.width / 2;
        desc_text.y = 0.75 * game.height - desc_text.height / 2;

        firebase.database().ref("records").push({
            average: average,
            timestamp: parseInt(new Date() / 1000)
        });
    },

    update() {
        if (restart_key.isDown) {
            game.state.start("main");
        }
        if (tweet_key.isDown) {
            tweet('My Score is ' + records_to_avg() + ' s. Have you played?', location.href, 'QTE_Trainer');
        }
    }
}


// ============================================================

var gameover_scene = {
    preload() {
    },

    create() {
        restart_key = game.input.keyboard.addKey(Phaser.KeyCode.R);
        game.input.keyboard.removeKeyCapture(Phaser.KeyCode.R); // to enable ctrl + r (browser reload)

        var image = game.add.image(0, 0, "oni");
        image.width = game.width;
        image.height = game.height;
        image.alpha = 0.6;

        var title_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_LL, fill: FONT_COLOR_RED });
        title_text.text = 'Dead.';
        title_text.x = game.world.centerX - title_text.width / 2;
        title_text.y = 0.25 * game.height - title_text.height / 2;

        var desc_text = game.add.text(0, 0, '', { font: FONT, fontSize: FONT_SIZE_L, fill: FONT_COLOR_WHITE });
        desc_text.text = 'press R to retry';
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
    subject.x = Math.random() * (game.width - subject.width);
    subject.y = Math.random() * (game.height - subject.height) * 0.5;

    var next_ms = 1000 + 2000 * Math.random();
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

function records_to_s() {
    var str = "";
    for (var i = 0; i < TOTAL_SUBJECT; i++) {
        str += records[i] ? records[i].toFixed(3) + "s " : "------ ";
        str += i === TOTAL_SUBJECT / 2  - 1 ? "\n" : "";
    }
    return str;
}

function records_to_avg() {
    return parseFloat((records.reduce( (sum, x) => { return sum + x; }, 0 ) / records.length).toFixed(3));
}
