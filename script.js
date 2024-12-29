"use-strict";
let stat;
let isPlayerTurn;
let htmlTable;
let table;
let turnNo;
let isGameEnded;


let type = {
    X : -1,
    O : 1
}


window.onload = function(){

    console.clear();
    stat = document.querySelector("#stat");
    stat.innerText = "Initiating ...";

    isPlayerTurn = true;
    htmlTable = new Array(3);
    table = new Array(3);
    turnNo = 1;
    isGameEnded = false;

    let squares = document.querySelectorAll(".square");

    for(let i = 0;i < 9; i++){
        
        let row = parseInt(i/3);

        if(htmlTable[row] == undefined){

            htmlTable[row] = new Array(3);
            table[row] = new Array(3);

        }

        htmlTable[row][i%3] = squares[i];
        table[row][i%3] = 0;

    }

    stat.innerText = "Oh, You are X btw";

}

function calc(){
    if(turnNo <= 3){
        firstTwoStep();
        return;
    }

    if(turnNo == 4){ 

        if(table[0][2] == table[2][0] && table[0][2] != 0|| table[0][0] == table[2][2] && table[0][0] != 0){

            makeMove(1,0);
            return;

        }

    }

    if(turnNo > 9){
        console.log(turnNo);
        stat.innerText = "Draw";
        return;
    }

    let coordinate, defense = 0, attack = 0, attackCoor, defenseCoor, defLock = false; // priorities 0 < -1 < 1 < -2 < 2


    for(let i = 0 ; i < 3; i++ ){ // loop through all row

        for( let j = 0; j < 3; j++ ){ // loop through all square

            if( table[i][j] == 0 ){ // emply square
                
                console.log(i,j);

                let horizontalPoint = 0;
                let verticalPoint = 0;
                let backSlashPoint = 0;
                let forwardSlashPoint = 0;
                // let negativePoint = 0;

                for(let num = 0; num < 3; num++){ // work on vertical and horizontal

                    horizontalPoint += table[num][j];
                    verticalPoint += table[i][num];

                }

                /* check diagonal when the empty square is in the corner or center;

                    0|1|2
                    1|2|3
                    2|3|4

                    0,0 | 0,1 | 0,2
                    1,0 | 1,1 | 1,2
                    2,0 | 2,1 | 2,2

                */

                if( i+j == 2 ){ // if it's one of the backslash square
                    

                    backSlashPoint = table[0][2] + table[1][1] + table[2][0];
                    
                    if (i == j ){ // [1][1] if this is the one in the center add value from the right slash too

                        forwardSlashPoint += table[0][0] + table[1][1] + table[2][2];

                    }
                }
                else if( i + j == 0 || i + j == 4){ // if it's one of the forwardslash square

                    forwardSlashPoint = table[0][0] + table[1][1] + table[2][2];

                }


                
                // check if is there any 2 in line and check immidiately
                if(horizontalPoint == 2 || verticalPoint == 2 || backSlashPoint == 2 || forwardSlashPoint == 2){ 

                    makeMove(j,i);
                    stat.innerText = "PC won";
                    isGameEnded = true;
                    return;

                }
                else { 

                    // count def and atk point for each square

                    let def = 0;
                    let atk = 0;

                    if(horizontalPoint < 0){
                        def += horizontalPoint;
                    }
                    else {
                        atk += horizontalPoint;
                    }

                    if(verticalPoint < 0){
                        def += verticalPoint;
                    }
                    else {
                        atk += verticalPoint;
                    }

                    if(backSlashPoint < 0){
                        def += backSlashPoint;
                    }
                    else {
                        atk += backSlashPoint;
                    }

                    if(forwardSlashPoint < 0){
                        def += forwardSlashPoint;
                    }
                    else {
                        atk += forwardSlashPoint;
                    }

                    // atk will never be 2
                    if (attack <= atk){
                        attack = atk;
                        attackCoor = [j,i];
                    }

                    
                    if(def <= defense){
                        defense = def;
                        defenseCoor = [j,i];
                    }

                    // incase either reach 2 or -2
                    if( !defLock ){
                        if( defense <= -2 ){
                            coordinate = [... defenseCoor];
                        }
                        else {
                            coordinate = [... attackCoor];
                        }
                    }
                    
                    // if found player have 2 inline - lock it then remaining square to look for 2 'O' inline
                    if(Math.min(horizontalPoint,verticalPoint,backSlashPoint,forwardSlashPoint) == -2){
                        defLock = true;
                        coordinate = [j,i];
                    }
                    console.log(`at ${i} ${j}\nh = ${horizontalPoint}\nv = ${verticalPoint}\nb = ${backSlashPoint}\nf = ${forwardSlashPoint}\ndef = ${defense}\natk = ${attack}`);

                }

                

            } // out of empty square

        }

    }

    makeMove(coordinate[0],coordinate[1]);
    if(turnNo > 9){
        stat.innerText = "Draw";
        return;
    }
}


function firstTwoStep(){
    if(turnNo == 2){  // go second, takes center
        if(table[1][1] == 0){
            makeMove(1,1);
        }
        else {
            makeMove(0,2);

        }
    }

    else if (turnNo == 1){ // go first, takes corner
        makeMove(0,2)
    }
    else if (turnNo == 3){ // go first, second turn, takes another corner that opposite with the player
        if(table[2][1] == type.X || table[2][2] == type.X || table[1][2] == type.X){
            makeMove(0,0);
        }
        else if (table[1][1] == type.X){
            makeMove(2,0);
        }
        else {
            makeMove(2,2);
        }
    }
}


function makeMove(x,y){

    let char = isPlayerTurn?"X":"O";
    htmlTable[y][x].innerText = char;
    table[y][x] = type[char];
    isPlayerTurn = !isPlayerTurn;
    ++turnNo;

}

function second(){
    if(turnNo==1){
        isPlayerTurn = false;
        calc();
    }
    
}

function playerMove(x, y){
    if(isPlayerTurn && table[y][x] == 0 && !isGameEnded){
        makeMove(x, y);
        calc();
    }
}

function restart(){
    let squares = document.querySelectorAll(".square");

    for(let square of squares){

        square.innerText = "";

    }

    window.onload();
}