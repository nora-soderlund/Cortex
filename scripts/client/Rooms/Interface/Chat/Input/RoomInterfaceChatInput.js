RoomInterface.chat.input = new function() {
    this.$element = $('<div class="room-interface-chat-input"></div>').appendTo(RoomInterface.$element);

    this.$input = $('<input type="text" placeholder="Click here to chat...">').appendTo(this.$element);

    this.$input.on("keyup", function(event) {
        if(event.key != "Enter")
            return;

        if($(this).val().length == 0)
            return;

        SocketMessages.send({
            OnRoomUserChat: $(this).val()
        });

        $(this).val("");
    });
};
