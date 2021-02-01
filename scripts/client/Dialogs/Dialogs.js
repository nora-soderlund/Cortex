Client.dialogs = new function() {
    this.$element = $('<div id="dialogs"></div>').appendTo(Client.$element);

    this.entities = [];

    this.sort = function() {
        this.entities.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });

        for(let index in this.entities)
            this.entities[index].$element.css("z-index", index);
    };

    this.add = function(entity) {
        this.entities.push(entity);

        this.sort();
    };
};
