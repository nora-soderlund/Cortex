const Hotel = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.id = "hotel";

        Client.element.prepend(this.element);

        RoomInterface.events.start.push(() => this.hide());
        RoomInterface.events.stop.push(() => this.show());
    };

    show() {
        this.element.classList.add("active");
    };

    hide() {
        this.element.classList.remove("active");
    };
};
