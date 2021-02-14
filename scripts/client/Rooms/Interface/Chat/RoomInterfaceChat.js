Client.rooms.interface.chat = new function() {
    this.$element = $('<div class="room-interface-chat"></div>').appendTo(Client.rooms.interface.$element);

    this.messages = [];

    this.interval = undefined;

    this.addMessage = async function(style, message, left = 0, color = undefined) {
        const $canvas = $('<canvas class="room-interface-chat-message"></canvas>');

        const sprite = (color == undefined)?(await Client.assets.getSprite("HabboRoomChat", "HabboRoomChat_" + style)):(await Client.assets.getSpriteColor("HabboRoomChat", "HabboRoomChat_" + style, color));

        const context = $canvas[0].getContext("2d");

        const assets = await Client.assets.getManifest("HabboRoomChat");

        const visualization = JSON.parse(JSON.stringify(assets.visualization["default"]));

        if(assets.visualization[style] != undefined) {
            for(let key in assets.visualization[style]) {
                visualization[key] = assets.visualization[style][key];
            }
        }

        context.font = "13px " + visualization.font;

        const messageWidth = context.measureText(message).width;

        context.canvas.width = sprite.width + messageWidth;
        context.canvas.height = sprite.height;

        context.font = "13px " + visualization.font;

        context.drawImage(sprite,
            0, 0,
            visualization.left, context.canvas.height,
            
            0, 0,   
            visualization.left, context.canvas.height);

        context.drawImage(sprite,
            visualization.left, visualization.top,
            visualization.width, context.canvas.height,
            
            visualization.left, visualization.top,
            messageWidth, context.canvas.height);

        context.drawImage(sprite,
            visualization.left + visualization.width, 0,
            visualization.left, context.canvas.height,
            
            visualization.left + messageWidth, 0,
            visualization.left, context.canvas.height);

        context.fillStyle = visualization.color;

        context.fillText(message, visualization.left, context.canvas.height - visualization.offset);
        
        const $element = this.$element;

        for(let index in this.messages) {
            this.messages[index].css({
                bottom: "+=40"
            });
        }

        $canvas.css({
            "left": left
        }).appendTo($element);
    
        this.messages.push($canvas);

        if(this.interval == undefined)
            this.interval = setInterval(this.updateMessages, 2000, this);
    };

    this.updateMessages = function(self) {
        if(self.messages.length == 0) {
            clearInterval(this.interval);

            this.interval = undefined;

            return;
        }

        for(let index in self.messages) {
            self.messages[index].animate({
                bottom: "+=40"
            }, 400, function() {
                if($(this).offset().top < 0) {
                    $(this).remove();

                    self.messages.splice(index, 1);
                }
            });
        }
    };
};
