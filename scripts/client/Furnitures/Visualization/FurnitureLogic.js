Client.furnitures.logic = function(logic) {
    this.data = logic;

    if(this.data.model.directions.direction.length == undefined)
        this.data.model.directions.direction = [ this.data.model.directions.direction ];
    
    this.getDirection = function() {
        return this.getDirectionAngle(parseInt(this.data.model.directions.direction[0].id));
    };

    this.getDirectionAngle = function(angle) {
        return Math.round(angle / 45);
    };

    this.fixDirection = function(direction) {
        const data = this.data.model.directions.direction;

        for(let index in data) {
            if(this.getDirectionAngle(data[index].id) == direction)
                return direction;
        }

        return this.getDirection();
    };

    return this;
};
