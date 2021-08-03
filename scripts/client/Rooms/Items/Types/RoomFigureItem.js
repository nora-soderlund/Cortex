class RoomItemFigure extends RoomItem {
    async constructorAsync(room, figure, direction) {
        await super.constructorAsync(room, figure, direction);

        this.figure = new Client.figures.entity(figure, { direction });

        this.figure.events.render.push((sprites) => {
            this.sprites.length = 0;

            for(let index in sprites) {
                let sprite = new Client.rooms.items.sprite(this, sprites[index].image);

                if(sprites[index].imageData != undefined) {
                    sprite.mouseover = function(position) {
                        const entityOffset = sprite.parent.getOffset();
                    
                        const offset = [
                            Math.floor(position[0] - (entityOffset[0] + sprite.offset[0])),
                            Math.floor(position[1] - (entityOffset[1] + sprite.offset[1]))
                        ];

                        if(offset[0] < 0 || offset[1] < 0)
                            return false;

                        if(offset[0] > sprites[index].image.width || offset[1] > sprites[index].image.height)
                            return false;

                        const pixel = ((offset[0] + offset[1] * sprites[index].imageData.width) * 4) + 3;

                        if(sprites[index].imageData.data[pixel] < 50)
                            return false;

                        return true;
                    };
                }

                sprite.mouseclick = function(event) {
                    
                };

                sprite.setOffset(sprites[index].left - 64, sprites[index].top - (128 + 32) + 8);

                sprite.index = sprites[index].index;
                sprite.composite = (sprites[index].composite == undefined)?("source-over"):(sprites[index].composite);
                
                this.sprites.push(sprite);
            }
        });

        this.figure.process().then(() => {
            this.figure.render();
        });

        this.on("path start", async () => {
            if(!this.data.walk)
                return;
    
            await this.figure.setAction("Move");
    
            await this.figure.render();
        });
    
        this.on("path", async (frame) => {
            /*if(!entity.data.walk)
                return;
    
            newFrame = Math.floor(frame / 2);
    
            if(entity.figure.frames["Move"] != newFrame) {
                entity.figure.frames["Move"] = newFrame;
    
                await entity.figure.render();
            }*/
        });
    
        this.on("path finish", async () => {
            if(!this.data.walk)
                return;
                
            await this.figure.removeAction("Move");
    
            await this.figure.render();
        });
    };
    
    process(...args) {
        super.process(...ars);

        if(this.figure.updateActions())
            this.figure.render();
    };
};
