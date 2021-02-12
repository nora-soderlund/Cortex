Client.furnitures.logic = function(logic) {
    this.data = logic;

    if(this.data.model.directions != undefined && this.data.model.directions.direction.length == undefined)
        this.data.model.directions.direction = [ this.data.model.directions.direction ];
    
    this.getDirection = function() {
        if(this.data.model.directions == undefined)
            return 0;

        return this.getDirectionAngle(parseInt(this.data.model.directions.direction[0].id));
    };

    this.getDirectionAngle = function(angle) {
        return Math.round(angle / 45);
    };

    this.fixDirection = function(direction) {
        if(this.data.model.directions == undefined)
            return 0;
            
        const data = this.data.model.directions.direction;

        for(let index in data) {
            if(this.getDirectionAngle(data[index].id) == direction)
                return direction;
        }

        return this.getDirection();
    };

    this.closestDirection = function(direction, step = 1) {
        const data = this.data.model.directions.direction;

        let next = false;

        for(let index in data) {
            const current = this.getDirectionAngle(data[index].id);

            if(next == true && step == 1) {
                return current;
            }

            if(current == direction && step == 1) {
                next = true;

                continue;
            }
        }

        return this.getDirection();
    };

    return this;
};
