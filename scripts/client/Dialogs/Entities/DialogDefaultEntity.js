Client.dialogs.default = function(settings = {}) {
    this.created = false;

    this.events = new function() {
        this.show = [];
        this.hide = [];

        this.create = [];
        this.destroy = [];
    };

    this.$element = $(
        '<div class="dialog-default">' +
            '<div class="dialog-default-header">' +
                '<p class="dialog-default-header-title">Loading...</p>' +

                '<div class="dialog-default-header-buttons">' +
                    '<div class="dialog-default-header-info"></div>' +
                    '<div class="dialog-default-header-close"></div>' +
                '</div>' +
            '</div>' +

            '<div class="dialog-default-container"></div>' +
        '</div>'
    ).appendTo(Client.$element);

    this.$content = $('<div class="dialog-default-content"></div>').appendTo(this.$element.find(".dialog-default-container"));
    
    this.$overlay = $('<div class="dialog-default-overlay"></div>').appendTo(this.$element.find(".dialog-default-container"));

    this.$element.draggable({
        handle: this.$element.find(".dialog-default-header")[0]
    });

    this.settings = {
        title: "Loading...",

        active: false
    };

    this.set = function(settings) {
        if(settings.size != undefined)
            this.setSize(settings.size.width, settings.size.height);
            
        if(settings.offset != undefined)
            this.setOffset(settings.offset.type, (settings.offset.left != undefined)?(settings.offset.left):(0), (settings.offset.top != undefined)?(settings.offset.top):(0));
            
        if(settings.title != undefined)
            this.setTitle(settings.title);

        for(let key in settings)
            this.settings[key] = settings[key];
    };

    this.setTitle = function(title) {
        this.$element.find(".dialog-default-header-title").html(title);
    };

    this.setSize = function(width, height) {
        this.$element.find(".dialog-default-container").css({
            "width": width,
            "height": height
        });
    };

    this.setOffset = function(type, left = 0, top = 0) {
        switch(type) {
            case "center": {
                this.setOffset("absolute", (this.$element.parent().width() / 2) - (this.$element.width() / 2) + left, (this.$element.parent().height() / 2) - (this.$element.height() / 2) + top);

                break;
            }
            
            case "absolute": {
                this.$element.css({
                    "left": left,
                    "top": top
                });

                break;
            }
        }
    };

    this.active = function() {
        return this.settings.active;
    };

    this.show = function() {
        this.settings.active = true;

        if(this.created == false) {
            this.created = true;

            for(let index in this.events.create)
                this.events.create[index]();
        }

        for(let index in this.events.show)
            this.events.show[index]();

        this.$element.show();
    };

    this.toggle = function() {
        this.settings.active = !this.settings.active;

        if(this.settings.active)
            this.show();
        else
            this.hide();
    };

    this.hide = function() {
        this.settings.active = false;
        
        for(let index in this.events.hide)
            this.events.hide[index]();

        this.$element.hide();
    };

    this.destroy = function() {
        this.settings.active = false;

        this.created = false;

        this.$content.html("");

        this.$element.hide();
        
        for(let index in this.events.destroy)
            this.events.destroy[index]();
    };

    this.pause = function() {
        this.$overlay.show();

        this.setTitle("Loading...");
    };

    this.unpause = function() {
        this.$overlay.hide();

        this.setTitle(this.settings.title);
    };

    this.timestamp = performance.now();

    this.set(settings);

    const entity = this;

    this.$element.find(".dialog-default-header-close").on("click", function() {
        entity.destroy();
    });

    Client.dialogs.add(this);
};
