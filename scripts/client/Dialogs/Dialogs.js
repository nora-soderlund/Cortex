Client.dialogs = new function() {
    this.$element = $('<div id="dialogs"></div>').appendTo(Client.$element);

    this.entities = [];

    this.sort = function() {
        this.entities.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });

        for(let index in this.entities)
            this.entities[index].$element.css("z-index", 1 + index);
    };

    this.add = function(entity) {
        entity.$element.on("mousedown", function() {
            entity.timestamp = performance.now();

            Client.dialogs.sort();
        });

        entity.timestamp = performance.now();

        this.entities.push(entity);

        entity.events.show.push(function() {
            entity.timestamp = performance.now();

            Client.dialogs.sort();
        });
    };
};
