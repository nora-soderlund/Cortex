Client.keys = new function() {
    this.down = {};

    $(window).on("keydown", function(event) {
        Client.keys.down[event.code] = performance.now();
    });

    $(window).on("keyup", function(event) {
        delete Client.keys.down[event.code];
    });
};
