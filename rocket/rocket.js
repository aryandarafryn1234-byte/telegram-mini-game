let balance = 1000;

let betAmount = 0;

let multiplier = 1;

let playing = false;

let timer;

let crashPoint;



const coins =
document.getElementById("coins");

const rocket =
document.getElementById("rocket");

const multi =
document.getElementById("multiplier");

const message =
document.getElementById("message");





function setBet(amount){

    if(playing) return;


    if(balance < amount){

        message.innerHTML =
        "❌ موجودی کافی نیست";

        return;

    }


    betAmount = amount;


    message.innerHTML =
    "💎 شرط انتخاب شد: "+amount;

}







function startGame(){


    if(playing) return;


    if(betAmount === 0){

        message.innerHTML =
        "⚠️ اول شرط انتخاب کن";

        return;

    }



    balance -= betAmount;

    coins.innerHTML = balance;



    multiplier = 1;

    playing = true;



    rocket.innerHTML="🚀";

    rocket.style.bottom="50px";



    message.innerHTML =
    "🚀 راکت پرتاب شد";



    let sound =
    document.getElementById("launchSound");

    if(sound){

        sound.currentTime=0;

        sound.play();

    }





    // ضریب انفجار

    crashPoint =
    (Math.random()*8+1).toFixed(2);






    timer=setInterval(()=>{


        multiplier += 0.05 + multiplier/100;



        multi.innerHTML =
        multiplier.toFixed(2)+"x";




        rocket.style.bottom =
        (50 + multiplier*22)+"px";



        rocket.style.transform =
        "rotate(-20deg) scale(1.15)";





        if(multiplier >= crashPoint){

            explode();

        }




    },100);

}





function cashOut(){


    if(!playing) return;



    let win =
    Math.floor(
        betAmount * multiplier
    );



    balance += win;


    coins.innerHTML =
    balance;



    message.innerHTML =
    "🎉 بردی 💎 "+win;



    stopGame();


}






function explode(){


    rocket.innerHTML="💥";


    message.innerHTML =
    "💥 BOOM! راکت منفجر شد";



    let sound =
    document.getElementById("crashSound");


    if(sound){

        sound.currentTime=0;

        sound.play();

    }



    stopGame();



    setTimeout(()=>{


        rocket.innerHTML="🚀";

        rocket.style.bottom="50px";

        rocket.style.transform="";


        multi.innerHTML="1.00x";


    },1500);



}







function stopGame(){

    clearInterval(timer);

    playing=false;


                      }
