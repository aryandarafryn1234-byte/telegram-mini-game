let money=1000;

let betAmount=0;

let x=1;

let timer;

let crash;


function selectBet(a){

betAmount=a;

document.getElementById("msg")
.innerHTML="شرط 💎 "+a;

}



function start(){


if(betAmount==0){

alert("مبلغ انتخاب کن");

return;

}


money-=betAmount;

update();


x=1;

crash=(Math.random()*8+1).toFixed(2);


document.getElementById("rocket")
.innerHTML="🚀";


timer=setInterval(()=>{


x+=0.05;


document.getElementById("multi")
.innerHTML=x.toFixed(2)+"x";


document.getElementById("rocket")
.style.bottom=
(20+x*35)+"px";



if(x>=crash){

boom();

}


},100);



}



function cash(){


if(!timer)return;


let win=Math.floor(
betAmount*x
);


money+=win;


update();


document.getElementById("msg")
.innerHTML=
"🎉 بردی 💎 "+win;


stop();


}



function boom(){

document.getElementById("rocket")
.innerHTML="💥";


document.getElementById("msg")
.innerHTML="💥 انفجار";


stop();

}



function stop(){

clearInterval(timer);

timer=null;

}



function update(){

document.getElementById("balance")
.innerHTML=money;

}
