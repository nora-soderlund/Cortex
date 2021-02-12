Client.dialogs.tabs = function(height) {
    this.$element = $(
        '<div class="dialog-tabs">' +
            '<div class="dialog-tabs-container" style="height: ' + height + 'px"></div>' +
        '</div>'
    );

    this.$header = $('<div class="dialog-tabs-header"></div>').prependTo(this.$element);

    this.$content = $('<div class="dialog-tabs-content"></div>').appendTo(this.$element.find(".dialog-tabs-container"));

    this.buttons = {};

    this.add = function(identifier, text, callback = undefined, disabled = false) {
        const $element = $('<div class="dialog-tabs-button">' + text + '</div>').appendTo(this.$header);

        if(disabled) {
            $element.css({
                "pointer-events": "none",
                "opacity": .5
            });
        }

        this.buttons[identifier] = { element: $element, callback: callback };

        const entity = this;

        $element.on("click", function() {
            entity.show(identifier);
        });
    };

    this.hide = function() {
        this.$header.find(".dialog-tabs-button[active]").removeAttr("active");
        
        this.$content.html("");
    };

    this.show = function(identifier) {
        this.hide();
            
        this.buttons[identifier].element.attr("active", "");

        if(this.buttons[identifier].callback != undefined)
            this.buttons[identifier].callback(this.$content);
        else
            this.$content.html(identifier);

        for(let index in this.callbacks)
            this.callbacks[index](identifier, this.$content);
    };

    this.callbacks = [];

    this.click = function(callback) {
        this.callbacks.push(callback);
    };
};
