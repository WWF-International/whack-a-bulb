$(document).ready(function() { 

/*global $:false, jQuery:false */
//"use strict";
(function($){   
    var numberon = 0,
        turnedoff = 0,
        frequency = 3000,
        numbertoon = 1,
        i=1,
        timeout,
        totalsquares = 116;
    
      
    $('#clickspace').click(function(e) {
        var posX = $(this).offset().left, posY = $(this).offset().top;
        $(".square").each(function(){
            squarepos = $(this).position();
            widthmin = squarepos.left;
            widthmax = squarepos.left + $(this).width();
            heightmin = squarepos.top;
            heightmax = squarepos.top + $(this).height();
            
            if( (e.pageX - posX) >= widthmin && (e.pageX - posX) <= widthmax && (e.pageY - posY) >= heightmin && (e.pageY - posY) <= heightmax ){
                //console.log("hit");
                if( $(this).hasClass("on") ){
                    $(this).removeClass("on");
                    numberon--;
                    turnedoff++;
                    $("#score").empty().append(turnedoff);
                    //console.log(numberon);
                } else {
                    turnedoff-=3;
                    $("#score").empty().append(turnedoff);
                    $(this).addClass("on");
                    numberon++;
                }
                calcprogres(numberon);
            }
        });
    });
    
    
    /*$(".square").click(function(){
        if( $(this).hasClass("on") ){
            $(this).removeClass("on");
            numberon--;
            turnedoff++;
            $("#score").empty().append(turnedoff);
            //console.log(numberon);
        } else {
            turnedoff-=3;
            $("#score").empty().append(turnedoff);
            $(this).addClass("on");
            numberon++;
        }
        calcprogres(numberon);
        
    });*/
    
    $("#start").click(function(){ startgame(); });
    
    function turnon(howmany){
        i=0;
        while(i<howmany){
            var whichone = Math.floor((Math.random() * totalsquares) + 1);
            if( $("#" + whichone).hasClass("on") ){} else{
                $("#" + whichone).addClass('on');
                numberon++;
                i++;
            }
        }
        calcprogres(numberon);
    }
    
    function runscript(){
        turnon( Math.floor(numbertoon) );
        if(numbertoon < 11){ numbertoon += 0.55;}
        //console.log(numberon);
        if( numberon < totalsquares-8 ){
            //console.log("bing");
            frequency -= 500;
            timeout = setTimeout(runscript,frequency);
        } else {
            finishgame();
        }
    }
    
    function finishgame(){
        clearTimeout(timeout);
        $("#gameover").show();
        calcprogres(117);
        $("#yourscore").empty().append("Your score: " + turnedoff);
        $("#yourscore2").empty().append(turnedoff);
    }
    
    function startgame() { 
        
            $("#gameover").hide();
        
            numberon = 0;
            turnedoff = 0;
            frequency = 3000;
            numbertoon = 1;
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
        rounded = Math.floor( (no/totalsquares)*100);
        //console.log(rounded);
        $("#progressbar").width(rounded+"%");
    }

})(jQuery); 

});


