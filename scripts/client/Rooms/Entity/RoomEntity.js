class Room extends Events {
    //#region

    entity = null;

    entities = [];

    addEntity(entity) {
        if(this.entities.includes(entity)) {
            const previous = this.entities.indexOf(entity);

            Client.trace(this, "Entity %o is being added but it already exists as index %i!", entity, previous);
        }

        this.entities.push(entity);

        return entity;
    };

    getEntity(position, type) {
        if(position == null)
            return null;

        const offset = {
            left:   position.left - this.offset.left - this.margin.left,
            top:    position.top - this.offset.top - this.margin.top
        };

        // TODO: change to class name using Object.constructor.name
        const sprites = (type == null)?(this.sprites):(this.sprites.filter(x => x.parent.name == type));

        for(let index = sprites.length - 1; index != -1; index--) {
            const sprite = sprites[index];

            if(!sprite.mouseover(offset))
                continue;

            return {
                sprite,
                
                entity: sprite.parent
            };
        }

        return null;
    };

    removeEntity(entity) {
        if(!this.entities.includes(entity)) {
            Client.trace(this, "Entity %o does not exist in this room entity and cannot be removed!", entity);
        
            return false;
        }

        const index = this.entities.indexOf(entity);

        this.entities.splice(index, 1);

        return true;
    };

    //#endregion

    //#region 

    offset = { left: 0, top: 0 };
    margin = { left: 0, top: 0 };
    
    //#endregion

    constructor(parent) {
        super();

        this.canvas = Canvas.create({
            parent,

            events: this
        });

        this.on("render", () => this.render);
    };

    render(timestamp, frame) {
        const context = this.canvas.element.getContext("2d");

        context.save();
        
        context.fillStyle = this.background;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.restore();

        for(let index = 0; index < this.entities.length; index++)
            this.entities[index].call("process", timestamp, frame);

        let sprites = [];

        for(let index = 0; index < this.entities.length; index++) {
            if(!this.entities[index].enabled)
                continue;

            sprites = sprites.concat(this.entities[index].sprites);
        }

        sprites.sort((a, b) => a.getIndex() - b.getIndex());

        const offset = {
            left:   this.margin.left    + this.offset.left,
            top:    this.margin.top     + this.offset.top
        };
        
        for(let index = 0; index < sprites.length; index++) {
            context.save();

            //sprites[index].call("render", context, offset);
        
            context.restore();
        }

        return { median, milliseconds, frames: this.frameRates.length };
    };
};
