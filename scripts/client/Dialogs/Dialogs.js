class Dialogs {
    static $element = $('<div id="dialogs"></div>').appendTo(Client.$element);

    static entities = [];

    static sort() {
        Dialogs.entities.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });

        for(let index in Dialogs.entities)
            Dialogs.entities[index].$element?.css("z-index", 1 + index);
    };

    static add(entity) {
        Dialogs.entities.push(entity);

        entity.events.show.push(function() {
            entity.timestamp = performance.now();

            Dialogs.sort();
        });
    };
};

$(window).on("keyup", function(event) {
    if(event.code != "Escape")
        return;

    let current = -1;

    for(let index = Dialogs.entities.length - 1; index != -1; index--) {
        if(!Dialogs.entities[index].active)
            continue;

        current = index;

        break;
    }

    if(current == -1)
        return;

    Dialogs.entities[current].hide();

    for(let index = current - 1; index != -1; index--) {
        if(!Dialogs.entities[index].active)
            continue;

        Dialogs.entities[index].show();

        break;
    }
});
