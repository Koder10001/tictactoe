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

    stat.innerText = "You are X";

}

function calc(){
    if(turnNo <= 3){
        firstTwoStep();
        return;
    }

    if(turnNo == 4){

        if(table[0][2] == table[2][0] && table[0][2] != 0|| table[0][0] == table[2][2] && table[0][0] != 0){
            makeMove(0,1);
            return;
        }

    }

    if(turnNo >= 9){
        stat.innerText = "Draw";
        return;
    }

    let coordinate, isNegative = true, priorities = 0; // priorities 0 < -1 < 1 < -2 < 2


    for(let i = 0 ; i < 3; i++ ){ // loop through all row

        for( let j = 0; j < 3; j++ ){ // loop through all square

            if( table[i][j] == 0 ){ // emply square
                
                console.log(i,j);

                let horizontalPoint = 0;
                let verticalPoint = 0;
                let backSlashPoint = 0;
                let forwardSlashPoint
                let negativePoint = 0;

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

                        forwardSlashPoint += table[0][0] + table[2][2] + table[1][1];

                    }
                }
                else if( i + j == 0 || i + j == 4){ // if it's one of the forwardslash square

                    forwardSlashPoint = table[0][0] + table[1][1] + table[2][2];

                }

                // count negatives for priorities

                if(verticalPoint < 0)
                    ++negativePoint;
                if(horizontalPoint < 0)
                    ++negativePoint;
                if(verticalPoint < 0)
                    ++negativePoint;
                

                

                if(horizontalPoint == 2 || verticalPoint == 2 || backSlashPoint == 2 || forwardSlashPoint == 2){

                    makeMove(j,i);
                    stat.innerText = "PC won";
                    isGameEnded = true;
                    return;

                }
                // else if(horizontalPoint == -2 || verticalPoint == -2 || diagonalPoint == -2){

                //     makeMove(j,i,type.O);
                //     return;

                // }
                else {

                    //let sum = Math.abs(horizontalPoint) + Math.abs(verticalPoint) + Math.abs(diagonalPoint);
                    //let sum = horizontalPoint + verticalPoint + diagonalPoint;
                    let absH = Math.abs(horizontalPoint);
                    let absV = Math.abs(verticalPoint);
                    let absB = Math.abs(backSlashPoint);
                    let absF = Math.abs(forwardSlashPoint);
                    
                    if( absH > Math.abs(priorities) || horizontalPoint > 0 && priorities < 0 && Math.abs(priorities) == absH ){
                        priorities = horizontalPoint;
                        coordinate = [j,i];
                    }
                    if( absV > Math.abs(priorities) || verticalPoint > 0 && priorities < 0 && Math.abs(priorities) == absV ){
                        priorities = verticalPoint;
                        coordinate = [j,i];
                    }
                    if( absB > Math.abs(priorities) || backSlashPoint > 0 && priorities < 0 && Math.abs(priorities) == absB ){
                        priorities = backSlashPoint;
                        coordinate = [j,i];
                        
                    }
                    if(absF > Math.abs(priorities)  || forwardSlashPoint > 0 && priorities < 0 && Math.abs(priorities) == absF ){
                        priorities = forwardSlashPoint;
                        coordinate = [j,i];
                    }

                    console.log(`at ${i} ${j}\nh = ${horizontalPoint}\nv = ${verticalPoint}\nb = ${backSlashPoint}\nf = ${forwardSlashPoint}\npri = ${priorities}`);

                }

                

            } // out of empty square

        }

    }
    makeMove(coordinate[0],coordinate[1]);

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