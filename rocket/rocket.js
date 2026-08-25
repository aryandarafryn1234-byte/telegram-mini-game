let balance = 1000;

let betAmount = 0;

let multiplier = 1;

let running = false;

let timer;


const rocket = document.getElementById("rocket");
const multi = document.getElementById("multiplier");
const balanceText = document.getElementById("balance");
const info = document.getElementById("info");



function setBet(amount){

    if(running){
        return;
    }


    if(balance < amount){

        info.innerHTML="❌ موجودی کافی نیست";
        return;

    }


    betAmount = amount;


    info.innerHTML =
    "💎 Bet: " + amount;

}





function startGame(){


    if(running){
        return;
    }


    if(betAmount === 0){

        info.innerHTML=
        "اول مبلغ را انتخاب کن";

        return;

    }



    balance -= betAmount;

    balanceText.innerHTML = balance;



    multiplier = 1;

    running = true;



    let crashPoint =
    (Math.random()*7 + 1.5);



    info.innerHTML =
    "🚀 Rocket launched";



    timer = setInterval(()=>{


        multiplier += 0.03;



        multi.innerHTML =
        multiplier.toFixed(2)+"x";



        rocket.style.bottom =
        (60 + multiplier*25)+"px";



        rocket.style.transform =
        "rotate(-25deg)";





        if(multiplier >= crashPoint){


            clearInterval(timer);

            running=false;


            multi.innerHTML =
            "💥 CRASH";


            rocket.innerHTML="💥";


            info.innerHTML =
            "باختی 😢";



            setTimeout(()=>{

                rocket.innerHTML="🚀";

                rocket.style.bottom="60px";

                rocket.style.transform="";

                multi.innerHTML="1.00x";

            },1500);


        }



    },100);



}







function cashOut(){


    if(!running){

        info.innerHTML=
        "بازی شروع نشده";

        return;

    }



    let win =
    Math.floor(
        betAmount * multiplier
    );



    balance += win;


    balanceText.innerHTML =
    balance;



    info.innerHTML =
    "🎉 بردی 💎 "+win;



    clearInterval(timer);


    running=false;



    rocket.style.bottom="60px";

    rocket.style.transform="";

}
