$(document).ready(function(){
    var sock = {};
    try{
        sock = new WebSocket('ws://' + window.location.host + '/ws');
    }
    catch(err){
        sock = new WebSocket('wss://' + window.location.host + '/ws');
    }

    // show message in div#subscribe
    function showMessage(message) {
        var messageElem = $('#subscribe'),
            height = 0,
            date = new Date(),
            options = { hour12: false },
            htmlText = '[' + date.toLocaleTimeString('en-US', options) + '] ';

        try{
            var messageObj = JSON.parse(message);
            if (!!messageObj.user && !!messageObj.msg){
                htmlText = htmlText  +
                '<span class="user">' + messageObj.user + '</span>: ' + messageObj.msg + '\n';
            } else {
                htmlText = htmlText + message;
            }
        } catch (e){
            htmlText = htmlText + message;
        }
        messageElem.append($('<p>').html(htmlText));

        messageElem.find('p').each(function(i, value){
            height += parseInt($(this).height());
        });
        messageElem.animate({scrollTop: height});
    }

    function sendMessage(){
        var msg = $('#message');
        sock.send(msg.val());
        msg.val('').focus();
    }

    sock.onopen = function(){
        showMessage('Connection to server started');
    };

    // send message from form
    $('#submit').click(function() {
        sendMessage();
    });

    $('#message').keyup(function(e){
        if(e.keyCode == 13){
            sendMessage();
        }
    });

    // income message handler
    sock.onmessage = function(event) {
        showMessage(event.data);
    };

    $('#signout').click(function(){
        window.location.href = "signout";
    });

    sock.onclose = function(event){
        if(event.wasClean){
            showMessage('Clean connection end');
        }else{
            showMessage('Connection broken');
        }
    };

    sock.onerror = function(error){
        showMessage(error);
    };
});
