Client.rooms.items.sprite = function(parent, image) {
    this.parent = parent;

    this.image = image;

    this.composite = "source-over";

    this.render = function(context, room) {
        context.globalAlpha = this.getAlpha();

        context.globalCompositeOperation = this.composite;

        const offset = this.getOffset();

        context.drawImage(this.image, Math.floor(room[0] + offset[0]), Math.floor(room[1] + offset[1]));
    };

    this.offset = [ 0, 0 ];

    this.setOffset = function(left, top) {
        this.offset = [ left, top ];
    };

    this.getOffset = function() {
        const parentOffset = this.parent.getOffset();

        return [
            this.offset[0] + parentOffset[0],
            this.offset[1] + parentOffset[1]
        ];
    };

    this.index = 0;

    this.getIndex = function() {
        return this.parent.index + this.index;
    };

    this.alpha = 1.0;

    this.getAlpha = function() {
        return 1.0 - ((1.0 - this.alpha) + (1.0 - this.parent.alpha));
    };

    this.mouseover = function(position) {
        return false;
    };

    this.mouseclick = function(event) {

    };

    this.mousedown = function(event) {

    };

    this.mousedoubleclick = function(event) {

    };

    return this;
};
