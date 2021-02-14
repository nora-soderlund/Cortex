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

        if(assets.visualization["HabboRoomChat_" + style] != undefined) {
            for(let key in assets.visualization["HabboRoomChat_" + style]) {
                visualization[key] = assets.visualization["HabboRoomChat_" + style][key];
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

        $canvas.css({
            "left": left
        }).appendTo($element);
    
        this.messages.push($canvas);

        this.updateMessages(this);
    };

    this.updateMessages = function(self) {
        if(self.interval != undefined) {
            clearInterval(self.interval);
            
            self.interval = undefined;
        }

        if(self.messages.length == 0)
            return;

        for(let index in self.messages) {
            const $this = self.messages[index];
            const thisIndex = index;

            self.messages[index].animate({
                bottom: "+=30"
            }, 400, function() {
                if($(this).offset().top < 0) {
                    $this.remove();

                    self.messages.splice(thisIndex, 1);
                }
            });
        }

        self.interval = setInterval(self.updateMessages, 2000, self);
    };
};
