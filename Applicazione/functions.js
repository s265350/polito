const num_obs = 3;

//variabili locali
let lastCalled = -1;
let lastCalled2 = -1;
let giro = 0;
let giroCoin = false;
let monete = 0;
let vite = 3;
let invincibilita = false;
// audio
let audio = 1; // boolean for audio on - audio off

// difficulty (bonus)
let difficulty = 0.2;
let points = 0;
// navigation history
let from = "none" // prevous page
let to = "none"; // used for double go back (when coming soon is loaded)
let loading = "menu" // actual page
// ship
let ship = "none" // choosen ship

let lastTime = Date.now();

function redirect(page){
    if(page == 'back'){
        if(loading == "play")
            restart();
        page = to;
        redirect(from);
        from = page;
        return;
    }
    to = from;
    from = loading;
    loading = page;

    // hide everything
    document.getElementById("title").style.display = 'none';
    document.getElementById("bigtitle").style.display = 'none';
    document.getElementById("subtitle").style.display = 'none';
    document.getElementById("menu_soon").style.display = 'none';
    document.getElementById("menu").style.display = 'none';
    document.getElementById("settings").style.display = 'none';
    document.getElementById("play").style.display = 'none';
    document.getElementById("ships").style.display = 'none';

    // show only what is needed for the page
    if(page == 'soon'){
        document.getElementById("bigtitle").style.display = 'block';
        document.getElementById("bigtitle").innerHTML = "Coming soon";
        document.getElementById("menu_soon").style.display = 'block';
    } else if(page == 'menu'){
        document.getElementById("title").style.display = 'block';
        document.getElementById("title").innerHTML = "Asteroids wars";
        document.getElementById("subtitle").style.display = 'block';
        document.getElementById("subtitle").innerHTML = "We hope you'll enjoy it!";
        document.getElementById("menu").style.display = 'block';
    } else if(page == 'settings'){
        document.getElementById("title").style.display = 'block';
        document.getElementById("title").innerHTML = "Settings";
        document.getElementById("settings").style.display = 'block';
    } else if(page == 'ships'){
        document.getElementById("title").style.display = 'block';
        document.getElementById("title").innerHTML = "Select your ship";
        document.getElementById("ships").style.display = 'block';
        if(ship != 'none')
            document.getElementById("x3d_ships").style.display = 'block';
        document.getElementById("play_again").setAttribute("src", "images/menus/play.png");
        document.getElementById("play_again").setAttribute("onclick", "redirect('play')");
    } else if(page == 'play'){
        //document.getElementById("background").remove();
        document.getElementById("play").style.display = 'block';
        setTimeout(play, 2000, 'play'); // start game
    } else if(page == 'lost'){
        document.getElementById("title").style.display = 'block';
        document.getElementById("title").innerHTML = "Oh no! You've lost";
        document.getElementById("subtitle").style.display = 'block';
        document.getElementById("menu_soon").style.display = 'block';
        document.getElementById("menu_soon").setAttribute("onclick", "window.location.href='main.html'");

        document.getElementById("subtitle").innerHTML = "Points: " + points;
    }
}

function setAudio(option) {
    if(audio == 0) { // turn audio on
        if (loading == 'settings' && option == 'setting') { // turn audio on
            audio = 1;
            document.getElementById("audio_setting").setAttribute("src", "images/settings/audio_on.png");
            document.getElementById("audio_menu").play();
        }
        return;
    }
    if(audio == 1){
        if(option == 'setting') {
            if(loading == 'settings'){ // turn audio off
                audio = 0;
                document.getElementById("audio_setting").setAttribute("src", "images/settings/audio_off.png");
                document.getElementById("audio_menu").pause();
                document.getElementById("audio_game").setAttribute("enabled", 'false');
            }
        } else if (option == 'play'){ // play game audio
            document.getElementById("audio_menu").pause();
            document.getElementById("audio_game").setAttribute("enabled", 'true');
        } else if (option == 'lost'){ // play game over audio
            document.getElementById("audio_game").setAttribute("enabled", 'false');
            document.getElementById("audio_menu").pause();
            document.getElementById("audio_over").play();
        } else if (option == 'menu') { // play menu audio
            document.getElementById("audio_game").setAttribute("enabled", 'false');
            document.getElementById("audio_menu").play();
        } else if (loading == 'menu') { // first click
            document.getElementById("audio_game").setAttribute("enabled", 'false');
            document.getElementById("audio_menu").play();
        }


    }

}

function changeDifficulty(){
    let cycleIntervalDuration = "5";
    let animationDuration = "0.7";
    if(difficulty == 0.2){ // actual easy -> go medium
        difficulty = 0.4; // go medium
        cycleIntervalDuration = "4"
        animationDuration = "0.4"
        document.getElementById("difficulty_setting").setAttribute("src", "images/settings/difficolta_media.png");
    } else if(difficulty == 0.4){ // actual medium -> go hard
        difficulty = 0.6;
        cycleIntervalDuration = "3"
        animationDuration = "0.2"
        document.getElementById("difficulty_setting").setAttribute("src", "images/settings/difficolta_difficile.png");
    } else if(difficulty == 0.6) { // actual hard -> go easy
        difficulty = 0.2;
        cycleIntervalDuration = "5"
        animationDuration = "0.7"
        document.getElementById("difficulty_setting").setAttribute("src", "images/settings/difficolta_facile.png");
    }
    document.getElementById("spawn").setAttribute("cycleInterval", cycleIntervalDuration);
    document.getElementById("time0").setAttribute("cycleInterval", cycleIntervalDuration);
    document.getElementById("time1").setAttribute("cycleInterval", cycleIntervalDuration);
    document.getElementById("time2").setAttribute("cycleInterval", cycleIntervalDuration);
    document.getElementById("timeCoin").setAttribute("cycleInterval", cycleIntervalDuration);
    document.getElementById("shiftCenterRight").setAttribute("cycleInterval", animationDuration);
    document.getElementById("shiftLeftRight").setAttribute("cycleInterval", animationDuration);
    document.getElementById("shiftCenterLeft").setAttribute("cycleInterval", animationDuration);
    document.getElementById("shiftRightLeft").setAttribute("cycleInterval", animationDuration);
    document.getElementById("rotateRight").setAttribute("cycleInterval", animationDuration);
    document.getElementById("rotateLeft").setAttribute("cycleInterval", animationDuration);
}

function selectShip(name) {
    ship = name;
    let model = document.getElementById("shipmodel");
    model.url = "Models/StarDestroyer_ship.x3d"; // delete if other models are available
    if(name == "stardestroyer"){
        //model.url = "Models/StarDestroyer_ship.x3d";
        document.getElementById("stardestroyer").setAttribute("src", "images/ships/StarDestroyer_S.png");
        document.getElementById("tiewing").setAttribute("src", "images/ships/Tiewing_U.png");
        document.getElementById("xwing").setAttribute("src", "images/ships/Xwing_U.png");
        document.getElementById("millenniumfalcon").setAttribute("src", "images/ships/MillenniumFalcon_U.png");
    } else if(name == "tiewing"){
        //model.url = "Models/Tiewing_ship.x3d";
        document.getElementById("stardestroyer").setAttribute("src", "images/ships/StarDestroyer_U.png");
        document.getElementById("tiewing").setAttribute("src", "images/ships/Tiewing_S.png");
        document.getElementById("xwing").setAttribute("src", "images/ships/Xwing_U.png");
        document.getElementById("millenniumfalcon").setAttribute("src", "images/ships/MillenniumFalcon_U.png");
    } else if(name == "xwing"){
        //model.url = "Models/Xwing_ship.x3d";
        document.getElementById("stardestroyer").setAttribute("src", "images/ships/StarDestroyer_U.png");
        document.getElementById("tiewing").setAttribute("src", "images/ships/Tiewing_U.png");
        document.getElementById("xwing").setAttribute("src", "images/ships/Xwing_S.png");
        document.getElementById("millenniumfalcon").setAttribute("src", "images/ships/MillenniumFalcon_U.png");
    } else if(name == "millenniumfalcon"){
        //model.url = "Models/MillenniumFalcon_ship.x3d";
        document.getElementById("stardestroyer").setAttribute("src", "images/ships/StarDestroyer_U.png");
        document.getElementById("tiewing").setAttribute("src", "images/ships/Tiewing_U.png");
        document.getElementById("xwing").setAttribute("src", "images/ships/Xwing_U.png");
        document.getElementById("millenniumfalcon").setAttribute("src", "images/ships/MillenniumFalcon_S.png");
    }
    document.getElementById("x3d_ships").style.display = 'block';
}

function play(status){
    if(status == 'play'){ // start
        document.getElementById("spawn").setAttribute("enabled", 'true');
        document.getElementById("spawn").setAttribute("loop", 'true');
        lastCalled = -1;
        lastCalled2 = -1;
        giro = 0;
        giroCoin = false;
        monete = 0;
        vite = 3;
        invincibilita = false;
        turnOff();
        document.getElementById("nVite").setAttribute("string",vite.toString());

        setAudio('play');
    }
    if(status == 'lost') { // lost
        document.getElementById("time0").setAttribute("enabled", 'false');
        document.getElementById("time1").setAttribute("enabled", 'false');
        document.getElementById("time2").setAttribute("enabled", 'false');
        document.getElementById("spawn").setAttribute("enabled", 'false');
        setAudio('lost');
        setTimeout(redirect, 1000, 'lost');
    }
}

function collisioni(eventObject) {
    if(eventObject.type !== "outputchange" || eventObject.fieldName !== "value_changed")
        return;

    let naveCoord = document.getElementById("naveTRANS").getFieldValue("translation");
    if ((naveCoord.z - 2 <= document.getElementById("ostacolo0").getFieldValue("translation").z &&
        naveCoord.z + 2 >= document.getElementById("ostacolo0").getFieldValue("translation").z &&
        naveCoord.x - 2 <= document.getElementById("ostacolo0").getFieldValue("translation").x &&
        naveCoord.x + 2 >= document.getElementById("ostacolo0").getFieldValue("translation").x)
        || (naveCoord.z - 2 <= document.getElementById("ostacolo1").getFieldValue("translation").z &&
            naveCoord.z + 2 >= document.getElementById("ostacolo1").getFieldValue("translation").z &&
            naveCoord.x - 2 <= document.getElementById("ostacolo1").getFieldValue("translation").x &&
            naveCoord.x + 2 >= document.getElementById("ostacolo1").getFieldValue("translation").x)
        || (naveCoord.z - 2 <= document.getElementById("ostacolo2").getFieldValue("translation").z &&
            naveCoord.z + 2 >= document.getElementById("ostacolo2").getFieldValue("translation").z &&
            naveCoord.x - 2 <= document.getElementById("ostacolo2").getFieldValue("translation").x &&
            naveCoord.x + 2 >= document.getElementById("ostacolo2").getFieldValue("translation").x)) {
        if (!invincibilita) {
            if((Date.now() - lastTime) > 1000) {
                lastTime = Date.now();
                document.getElementById("hurt").setAttribute("on","true");
                document.getElementById("damagetext").setAttribute("translation", "0 2 -1");
                vite--;
                document.getElementById("nVite").setAttribute("string",vite.toString());
                console.log(vite.toString());
                document.getElementById("damage").play();
                if (vite <= 0)
                    play('lost');
                else
                    setTimeout(turnOff,500);
            }
        }
    } else if (naveCoord.z - 1 <= document.getElementById("coin").getFieldValue("translation").z &&
        naveCoord.z + 1 >= document.getElementById("coin").getFieldValue("translation").z &&
        naveCoord.x - 2 <= document.getElementById("coin").getFieldValue("translation").x &&
        naveCoord.x + 2 >= document.getElementById("coin").getFieldValue("translation").x) {
        if ((Date.now() - lastTime) > 5000) {
            lastTime = Date.now();
            monete++;
            document.getElementById("timeCoin").setAttribute("stopTime", Date.now() / 1000);
            document.getElementById("timeCoin").setAttribute("enabled", "false");
            document.getElementById("coinSound").play();
            document.getElementById("nCoin").setAttribute("string", monete.toString());
            document.getElementById("coin").setAttribute("translation", "0 0 -10");
            checkCoin();
        }
    }
}

function turnOff() {
    document.getElementById("hurt").setAttribute("on","false");
    document.getElementById("damagetext").setAttribute("translation", "0 2 -10");

}

function changeVisibleNode(eventObject){
    //aggiorno il punteggio
    points = 10 * difficulty * giro * parseInt(document.getElementById("spawn").getAttribute("elapsedTime").valueOf());
    document.getElementById("points").setAttribute("string", "Points: " + points.toString());

    if(eventObject.type !== "outputchange"  || eventObject.fieldName !== "cycleTime")
        return;
    let spawn = document.getElementById("spawn");
    if(spawn.firstCycle && giro !== 0)
        return;

    document.getElementById("elapsed").innerHTML = document.getElementById("spawn").getAttribute("elapsedTime").valueOf();
    document.getElementById("elapsedOb0").innerHTML = document.getElementById("time0").getAttribute("elapsedTime").valueOf();
    document.getElementById("elapsedOb1").innerHTML = document.getElementById("time1").getAttribute("elapsedTime").valueOf();
    document.getElementById("elapsedOb2").innerHTML = document.getElementById("time2").getAttribute("elapsedTime").valueOf();
    document.getElementById("cycle").innerHTML = spawn.getAttribute("elapsedTime").valueOf();

    let next = lastCalled;
    let next2 = lastCalled2;

    if(lastCalled!==-1)
        document.getElementById("time"+String(lastCalled)).setAttribute("pauseTime", spawn.time);
    if(lastCalled2!==-1)
        document.getElementById("time"+String(lastCalled2)).setAttribute("pauseTime", spawn.time);

    while(next === lastCalled) {
        next = Math.floor((Math.random() * 3) + 1);
        next--;
        if(giro>1) {
            do {
                next2 = Math.floor((Math.random() * 3) + 1);
                next2--;
            }
            while (next2 === next);
        }
    }
    lastCalled = next;
    lastCalled2 = next2;


    if(giro%2===0 && giro!==0) {
        let now = document.getElementById("spawn").getAttribute("time");

        let tempo = document.getElementById("time0").getAttribute("cycleInterval");
        let tempoattuale = 0;
        if (tempo > 1) {
            tempoattuale = tempo - difficulty;
            tempoattuale = parseFloat(tempoattuale.toFixed(1));
        } else
            tempoattuale = 1;

        document.getElementById("time0").setAttribute("cycleInterval", tempoattuale);
        document.getElementById("time1").setAttribute("cycleInterval", tempoattuale);
        document.getElementById("time2").setAttribute("cycleInterval", tempoattuale);
        document.getElementById("spawn").setAttribute("cycleInterval", tempoattuale);
        document.getElementById("timeCoin").setAttribute("enabled", "false");
        document.getElementById("timeCoin").setAttribute("cycleInterval", tempoattuale.toString());
    }

    //gestione monete
    if(giroCoin===true){
        if(next2 === -1){
            do {
                next2 = Math.floor((Math.random() * 3) + 1);
                next2--;
            }
            while (next2 === next);
        }
        if(next2=== 0)
            document.getElementById("moveCoin").setAttribute("keyValue","4 0 50  4 0 -20");
        else if(next2 ===1)
            document.getElementById("moveCoin").setAttribute("keyValue","0 0 50  0 0 -20");
        else
            document.getElementById("moveCoin").setAttribute("keyValue","-4 0 50  -4 0 -20");

        document.getElementById("timeCoin").setAttribute("enabled", "true");
        document.getElementById("timeCoin").setAttribute("startTime", spawn.time);

    }

    document.getElementById("giro").innerHTML = giro;
    giro++;
    //document.getElementById("time"+String(next)).setAttribute("loop", false);
    document.getElementById("time"+String(next)).setAttribute("startTime", spawn.time);
    document.getElementById("time"+String(next)).setAttribute("resumeTime", spawn.time);

    if(next2!==-1 && !giroCoin) {
        //document.getElementById("time" + String(next2)).setAttribute("loop", false);
        document.getElementById("time" + String(next2)).setAttribute("startTime", spawn.time);
        document.getElementById("time" + String(next2)).setAttribute("resumeTime", spawn.time);
    }

     if(difficulty > 0.3)
        giroCoin = !giroCoin;

}

function checkCoin(){
    if(monete >= 5){
        invincibilita = true;

        document.getElementById("invincibleText").setAttribute("translation", "4 4 0");
        monete = monete - 5;
        document.getElementById("nCoin").setAttribute("string", monete.toString());
        document.getElementById("spot").setAttribute("color", "1 0 1");
        document.getElementById("hurt").setAttribute("color", "1 0 1");
        document.getElementById("hurt").setAttribute("on", "true");

        console.log("avvio");
        setTimeout(fineInv,10000);
    }
}

function fineInv(){
    invincibilita = false;
    document.getElementById("invincibleText").setAttribute("translation", "4 4 -10");
    document.getElementById("spot").setAttribute("color", "1 1 1");
    document.getElementById("hurt").setAttribute("color", "1 0 0");
    document.getElementById("hurt").setAttribute("on", "false");
    console.log("Fine invincibile");
}

document.onkeydown = function(event) {
    let pos = document.getElementById('naveTRANS').getFieldValue('translation');
    let shift;
    let rotation;
    if(event.keyCode === 37) { // left arrow
        if (pos.x === 0)
            shift = document.getElementsByName('shiftCenterLeft')[0];
        else if (pos.x === -4)
            shift = document.getElementsByName('shiftRightLeft')[0];
        else return;
        rotation = document.getElementsByName('rotateLeft')[0];
    } else if(event.keyCode === 39){ // right arrow
            if(pos.x === 0)
                shift = document.getElementsByName('shiftCenterRight')[0];
            else if(pos.x === 4)
                shift = document.getElementsByName('shiftLeftRight')[0];
            else return;
            rotation = document.getElementsByName('rotateRight')[0];
    }
    else if(event.keyCode === 27){ //ESC
        redirect("lost");
    }
    shift.setAttribute('enabled', 'true');
    shift.setAttribute('loop', 'false');
    rotation.setAttribute('enabled', 'true');
    rotation.setAttribute('loop', 'false');
};
