Client.rooms.items.sprite = function(parent, image) {
    this.parent = parent;

    this.image = image;

    this.render = function(context, offset) {
        const parentOffset = this.parent.getOffset();

        context.globalAlpha = this.getAlpha();

        context.drawImage(this.image, Math.floor(offset[0] + this.offset[0] + parentOffset[0]), Math.floor(offset[1] + this.offset[1] + parentOffset[1]));
    };

    this.offset = [ 0, 0 ];

    this.setOffset = function(left, top) {
        this.offset = [ left, top ];
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

    return this;
};
