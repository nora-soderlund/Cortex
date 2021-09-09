RoomInterface.chat.history = new function() {
    this.$element = $(
        '<div class="room-interface-chat-history">' +
            '<div class="room-interface-chat-history-messages">' +
                '<div class="room-interface-chat-history-messages-content"></div>' +
            '</div>' +

            '<div class="room-interface-chat-history-handle">' +
                '<div class="room-interface-chat-history-button"></div>' +
            '</div>' +
        '</div>'
    ).appendTo(RoomInterface.$element);

    this.$messages = this.$element.find(".room-interface-chat-history-messages-content");

    this.$button = this.$element.find(".room-interface-chat-history-button");

    this.mouseDown = false;
    this.mousePosition = false;
    this.mouseMove = function(event) {
        if(!RoomInterface.chat.history.mouseDown)
            return;

        let height = (RoomInterface.chat.history.$element.height() + (event.clientY - RoomInterface.chat.history.mousePosition));

        if(height < 30 || height > $(window).height() / 2)
            return;

        if(height < 50 && (height < RoomInterface.chat.history.$element.height())) {
            height = 30;

            RoomInterface.chat.history.mouseDown = false;
    
            $(window).unbind("mouseup", RoomInterface.chat.history.mouseUp);
            $(window).unbind("mousemove", RoomInterface.chat.history.mouseMove);
        }

        RoomInterface.chat.history.$messages[0].scrollTop += (RoomInterface.chat.history.$element.height() - height);

        RoomInterface.chat.history.$element.css({
            "height": height + "px"
        });

        RoomInterface.chat.history.mousePosition = event.clientY;
    };
    this.mouseUp = function(event) {
        if(!RoomInterface.chat.history.mouseDown)
            return;

        RoomInterface.chat.history.mouseDown = false;

        $(window).unbind("mouseup", RoomInterface.chat.history.mouseUp);
        $(window).unbind("mousemove", RoomInterface.chat.history.mouseMove);
    };

    this.$button.on("mousedown", function(event) {
        RoomInterface.chat.history.mouseDown = true;

        RoomInterface.chat.history.mousePosition = event.clientY;

        $(window).bind("mouseup", RoomInterface.chat.history.mouseUp);
        $(window).bind("mousemove", RoomInterface.chat.history.mouseMove);
    });

    this.messages = [];

    this.addMessage = function(image, left) {
        const previousScroll = this.$messages[0].scrollTop;

        const $canvas = $('<canvas class="room-interface-chat-message" width="' + image.width + '" height="' + image.height + '"></canvas>').css("margin-left", RoomInterface.entity.offset[0] + left).appendTo(this.$messages);
        const context = $canvas[0].getContext("2d");

        context.drawImage(image, 0, 0);

        this.$messages[0].scrollTop += (this.$messages[0].scrollHeight - previousScroll);
        
        this.messages.push($canvas);
    };

    this.reset = function() {
        for(let index in this.messages)
            this.messages[index].remove();

        this.messages.length = 0;

        this.$element.css({ "height": "30px" });
    };
};

RoomInterface.events.stop.push(function() {
    RoomInterface.chat.history.reset();
});
