Client.rooms.interface.chat = new function() {
    this.$element = $('<div class="room-interface-chat"></div>').appendTo(Client.rooms.interface.$element);

    this.interval = null;

    this.messages = [];

    this.startInterval = function() {
        this.stopInterval();

        Client.rooms.interface.chat.updateMessages();

        this.interval = setInterval(function() {
            Client.rooms.interface.chat.updateMessages();
        }, 3 * 1000);
    };

    this.stopInterval = function() {
        if(this.interval != null)
            clearInterval(this.interval);

        this.interval = null;
    };

    this.addMessage = async function(style, message, center = 0, color = undefined) {
        let sprite = await Client.assets.getSprite("HabboRoomChat", "HabboRoomChat_" + style);
        
        if(color != undefined)
            sprite = await Client.assets.getSpriteColor("HabboRoomChat", "HabboRoomChat_" + style, color);

        const $canvas = $('<canvas class="room-interface-chat-message"></canvas>');
        const context = $canvas[0].getContext("2d");

        const visualization = JSON.parse(JSON.stringify(this.assets.visualization["default"]));

        if(this.assets.visualization["HabboRoomChat_" + style] != undefined) {
            for(let key in this.assets.visualization["HabboRoomChat_" + style]) {
                visualization[key] = this.assets.visualization["HabboRoomChat_" + style][key];
            }
        }

        const parts = Client.utils.getStringMarkup(message);

        let messageWidth = 0;
        
        for(let index in parts) {
            context.font = "13px " + visualization.font + " " + parts[index].type;

            parts[index].width = context.measureText(parts[index].message).width;

            messageWidth += parts[index].width;
        }

        context.canvas.width = visualization.left + messageWidth + visualization.width;
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
            

        let left = 0;
        
        
        context.fillStyle = visualization.color;

        for(let index in parts) {
            context.font = "13px " + visualization.font + " " + parts[index].type;

            console.log(context.font);
            
            context.fillText(parts[index].message, visualization.left + left, context.canvas.height - visualization.offset);

            left += parts[index].width;
        }

        $canvas.css("left", center - (context.canvas.width / 2));

        this.messages.push($canvas);

        $canvas.appendTo(this.$element);

        this.startInterval();
    };

    this.updateMessages = function() {
        for(let index = 0; index < this.messages.length; index++) {
            const top = parseInt(this.messages[index].css("top"));
                
            if(top < 0) {
                this.messages[index].remove();

                this.messages.splice(index, 1);

                continue;    
            }

            this.messages[index].animate({
                "top": "-=30"
            }, 400);
        }

        if(this.messages.length == 0)
            this.stopInterval();
    };
};

Client.loader.addAsset(async function() {
    Client.rooms.interface.chat.assets = await Client.assets.getManifest("HabboRoomChat");
});
