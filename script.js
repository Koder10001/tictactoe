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
    if(turnNo >= 9){
        stat.innerText = "Draw";
        return;
    }

    let coordinate, numOfNegativeSign = Infinity, maxPoint=-Infinity;


    for(let i = 0 ; i < 3; i++ ){ // loop through all row

        for( let j = 0; j < 3; j++ ){ // loop through all square

            if( table[i][j] == 0 ){ // emply square
                
                console.log(i,j);

                let horizontalPoint = 0;
                let verticalPoint = 0;
                let diagonalPoint = 0;
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
                    

                    diagonalPoint = table[0][2] + table[1][1] + table[2][0];
                    
                    if (i == j ){ // [1][1] if this is the one in the center add value from the right slash too

                        diagonalPoint += table[0][0] + table[2][2];

                    }
                }
                else if( i + j == 0 || i + j == 4){ // if it's one of the rightslash square

                    diagonalPoint = table[0][0] + table[1][1] + table[2][2];

                }

                // count negatives for priorites

                if(verticalPoint < 0)
                    ++negativePoint;
                if(horizontalPoint < 0)
                    ++negativePoint;
                if(verticalPoint < 0)
                    ++negativePoint;
                

                

                if(horizontalPoint == 2 || verticalPoint == 2 || diagonalPoint == 2){

                    makeMove(j,i,type.O);
                    stat.innerText = "PC won";
                    isGameEnded = true;
                    return;

                }
                // else if(horizontalPoint == -2 || verticalPoint == -2 || diagonalPoint == -2){

                //     makeMove(j,i,type.O);
                //     return;

                // }
                else {

                    let sum = Math.abs(horizontalPoint) + Math.abs(verticalPoint) + Math.abs(diagonalPoint);

                    if(maxPoint <= sum){
                        maxPoint = sum;

                        if(numOfNegativeSign < negativePoint){

                            numOfNegativeSign = negativePoint;

                        }

                        coordinate = [i,j];

                    }

                    console.log(`at ${i} ${j}\nh = ${horizontalPoint}\nv = ${verticalPoint}\nd = ${diagonalPoint}\nsum = ${sum}`);

                }

                

            } // out of empty square

        }

    }

    makeMove(coordinate[1],coordinate[0], type.O);

}


function firstTwoStep(){
    if(turnNo == 2){  // go second, takes center
        if(table[1][1] == 0){
            makeMove(1,1,type.O);
        }
        else {
            makeMove(0,2, type.O);
            
        }
    }

    else if (turnNo == 1){ // go first, takes corner
        makeMove(0,2,type.O)
    }
    else if (turnNo == 3){ // go first, second turn, takes another corner that opposite with the player
        if(table[2][1] == type.X || table[2][2] == type.X || table[1][2] == type.X){
            makeMove(0,0, type.O);
        }
        else {
            makeMove(2,2, type.O);
        }
    }
}


function makeMove(x,y,char){
    console.log(x,y,isPlayerTurn);
    htmlTable[y][x].innerText = isPlayerTurn?"X":"O";
    table[y][x] = char;
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
    if(isPlayerTurn && table[y][x] == 0 || !isGameEnded){
        makeMove(x, y, type.X);
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