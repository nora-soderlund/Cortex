class Keys {
    static down = {};
};

$(window).on("keydown", function(event) {
    Keys.down[event.code] = performance.now();
});

$(window).on("keyup", function(event) {
    delete Keys.down[event.code];
});

$(window).on("blur", function() {
    for(let key in Keys.down)
        delete Keys.down[key];
});
