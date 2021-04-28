class Dialog {
    constructor(settings = {}) {
        this.events = {
            show: [],
            hide: [],
    
            create: [],
            destroy: []
        };

        this.active = false;
        this.created = false;

        this.size = { width: settings.size.width || "auto", height: settings.size.height || "auto" };
        this.offset = settings.offset || { type: "center", left: 0, top: 0 };

        this.title = settings.title || "Loading...";

        this.resizable = settings.resizable || false;

        Client.dialogs.add(this);
    };
    
    create() {
        if(this.created)
            return;

        this.created = true;

        this.$element = $(`
            <div class="dialog-default">
                <div class="dialog-default-header">
                    <p class="dialog-default-header-title">Loading...</p>

                    <div class="dialog-default-header-buttons">
                        <div class="dialog-default-header-info"></div>
                        <div class="dialog-default-header-close"></div>
                    </div>
                </div>

                <div class="dialog-default-container">
                    <div class="dialog-default-content"></div>

                    <div class="dialog-default-overlay"></div>
                </div>  
            </div>
        `).draggable({
            handle: ".dialog-default-header"
        }).css("position", "absolute").on("mousedown", event => {
            this.timestamp = performance.now();

            Client.dialogs.sort();
        }).on("click", ".dialog-default-header-close", event => this.destroy()).appendTo(Client.dialogs.$element);

        this.$title = this.$element.find(".dialog-default-header-title");

        this.$container = this.$element.find(".dialog-default-container");
        this.$content = this.$element.find(".dialog-default-content");
        this.$overlay = this.$element.find(".dialog-default-overlay");

        this.setTitle(this.title);
        this.setSize(this.size.width, this.size.height);
        this.setOffset(this.offset.type, this.offset.left, this.offset.top);
        this.setResizable(this.resizable);

        for(let index in this.events.create)
            this.events.create[index]();
    };

    show() {
        this.create();

        this.active = true;

        for(let index in this.events.show)
            this.events.show[index]();

        this.$element.show();
    };

    hide() {
        if(!this.active)
            return;

        this.active = false;
        
        for(let index in this.events.hide)
            this.events.hide[index]();

        this.$element.hide();
    };

    toggle() {
        this.active = !this.active;

        return (this.active)?(this.show()):(this.hide());
    };

    destroy() {
        this.hide();

        if(!this.created)
            return;

        this.created = false;

        this.$element.remove();

        delete this.$element;
        
        for(let index in this.events.destroy)
            this.events.destroy[index]();
    };

    pause() {
        if(!this.created)
            return;

        this.$overlay.show();

        this.$title.text("Loading...");
    };

    unpause() {
        if(!this.created)
            return;

        this.$overlay.hide();

        this.$title.text(this.title);
    };

    setTitle(title) {
        this.title = title;

        this.$title.text(this.title);
    };

    setSize(width, height = width) {
        this.width = width;
        this.height = height;

        this.$container.css({
            "width": width,
            "height": height,
            
            "min-width": width,
            "min-height": height
        });
    };

    setOffset(type, left = 0, top = 0) {
        if(type == "center")
            return this.setOffset("absolute", (this.$element.parent().width() / 2) - (this.$element.width() / 2) + left, (this.$element.parent().height() / 2) - (this.$element.height() / 2) + top);
        
        this.$element.css({
            "left": left,
            "top": top
        });
    };

    setResizable(enabled = true) {
        this.resizable = enabled;

        if(this.resizable) {
            this.$resizable = $('<div class="dialog-default-resizable"></div>').appendTo(this.$element);

            let mouseDown = false, mousePosition = null, mousePositionStart = null;

            const minWidth = this.$container.width(), minHeight = this.$container.height();

            const mouseMove = function(event) {
                if(this.$container.width() > minWidth || event.clientX >= mousePositionStart.left)
                    this.$container.css({ "width": "+=" + (event.clientX - mousePosition.left) });
                    
                if(this.$container.height() > minHeight || event.clientY >= mousePositionStart.top)
                    this.$container.css({ "height": "+=" + (event.clientY - mousePosition.top) });

                mousePosition = { left: event.clientX, top: event.clientY };
            };

            const mouseUp = function(event) {
                mouseDown = false;

                $(window).unbind("mousemove", mouseMove);
                $(window).unbind("mouseup", mouseUp);
            };

            this.$resizable.on("mousedown", function(event) {
                mouseDown = true;

                mousePositionStart = { left: event.clientX, top: event.clientY };
                mousePosition = { left: event.clientX, top: event.clientY };

                $(window).bind("mousemove", mouseMove);
                $(window).bind("mouseup", mouseUp);
            });
        }
        else
            this.$resizable?.remove();
    };
};
