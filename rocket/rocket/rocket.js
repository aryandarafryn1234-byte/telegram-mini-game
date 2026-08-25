let balance = 1000;

let currentBet = 0;

let multiplier = 1;

let playing = false;

let crashPoint;

let timer;



function bet(amount){

if(playing)return;


if(amount > balance){

alert("موجودی کافی نیست");

return;

}


currentBet = amount;


document.getElementById("message")
.innerHTML =
"شرط انتخاب شد 💎 "+amount;

}



function startRocket(){

if(playing)return;


if(currentBet==0){

alert("اول مبلغ شرط را انتخاب کن");

return;

}



balance -= currentBet;

updateBalance();


multiplier = 1;


crashPoint =
(Math.random()*8+1)
.toFixed(2);


playing=true;


document.getElementById("rocket")
.innerHTML="🚀";


timer=setInterval(()=>{


multiplier +=
0.05 + multiplier/80;



document.getElementById("multiplier")
.innerHTML =
multiplier.toFixed(2)+"x";



document.getElementById("rocket")
.style.bottom =
(40 + multiplier*25)+"px";



if(multiplier>=crashPoint){

explode();

}



},100);


}



function cashOut(){

if(!playing)return;


let win =
Math.floor(
currentBet * multiplier
);



balance += win;


updateBalance();


document.getElementById("message")
.innerHTML =
"🎉 بردی 💎 "+win;


stop();


}



function explode(){

document.getElementById("rocket")
.innerHTML="💥";


document.getElementById("message")
.innerHTML=
"💥 BOOM! باختی";


stop();

}



function stop(){

clearInterval(timer);

playing=false;

multiplier=1;

}



function updateBalance(){

document.getElementById("balance")
.innerHTML=balance;

                  }
