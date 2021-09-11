const Dialogs = new function() {
    this.element = document.createElement("div");
    this.element.id = "dialogs";
    Client.element.appendChild(this.element);

    this.entities = [];

    this.sort = () => {
        this.entities.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });

        for(let index in this.entities) {
            if(this.entities[index].element == null)
                continue;

            this.entities[index].element.style.zIndex = (1 + index);
        }
    };

    this.add = (entity) => {
        this.entities.push(entity);

        entity.events.show.push(function() {
            entity.timestamp = performance.now();

            this.sort();
        });
    };
};

window.addEventListener("keyup", (event) => {
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
