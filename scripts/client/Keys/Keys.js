Client.keys = new function() {
    this.down = {};

    $(window).on("keydown", function(event) {
        Client.keys.down[event.code] = performance.now();
    });

    $(window).on("keyup", function(event) {
        delete Client.keys.down[event.code];
    });

    $(window).on("blur", function() {
        for(let key in Client.keys.down)
            delete Client.keys.down[key];
    });
};
