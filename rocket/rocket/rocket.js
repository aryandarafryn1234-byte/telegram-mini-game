let x = 1;
let crash;
let game=false;
let timer;


function start(){

if(game)return;


game=true;

x=1;


crash =
(Math.random()*8+1)
.toFixed(2);


document.getElementById("message")
.innerHTML="🚀 پرتاب شد";


timer=setInterval(()=>{


x+=0.08;


document.getElementById("multi")
.innerHTML=
x.toFixed(2)+"x";


document.getElementById("rocket")
.style.bottom=
(20+x*25)+"px";



if(x>=crash){

explode();

}


},100);


}




function cashout(){

if(!game)return;


clearInterval(timer);


document.getElementById("message")
.innerHTML=
"🎉 بردی! ضریب: "
+x.toFixed(2)+"x";


game=false;

}




function explode(){

clearInterval(timer);


document.getElementById("rocket")
.innerHTML="💥";


document.getElementById("message")
.innerHTML=
"💥 راکت منفجر شد";


game=false;


}
