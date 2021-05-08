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

    #resizableMouseDown = false;
    #resizableMousePosition = { left: null, top: null };
    #resizableMousePositionStart = { left: null, top: null };
    #resizableOnMouseMoveAlias = null;
    #resizableOnMouseUpAlias = null;
    #resizableOnMouseDownAlias = null;

    #resizableOnMouseDown(event) {
        this.#resizableMouseDown = true;

        this.#resizableMousePositionStart = { left: event.clientX, top: event.clientY };
        this.#resizableMousePosition = { left: event.clientX, top: event.clientY };

        this.#resizableOnMouseMoveAlias = (event) => this.#resizableOnMouseMove(event);
        this.#resizableOnMouseUpAlias = (event) => this.#resizableOnMouseUp(event);

        $(window).bind("mousemove", this.#resizableOnMouseMoveAlias);
        $(window).bind("mouseup", this.#resizableOnMouseUpAlias);
    };

    #resizableOnMouseMove(event, width, height) {
        if(this.$container.width() > this.width || event.clientX >= this.#resizableMousePositionStart.left)
            this.$container.css({ "width": "+=" + (event.clientX - this.#resizableMousePosition.left) });
            
        if(this.$container.height() > this.height || event.clientY >= this.#resizableMousePositionStart.top)
            this.$container.css({ "height": "+=" + (event.clientY - this.#resizableMousePosition.top) });

            this.#resizableMousePosition = { left: event.clientX, top: event.clientY };
    };

    #resizableOnMouseUp(event) {
        this.#resizableMouseDown = false;

        $(window).unbind("mousemove", this.#resizableOnMouseMoveAlias);
        $(window).unbind("mouseup", this.#resizableOnMouseUpAlias);
    };

    setResizable(enabled = true) {
        if(enabled) {
            this.$resizable = $('<div class="dialog-default-resizable"></div>').appendTo(this.$element);

            this.#resizableOnMouseDownAlias = (event) => this.#resizableOnMouseDown(event);

            this.$resizable.bind("mousedown", this.#resizableOnMouseDownAlias);
        }
        else {
            this.$resizable?.unbind("mousedown", this.#resizableOnMouseDownAlias).remove();

            $(window).unbind("mousemove", this.#resizableOnMouseMoveAlias);
            $(window).unbind("mouseup", this.#resizableOnMouseUpAlias);
        }
        
        this.resizable = enabled;
    };
};
