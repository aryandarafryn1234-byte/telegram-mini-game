let multiplier = 1;

let running = false;

let crashed = false;

let betAmount = 0;


let rocket =
document.getElementById("rocket");

let display =
document.getElementById("multiplier");



function bet(amount){

betAmount = amount;

alert("Bet: "+amount+" 💎");

}



function startGame(){

if(running) return;


running=true;

crashed=false;

multiplier=1;


rocket.style.bottom="100px";



let audio =
new AudioContext();

let osc =
audio.createOscillator();

osc.frequency.value=300;

osc.connect(audio.destination);

osc.start();

osc.stop(audio.currentTime+0.3);



let game=setInterval(()=>{


multiplier += 0.01;


display.innerHTML =
multiplier.toFixed(2)+"x";



let move =
(multiplier-1)*35;


rocket.style.bottom =
(100+move)+"px";



rocket.style.transform =
"rotate(-25deg)";



let crashChance =
Math.random();



if(multiplier>2 && crashChance<0.02){


clearInterval(game);


running=false;

crashed=true;


display.innerHTML="💥 CRASH";


rocket.style.bottom="100px";


}


},100);



}



function cashOut(){

if(!running){

alert("Start game first");

return;

}


let win =
betAmount * multiplier;


alert(
"WIN 💎 "+win.toFixed(2)
);


}
