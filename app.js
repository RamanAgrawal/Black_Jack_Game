
window.onload = () => {
    document.querySelector('#hitbtn').addEventListener('click', blackjackhit)
    document.querySelector('#standbtn').addEventListener('click', blackjackstand)
    document.querySelector('#dealbtn').addEventListener('click', blackjackdeal)
}

const hitsound = new Audio('./sounds/swish.m4a')
const bustsound = new Audio('./sounds/aww.mp3')
const winsound = new Audio('./sounds/cash.mp3')

let blackJackgame = {
    'you': { 'scorespan': '#userscore', 'div': '#user_div', 'score': 0 },
    'dealar': { 'scorespan': '#botscore', 'div': '#dealer_div', 'score': 0 },
    'cards': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'K', 'Q', 'A'],
    'cardMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
    'win': 0,
    'loss': 0,
    'drows': 0,
}
const You = blackJackgame['you']
const dealer = blackJackgame['dealar']

//hit button logic.....................///
let hit=true
blackjackhit = () => {
    if(hit){

        if (You['score'] <= 21) {
            let card = randomCardpicker()
            showCard(You, card)
            hitsound.play();
            updateScore(You, card);
            showScore(You)
        }else{
            alert('Sorry! Cannot pick card after bust.')
        }
    }
}
//deal button logic.....................///

blackjackdeal = () => {
    hit=true;
    let DivItems1 = document.querySelector('#user_div').querySelectorAll('img');
    let DivItems2 = document.querySelector('#dealer_div').querySelectorAll('img');
    DivItems1.forEach(e => {
        e.remove()
    });
    DivItems2.forEach(e => {
        e.remove()
    });
    You['score'] = 0;
    dealer['score'] = 0;
    document.querySelector(You['scorespan']).textContent = 0;
    document.querySelector(dealer['scorespan']).textContent = 0;

    document.querySelector(You['scorespan']).style.color = '#ffffff'
    document.querySelector(dealer['scorespan']).style.color = '#ffffff'

    document.querySelector('#result').textContent = 'Letsplay...!'
}
//stand button logic.....................///
sleep=(ms)=>{
    return new Promise(resolve=>setTimeout(resolve,ms)  );
        
    
}
 async function blackjackstand() {
   hit=false;
    while (dealer['score'] < 16) {
        let card = randomCardpicker();
        hitsound.play()
        showCard(dealer, card);
        updateScore(dealer, card);
        showScore(dealer);
        await sleep(1000);

    }
    console.log(blackJackgame['win'])
    console.log(blackJackgame['loss'])
    console.log(blackJackgame['drows'])
    computeWinner();
    
}
showCard = (active, card) => {
    let showMessage = document.createElement('img');
    showMessage.src = `./images/${card}.png`;
    document.querySelector(active['div']).appendChild(showMessage)
}
randomCardpicker = () => {
    let card = blackJackgame['cards']
    let random = Math.floor(Math.random() * 13)
    return card[random];
}

updateScore = (active, card) => {
    if (card === 'A') {
        if ((active['score'] + blackJackgame['cardMap'][card][1]) <= 21) {
            active['score'] += blackJackgame['cardMap'][card][1];
            // console.log(active['score']);
        } else {
            active['score'] += blackJackgame['cardMap'][card][0];
        }
        
    } else {
        active['score'] += blackJackgame['cardMap'][card]
    }
}
showScore = (active) => {
    if (active['score'] > 21) {
        document.querySelector(active['scorespan']).textContent = 'BUST!'
        document.querySelector(active['scorespan']).style.color = 'red'
        bustsound.play();
    } else {
        document.querySelector(active['scorespan']).textContent = active['score'];
    }
}

computeWinner = () => {
    let Winner;
    let result
    if (You['score'] <= 21) {
        if (You['score'] > dealer['score'] || dealer['score'] > 21) {
            
            Winner = "You Are the winner dude"
            result = "user";
            winsound.play();
            blackJackgame['win']++
            console.log(Winner);
        } else if (You['score'] === dealer['score']) {
            Winner = "Drow"
            blackJackgame['drows']++
        }
        else {
            Winner = "Computer Won..!"
            result = "bot";
            blackJackgame['loss']++
            bustsound.play()
        }
    }else if(You['score']>21 && dealer['score']>21) {
        Winner= "drow"
        blackJackgame['drows']++
    }else if(You['score']>21 && dealer['score']<21){
        result="bot";
        Winner = "Computer Won..!"
        blackJackgame['loss']++
    }
    else if(dealer['score']>21 && You['score']<21){
        result="user";
        Winner = "You Are the winner dude"
        blackJackgame['win']++
    }
    document.querySelector('#result').textContent = Winner
    resultUpdate();
    return result;
}

resultUpdate = () => {
    let userwin = blackJackgame['win'];
    let userloss = blackJackgame['loss'];
    let userdrow = blackJackgame['drows']


    document.querySelector('#user-win').textContent = userwin;
    document.querySelector('#user-loss').textContent = userloss;
    document.querySelector('#drow').textContent = userdrow;
}
