$(document).ready(function() { 

/*global $:false, jQuery:false */
"use strict";
(function($){   
    var gameOn = 0;
    var numberOn = 0;
    var turnedOff = 0;
    var frequency = 3000;
    var numbertoOn = 1;
    var i = 1;
    var totalSquares = 116;
    var offset = $('#clickspace').offset();
    var squares = [];
    var timeout;

    $( window ).resize(function(){offset = $('#clickspace').offset();})

    function getSquares(squareClass){
        var arrayOfSquares=[];
        
        $('.' + squareClass).each(function(){
            var squareProperties = $(this).position();
            squareProperties.ref = $(this);
            squareProperties.width = squareProperties.ref.width();
            arrayOfSquares.push(squareProperties);
        })

        return arrayOfSquares
    }

    squares = getSquares('square');

    function getHitSquare(arrayOfSquares,offset,clickEvent){
        //this is a binary search. I have been waiting since A levels to implement one of these!
        var max = arrayOfSquares.length-1;
        var min = 0;
        var i = Math.floor((min + max)/2);
        var result;
        var eventCoordinates={};
        var counter=0;

        eventCoordinates.x=clickEvent.pageX;
        eventCoordinates.y=clickEvent.pageY;

        
        function highLowOrHit(square,offset,eventCoordinates){
            
            var squareBounds={};

            squareBounds.left = offset.left + square.left;
            squareBounds.right = squareBounds.left + square.width;
            squareBounds.top = offset.top + square.top;
            squareBounds.bottom = squareBounds.top + square.width;

            if (eventCoordinates.y < squareBounds.top){return 'tooLow'};
            if (eventCoordinates.y > squareBounds.bottom){return 'tooHigh'};

            if (eventCoordinates.x < squareBounds.left){return 'tooLow'};
            if (eventCoordinates.x > squareBounds.right){return 'tooHigh'};

            return 'hit';

        }

        result = highLowOrHit(arrayOfSquares[i],offset,eventCoordinates);
        
        while (result !=='hit' && counter<20){
            console.log('miss');
            if(result==='tooHigh'){
                min = i;
            }else if(result==='tooLow'){
                max=i;

            } 
            i= Math.round(min + (max - min)/2);
            if (max === 1){i=0;}
           // if ((max - min) === 1){i=max;}
        result = highLowOrHit(arrayOfSquares[i],offset,eventCoordinates);
        counter++;
        }
        if (result !=='hit')console.log(max,min,i);

        return arrayOfSquares[i].ref

    }
    


function handleClick(e){
        if (gameOn === 0) {return false}
        var hitSquare = getHitSquare(squares,offset,e);
        if( hitSquare.hasClass("on") ){
                    hitSquare.removeClass("on");
                    numberOn--;
                    turnedOff++;
                    $("#score").empty().append(turnedOff);
                    //console.log(numberOn);
                } else {
                    turnedOff-=3;
                    $("#score").empty().append(turnedOff);
                    hitSquare.addClass("on");
                    numberOn++;
                }
                calcprogres(numberOn);

      }




      function handleTouch(touchEvent){
        var touch;
        console.log(touchEvent);
        touchEvent.preventDefault();
        touch=touchEvent.originalEvent.changedTouches[0];
        handleClick(touch);

      }
    
    $("#start").click(function(){ startgame(); });
    
    function turnon(howmany){
        i=0;
        if (typeof howmany !=='number'){howmany=0;}
        while(i<howmany&& $('.on').length<totalSquares){
            var whichone = Math.floor((Math.random() * totalSquares) + 1);
            if( $("#" + whichone).hasClass("on") ){} else{
                $("#" + whichone).addClass('on');
                numberOn++;
                i++;
            }
        }
        calcprogres(numberOn);
    }
    
    function runscript(){
        turnon( Math.floor(numbertoOn) );
        if(numbertoOn < 11){ numbertoOn += 0.55;}
        //console.log(numberOn);
        if( numberOn < totalSquares-8 ){
            //console.log("bing");
            frequency -= 500;
            timeout = setTimeout(runscript,frequency);
        } else {
            finishgame();
        }
    }
    
    function finishgame(){
        clearTimeout(timeout);
        gameOn = 0;

            $('#clickspace').unbind('click',handleClick);
            $('#clickspace').unbind('touchstart',handleTouch);

        $("#gameover").show();
        calcprogres(117);
        $("#yourscore").empty().append("Your score: " + turnedOff);
        $("#yourscore2").empty().append(turnedOff);
    }
    
    function startgame() { 
            gameOn = 1;
            $('#clickspace').click(handleClick);
            $('#clickspace').bind('touchstart',handleTouch);

            $("#gameover").hide();
        
            numberOn = 0;
            turnedOff = 0;
            frequency = 3000;
            numbertoOn = 1;
            i=1;
        
            calcprogres(0);
            $(".square").each(function(){
                $(this).attr("id",i);
                $(this).removeClass("on");
                i++;
            });
        
            runscript();
        
    }
    
    function calcprogres(no){
        var rounded = Math.floor( (no/totalSquares)*100);
        //console.log(rounded);
        $("#progressbar").width(rounded+"%");
    }

})(jQuery); 

});


