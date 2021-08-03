class RoomItemFurniture extends RoomItem {
    async constructorAsync(room, id, direction) {
        await super.constructorAsync(room, id, direction);

        const loading = Client.assets.getSpritesheet("HabboLoading").then((image) => {
            const sprite = new Client.rooms.items.sprite(this, image);
    
            sprite.setOffset(32, -32);
    
            this.sprites.push(sprite);
        });
        
        this.furniture = new Client.furnitures.entity({ id, direction });
    
        this.render = async function() {
            this.furniture.events.render.push((sprites) => {
                this.sprites.length = 0;
    
                for(let index in sprites) {
                    const layer = sprites[index];
    
                    const sprite = new Client.rooms.items.sprite(this, layer.sprite);
    
                    sprite.composite = layer.ink;
                    sprite.alpha = layer.alpha;
    
                    sprite.tag = layer.tag;
    
                    sprite.mouseover = function(position) {
                        if(layer.ignoreMouse == 1)
                            return false;
                            
                        const entityOffset = sprite.parent.getOffset();
                       
                        const offset = [
                            Math.floor(position[0] - (entityOffset[0] + sprite.offset[0])),
                            Math.floor(position[1] - (entityOffset[1] + sprite.offset[1]))
                        ];
    
                        if(offset[0] < 0 || offset[1] < 0)
                            return false;
    
                        if(offset[0] > layer.sprite.width || offset[1] > layer.sprite.height)
                            return false;
    
                        const pixel = ((offset[0] + offset[1] * layer.spriteData.width) * 4) + 3;
    
                        if(layer.spriteData.data[pixel] < 50)
                            return false;
    
                        return true;
                    };
    
                    sprite.mouseclick = function(event) {
                        if(Client.keys.down["ControlLeft"])
                            Client.rooms.interface.furniture.pickup.start(this);
                        else if(Client.keys.down["AltLeft"])
                            Client.rooms.interface.furniture.move.start(this);
                        else if(Client.keys.down["ShiftLeft"])
                            Client.rooms.interface.furniture.rotate.start(this);
                    };
    
                    sprite.mousedown = function(event) {
                        if(Client.keys.down["ControlLeft"])
                            Client.rooms.interface.furniture.pickup.start(this);
                    };
    
                    sprite.mousedoubleclick = function(event) {
                        Client.rooms.interface.furniture.use.start(this, sprite);
                    };
    
                    sprite.setOffset(64 - sprites[index].asset.x, 16 - sprites[index].asset.y);
    
                    //sprite.index = parseInt(sprites[index].index);
    
                    sprite.index = parseInt(sprites[index].z);
    
                    this.sprites.push(sprite);
                }
            
                if(this.video != undefined)
                    this.sprites.push(this.video);
            });
    
            await this.furniture.process();
            
            await this.furniture.render();
        };
    };

    process(timestamp, frame) {
        super.process(timestamp, frame);

        if(this.furniture.updateAnimations(timestamp))
            this.furniture.render();
    };
};
