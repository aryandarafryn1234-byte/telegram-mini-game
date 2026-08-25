let multiplier = 1;

let running = false;

let bet = 0;

let timer;


const rocket =
document.getElementById("rocket");

const multi =
document.getElementById("multiplier");


const balance =
document.getElementById("balance");



function placeBet(amount){

if(running)return;


if(Number(balance.innerHTML)>=amount){

bet=amount;

balance.innerHTML =
Number(balance.innerHTML)-amount;

alert("Bet placed: "+amount);

}

}



document.getElementById("start")
.onclick=function(){


if(running)return;


running=true;

multiplier=1;


multi.innerHTML="1.00x";


let crash =
Math.random()*8+2;



timer=setInterval(()=>{


multiplier+=0.01;


multi.innerHTML=
multiplier.toFixed(2)+"x";


rocket.style.bottom =
(120 + multiplier*25)+"px";


rocket.style.transform=
"rotate(-20deg)";



if(multiplier>=crash){


clearInterval(timer);

running=false;


alert(
"💥 Rocket crashed at "+
multiplier.toFixed(2)+"x"
);


}

},50);



};



document.getElementById("cashout")
.onclick=function(){


if(!running || bet==0)return;


let win =
Math.floor(bet*multiplier);


balance.innerHTML =
Number(balance.innerHTML)+win;


alert(
"💰 Won "+win
);


bet=0;


};



function cashOut(x){

if(bet>0){

let win =
Math.floor(bet*x);


balance.innerHTML =
Number(balance.innerHTML)+win;


bet=0;

}

}
