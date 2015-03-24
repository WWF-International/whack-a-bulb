$(document).ready(function() { 

/*global $:false, jQuery:false */
"use strict";
(function($){   
    var gameOn = 0;
    var numberOn = 0;
    var turnedOff = 0;
    var period = 3000;
    var level =0;
    var levels = [2500,1000,2000,1500,5000,2000,1500,3000,1500,1000,1000];
    var resetLevels = arrCopy(levels);
    var maxOn = 8;
    var numbertoOn = 1;
    var i = 1;
    var totalSquares = 116;
    var offset = $('#clickspace').offset();
    var squares = [];
    var timeout;
    var twitterMsg="I scored {{SCORE}} playing smack-a-bulb on #EarthHourUK's website. Can you beat my score?";
    var linkUrl = window.top.location.href;
    var originalUrl = window.top.location.href;

    function arrCopy(original){
        var arr=[];
        for(i=0;i<original.length;i++)
            {arr.push(original[i]);}
        return arr;}

    $( window ).resize(function(){offset = $('#clickspace').offset();});

    function getSquares(squareClass){
        var arrayOfSquares=[];
        
        $('.' + squareClass).each(function(){
            var squareProperties = $(this).position();
            squareProperties.ref = $(this);
            squareProperties.width = squareProperties.ref.width();
            squareProperties.isOn = false;
            arrayOfSquares.push(squareProperties);
        });

        return arrayOfSquares;
    }



    function getHitSquare(arrayOfSquares,offset,clickEvent){
        //this is a binary search. I have been waiting since A levels to implement one of these!
        var max = arrayOfSquares.length-1;
        var min = 0;
        var i = Math.floor((min + max)/2);
        // if we haven't found the hit square after this many iterations we must have clicked dead space. 
        var maxAttempts = (Math.log(arrayOfSquares.length)/Math.log(2)) + 5; 
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

            if (eventCoordinates.y < squareBounds.top){return 'tooLow';}
            if (eventCoordinates.y > squareBounds.bottom){return 'tooHigh';}

            if (eventCoordinates.x < squareBounds.left){return 'tooLow';}
            if (eventCoordinates.x > squareBounds.right){return 'tooHigh';}

            return 'hit';

        }

        result = highLowOrHit(arrayOfSquares[i],offset,eventCoordinates);
        
        while (result !=='hit' && counter<20){

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

        return {squareObject:arrayOfSquares[i],index:i};

    }
    


function handleClick(e){
        if (gameOn === 0) {return false;}
        var hitSquare = getHitSquare(squares,offset,e);
        if( hitSquare.squareObject.isOn){
                    hitSquare.squareObject.ref.removeClass("on");
                    squares[hitSquare.index].isOn = false;
                    numberOn--;
                    turnedOff++;
                    $("#score").empty().append(turnedOff);
                } else {
                    turnedOff-=3;
                    $("#score").empty().append(turnedOff);
                    hitSquare.squareObject.ref.addClass("on");
                    squares[hitSquare.index].isOn = true;
                    numberOn++;
                }
                calcprogres(numberOn);

      }




      function handleTouch(touchEvent){
        var touch;
        touchEvent.preventDefault();
        touch=touchEvent.originalEvent.changedTouches[0];
        handleClick(touch);

      }
    
    $("#start").click(startgame);
	
    function turnon(howmany){
        i=0;
        if (typeof howmany !=='number'){howmany=0;}
        while(i<howmany&& $('.on').length<totalSquares){
            var whichone = Math.floor((Math.random() * totalSquares) );
            if( squares[whichone].isOn === false) {
                squares[whichone].ref.addClass('on');
                squares[whichone].isOn = true;
                numberOn++;
                i++;
            }
        }
        calcprogres(numberOn);
    }
    


    function runscript(){
        turnon( Math.floor(numbertoOn) );
        if(numbertoOn < maxOn){ numbertoOn += 0.55;}
        if( numberOn < totalSquares-8 ){

            if (level < levels.length - 1){level++;}
            else{
                level=0;
                if (levels.length > 1) { levels.shift();}
            }
            period = levels[level];
            timeout = setTimeout(runscript,period);
        } else {
            finishgame();
        }
    }
    
    function finishgame(){
        clearTimeout(timeout);
        gameOn = 0;

        $('#clickspace').unbind('click',handleClick);
        $('#clickspace').unbind('touchstart',handleTouch);

        postGame();



        
    }
    

    function postGame(){
        //alert('end');
        
        endAnimation(10,endScreen);
        //endScreen();
    }

    function endAnimation(iterations,callback){

        var iterationCounter=0;
           
        var animate = setInterval(function(){frame(callback);},250);
        function frame(callback){ 
            
            $('.square').css('visibility', iterationCounter%2===1 ? 'visible' :'hidden');
                iterationCounter++; 
            if (iterationCounter >= iterations){
                clearInterval(animate);
                callback();
                
            }
        }
    }



    function endScreen(){
        $("#gameover").show();
        calcprogres(117);
        $("#yourscore").empty().append("Your score: " + turnedOff);
        $("#yourscore2").empty().append(turnedOff);
        $("#start").click(startgame);
        $("#twitter-button").attr('href','https://twitter.com/intent/tweet?url=' +  encodeURIComponent(linkUrl) + 
                                     '&text=' + encodeAndSubstitute(twitterMsg,turnedOff) + 
                                     '&original_referer=' + encodeURIComponent(originalUrl) + 
                                     '&via=wwf_uk');
        $('#facebook-button').attr('href','https://www.facebook.com/sharer/sharer.php?u=' + linkUrl);

    }

    function startgame() { 
	    	squares = getSquares('square');
            level = 0;
            levels = arrCopy(resetLevels);
            numberOn = 0;
            turnedOff = 0;
            period = 3000;
            numbertoOn = 1;
            i=1;
            gameOn = 1;

            $("#instructions").hide();
            $("#start").unbind('click',startgame);

            $("#score").empty().append(turnedOff);
            $('#clickspace').click(handleClick);
            $('#clickspace').bind('touchstart',handleTouch);

            $("#gameover").hide();

        
            calcprogres(0);
            $(".square").each(function(){
                $(this).attr("id",i);
                $(this).removeClass("on");
                i++;
            });
        
            runscript();
        
    }
    
    function encodeAndSubstitute(msg,score){
        msg = msg.replace('{{SCORE}}',score);
        msg = encodeURIComponent(msg);
        return msg;
    }

    function calcprogres(no){
        var rounded = Math.floor( (no/totalSquares)*100);
        $("#progressbar").width(rounded+"%");
    }

})(jQuery); 

});


