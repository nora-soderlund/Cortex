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

        this.size = {
            width: ((settings.size != undefined)?(settings.size.width || "auto"):("auto")),
            height: ((settings.size != undefined)?(settings.size.height || "auto"):("auto"))
        };
        
        this.offset = settings.offset || { type: "center", left: 0, top: 0 };

        this.title = settings.title || "Loading...";

        this.resizable = settings.resizable || false;

        Dialogs.add(this);
    };
    
    create() {
        console.log("create");

        if(this.created)
            return;

        this.created = true;

        this.element = document.createElement("div");
        this.element.classList.add("dialog-default");
        this.element.innerHTML = `
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
        `;
        this.element.style.position = "absolute";
        this.element.addEventListener("mousedown", (event) => {
            this.timestamp = performance.now();

            Dialogs.sort();
        });
        this.element.querySelector(".dialog-default-header-close").addEventListener("click", (event) => this.destroy());

        const header = this.element.querySelector(".dialog-default-header");

        {
            header.addEventListener("mousedown", (event) => {
                event = event || window.event;
                event.preventDefault();
                
                let clientX = event.clientX;
                let clientY = event.clientY;

                function mousemove(event) {
                    event = event || window.event;
                    event.preventDefault();
                    
                    let offsetX = clientX - event.clientX;
                    let offsetY = clientY - event.clientY;

                    clientX = event.clientX;
                    clientY = event.clientY;
                    
                    header.parentElement.style.top = (header.parentElement.offsetTop - offsetY) + "px";
                    header.parentElement.style.left = (header.parentElement.offsetLeft - offsetX) + "px";
                };
    
                function mouseup() {
                    document.removeEventListener("mouseup", mouseup);
                    document.removeEventListener("mousemove", mousemove);
                };

                document.addEventListener("mouseup", mouseup);
                document.addEventListener("mousemove", mousemove);
            });
        }

        Dialogs.element.appendChild(this.element);
        
        /*.draggable({
        //    handle: ".dialog-default-header"
        //}).css("position", "absolute").on("mousedown", event => {
            this.timestamp = performance.now();

            Dialogs.sort();
        }).on("click", ".dialog-default-header-close", event => this.destroy()).appendTo(Dialogs.$element);*/;


        this.container = this.element.querySelector(".dialog-default-container");
        this.content = this.element.querySelector(".dialog-default-content");
        this.overlay = this.element.querySelector(".dialog-default-overlay");

        this.setTitle(this.title);
        this.setSize(this.size.width, this.size.height);
        this.setOffset(this.offset.type, this.offset.left, this.offset.top);
        this.setResizable(this.resizable);

        for(let index in this.events.create)
            this.events.create[index]();
    };

    show() {
        console.log("show");
        this.create();

        this.active = true;

        console.log(this.events.show.length);

        for(let index = 0; index < this.events.show.length; index++) {
            console.log("call " + index);

            this.events.show[index]();
        }

        this.element.style.display = "block";
    };

    hide() {
        if(!this.active)
            return;

        this.active = false;
        
        for(let index in this.events.hide)
            this.events.hide[index]();

        this.element.style.display = "none";
    };

    toggle() {
        return (!this.active)?(this.show()):(this.hide());
    };

    destroy() {
        this.hide();

        if(!this.created)
            return;

        this.created = false;

        this.element.remove();

        delete this.element;
        
        for(let index in this.events.destroy)
            this.events.destroy[index]();
    };

    pause() {
        if(!this.created)
            return;

        this.overlay.style.display = "block";

        this.element.querySelector(".dialog-default-header-title").innerText = "Loading...";
    };

    unpause() {
        if(!this.created)
            return;

        this.overlay.style.display = "none";

        this.element.querySelector(".dialog-default-header-title").innerText = this.title;
    };

    setTitle(title) {
        this.title = title;

        this.element.querySelector(".dialog-default-header-title").innerText = this.title;
    };

    setSize(width, height = width) {
        this.width = width;
        this.height = height;

        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
        this.container.style.minWidth = `${width}px`;
        this.container.style.minHeight = `${height}px`;
    };

    setOffset(type, left = 0, top = 0) {
        if(type == "center")
            return this.setOffset("absolute", (this.element.parentElement.width / 2) - (this.element.width / 2) + left, (this.element.parentElement.height / 2) - (this.element.height / 2) + top);
        
            this.element.style.left = left;
            this.element.style.top = top;
    };

    resizableMouseDown = false;
    resizableMousePosition = { left: null, top: null };
    resizableMousePositionStart = { left: null, top: null };
    resizableOnMouseMoveAlias = null;
    resizableOnMouseUpAlias = null;
    resizableOnMouseDownAlias = null;

    resizableOnMouseDown(event) {
        this.resizableMouseDown = true;

        this.resizableMousePositionStart = { left: event.clientX, top: event.clientY };
        this.resizableMousePosition = { left: event.clientX, top: event.clientY };

        this.resizableOnMouseMoveAlias = (event) => this.resizableOnMouseMove(event);
        this.resizableOnMouseUpAlias = (event) => this.resizableOnMouseUp(event);

        window.addEventListener("mousemove", this.resizableOnMouseMoveAlias);
        window.addEventListener("mouseup", this.resizableOnMouseUpAlias);
    };

    resizableOnMouseMove(event, width, height) {
        if(this.container.width > this.width || event.clientX >= this.resizableMousePositionStart.left)
            this.container.style.width = `${this.container.width + (event.clientX - this.resizableMousePosition.left)}px`;
            
        if(this.container.height > this.height || event.clientY >= this.resizableMousePositionStart.top)
            this.container.style.height = `${this.container.height + (event.clientY - this.resizableMousePosition.top)}px`;

            this.resizableMousePosition = { left: event.clientX, top: event.clientY };
    };

    resizableOnMouseUp(event) {
        this.resizableMouseDown = false;

        window.removeEventListener("mousemove", this.resizableOnMouseMoveAlias);
        window.removeEventListener("mouseup", this.resizableOnMouseUpAlias);
    };

    setResizable(enabled = true) {
        if(enabled && !this.resizable) {
            this.resizableElement = document.createElement("div");
            this.resizableElement.classList.add("dialog-default-resizable");
            this.element.appendChild(this.resizableElement);

            this.resizableOnMouseDownAlias = (event) => this.resizableOnMouseDown(event);

            this.resizableElement.addEventListener("mousedown", this.resizableOnMouseDownAlias);
        }
        else if(!enabled && this.resizable) {
            this.resizableElement.removeEventListener("mousedown", this.resizableOnMouseDownAlias);
            this.resizableElement.remove();

            window.removeEventListener("mousemove", this.resizableOnMouseMoveAlias);
            window.removeEventListener("mouseup", this.resizableOnMouseUpAlias);
        }
        
        this.resizable = enabled;
    };
};
