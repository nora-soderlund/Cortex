Client.furnitures.logic = function(logic) {
    this.data = logic;
    
    this.getDirection = function() {
        return this.getDirectionAngle(parseInt(this.data.model.directions.direction[0].id));
    };

    this.getDirectionAngle = function(angle) {
        return Math.round(angle / 45);
    };

    return this;
};
