RoomInterface.chat = new function() {
    this.element = document.createElement("div");
    this.element.className = "room-interface-chat";
    RoomInterface.element.append(this.element);

    this.interval = null;

    this.messages = [];

    this.startInterval = function() {
        if(this.interval != null)
            return;

        this.stopInterval();

        this.interval = setInterval(function() {
            RoomInterface.chat.updateMessages();
        }, 3 * 1000);
    };

    this.stopInterval = function() {
        if(this.interval != null)
            clearInterval(this.interval);

        this.interval = null;
    };

    this.clear = function() {
        for(let index in this.messages)
            this.messages[index].remove();

        this.messages.length = 0;
    };

    this.addMessage = async function(style, message, center = 0, color = undefined) {
        let sprite = await Assets.getSprite("HabboRoomChat", "HabboRoomChat_" + style);
        
        if(color != undefined)
            sprite = await Assets.getSpriteColor("HabboRoomChat", "HabboRoomChat_" + style, color);

        const canvas = document.createElement("canvas");
        canvas.className = "room-interface-chat-message";
        const context = canvas.getContext("2d");

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
            sprite.width - (visualization.left + visualization.width), context.canvas.height,
            
            visualization.left + messageWidth, 0,
            sprite.width - (visualization.left + visualization.width), context.canvas.height);
            

        let left = 0;
        
        
        context.fillStyle = visualization.color;

        for(let index in parts) {
            context.font = "13px " + visualization.font + " " + parts[index].type;
            
            context.fillText(parts[index].message, visualization.left + left, context.canvas.height - visualization.offset);

            left += parts[index].width;
        }

        canvas.style.left = `${(center - (context.canvas.width / 2))}px`;

        this.messages.push(canvas);

        //this.history.addMessage(context.canvas, center - (context.canvas.width / 2));

        this.element.append(canvas);

        this.updateMessages();

        this.startInterval();
    };

    this.updateMessages = function() {
        for(let index = 0; index < this.messages.length; index++) {
            const top = this.messages[index].offsetTop;
                
            if(top < 30) {
                this.messages[index].remove();

                this.messages.splice(index, 1);

                continue;    
            }

            this.messages[index].style.top = `${(top - 30)}px`;
        }

        if(this.messages.length == 0)
            this.stopInterval();
    };

    this.render = function() {        
        if(this.messages.length == 0)
            return;

        if(this.margin == RoomInterface.entity.offset[0])
            return;

        this.margin = RoomInterface.entity.offset[0];

        this.element.style.marginLeft = `${RoomInterface.entity.offset[0]}px`;
    };

    RoomInterface.entity.events.render.push(function() {
        RoomInterface.chat.render();
    });
};

Loader.addAsset(async function() {
    RoomInterface.chat.assets = await Assets.getManifest("HabboRoomChat");
});
