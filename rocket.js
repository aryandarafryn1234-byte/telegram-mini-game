let multiplier = 1;
let running = false;
let crashPoint = 0;
let timer;
let coin = 1000;


function startGame(){

if(running) return;


running=true;

multiplier=1;

document.getElementById("result").innerHTML="";

crashPoint =
(Math.random()*5+1).toFixed(2);


timer=setInterval(()=>{


multiplier +=0.05;


document.getElementById("multiplier")
.innerHTML =
multiplier.toFixed(2)+"x";


let rocket =
document.getElementById("rocket");


rocket.style.transform =
"translateY(-"+multiplier*20+"px)";



if(multiplier>=crashPoint){

crash();

}


},100);


}



function cashOut(){

if(!running)
return;


clearInterval(timer);


let win =
Math.floor(
coin*(multiplier-1)
);


coin += win;


document.getElementById("coin")
.innerHTML=coin;


document.getElementById("result")
.innerHTML=
"🎉 بردی +"+win+" سکه";


running=false;

}



function crash(){

clearInterval(timer);


document.getElementById("result")
.innerHTML=
"💥 راکت منفجر شد!";


running=false;


}
