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

    $(window).on("keyup", function(event) {
        if(event.code != "Escape")
            return;

        let current = -1;

        for(let index = Client.dialogs.entities.length - 1; index != -1; index--) {
            if(!Client.dialogs.entities[index].active())
                continue;

            current = index;

            break;
        }

        if(current == -1)
            return;

        Client.dialogs.entities[current].hide();

        for(let index = current - 1; index != -1; index--) {
            if(!Client.dialogs.entities[index].active())
                continue;

            Client.dialogs.entities[index].show();

            break;
        }
    });
};
