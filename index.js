(function () {
    var Message;
    var username = "";
    while(username==="" || username===null || username===undefined){
        alert('Empiece registrando su nombre de usuario')
        username = prompt("Ingrese su nombre de usuario")
    }
    var socket = io("ws://127.0.0.1:3000");
    socket.on('chat message', function(msg){
        let message_side = msg.username === username ? 'right' : 'left';
        let message = new Message({
            text: msg.message,
            message_side: message_side,
            username: msg.username
        });
        let $messages = $('.messages');
        message.draw();
        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    })
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side, this.username=arg.username;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $message.find('.username').html(_this.username);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            socket.emit('chat message', {message: text, username: username});
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
    });
}.call(this));