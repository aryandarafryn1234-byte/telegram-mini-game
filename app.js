let tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


let board=[
"",
"",
"",
"",
"",
"",
"",
"",
""
];


let player="❌";
let score=1000;


function draw(){

let html="";

for(let i=0;i<9;i++){

html+=`
<div class="cell" onclick="play(${i})">
${board[i]}
</div>
`;

}

document.getElementById("board").innerHTML=html;

}


function play(i){

if(board[i]!="") return;


board[i]=player;


if(check()){

alert(player+" برنده شد 🎉");

score+=100;

document.getElementById("score").innerHTML=score;

return;

}


player =
player=="❌"
?"⭕"
:"❌";


draw();

}


function check(){

let win=[
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];


for(let x of win){

if(
board[x[0]] &&
board[x[0]]==board[x[1]] &&
board[x[1]]==board[x[2]]
){

return true;

}

}

return false;

}



function restart(){

board=[
"",
"",
"",
"",
"",
"",
"",
"",
""
];

player="❌";

draw();

}


draw();
