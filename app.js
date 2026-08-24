function showGame(game){

document.getElementById("menu").style.display="none";


if(game=="rocket")
rocket();


if(game=="dice")
dice();


if(game=="coin")
coin();


if(game=="rps")
rps();


if(game=="xo")
xo();

}



// 🚀 Rocket

function rocket(){

document.getElementById("game").innerHTML=`

<h1>🚀 Rocket</h1>

<h2 id="multi">1.00x</h2>

<button onclick="startRocket()">
شروع
</button>

<button onclick="back()">
بازگشت
</button>

`;

}



function startRocket(){

let m=1;

let timer=setInterval(()=>{

m+=0.1;

document.getElementById("multi")
.innerHTML=
m.toFixed(2)+"x";


if(Math.random()<0.05){

clearInterval(timer);

alert("💥 انفجار");

}

},200);

}




// 🎲 Dice

function dice(){

document.getElementById("game").innerHTML=`

<h1>🎲 Dice</h1>

<h2 id="dice">?</h2>

<button onclick="rollDice()">
پرتاب
</button>

<button onclick="back()">
بازگشت
</button>

`;

}


function rollDice(){

let x=Math.floor(Math.random()*6)+1;

document.getElementById("dice")
.innerHTML=x;

}




// 🪙 Coin

function coin(){

document.getElementById("game").innerHTML=`

<h1>🪙 شیر یا خط</h1>

<h2 id="coin">?</h2>

<button onclick="flip()">
بزن
</button>

<button onclick="back()">
بازگشت
</button>

`;

}


function flip(){

let r=Math.random()>0.5?
"🦁 شیر":
"🔵 خط";


document.getElementById("coin")
.innerHTML=r;

}




// ✊ RPS

function rps(){

document.getElementById("game").innerHTML=`

<h1>✊✋✌️</h1>

<button onclick="playRPS('✊')">
✊
</button>

<button onclick="playRPS('✋')">
✋
</button>

<button onclick="playRPS('✌️')">
✌️
</button>

<button onclick="back()">
بازگشت
</button>

`;

}


function playRPS(x){

let a=["✊","✋","✌️"];

let bot=a[Math.floor(Math.random()*3)];


alert(
"تو: "+x+
"\nربات: "+bot
);

}




function back(){

location.reload();

                     }
