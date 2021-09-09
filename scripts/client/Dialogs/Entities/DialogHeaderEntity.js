class DialogHeader {
    constructor(settings = {}) {
        this.element = document.createElement("div");
        this.element.className = "dialog-header";
        this.element.innerHTML = `
            <canvas class="dialog-header-image"></canvas>

            <div class="dialog-header-container">
                <div class="dialog-header-content">
                    <div class="dialog-header-icon"></div>
                    <div class="dialog-header-details">
                        <h1 class="dialog-header-title"></h1>
                        <p class="dialog-header-description"></p>
                    </div>
                </div>
            </div>
        `;

        this.image = this.element.querySelector(".dialog-header-image");

        this.content = this.element.querySelector(".dialog-header-container");

        this.set(settings);
    };

    setTitle(title) {
        this.content.querySelector(".dialog-header-title").innerHTML = title;
    };

    setDescription(description) {
        this.content.querySelector(".dialog-header-description").innerHTML = description;
    };

    getContext(context) {
        this.image.width = this.element.width;
        this.image.height = this.element.height;
        
        return this.image.getContext(context);
    };

    setIcon(element) {
        const icon = this.content.querySelector(".dialog-header-icon");
        icon.style.minWidth = "64px";
                
        icon.innerHTML = "";

        icon.appendChild(element);
    };

    set(settings) {
        if(settings.height != undefined)
            this.element.style.height = settings.height;
    };
};
