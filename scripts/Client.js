const Client = new function() {
    this.$element = $("#client");

    this.warn = function(object, message, ...args) {
        console.warn(`[${object.constructor.name}]%c ${message}`, "color: lightblue", ...args);
    };

    this.trace = function(object, message, ...args) {
        console.trace(`[${object.constructor.name}]%c ${message}`, "color: lightblue", ...args);
    };
};
