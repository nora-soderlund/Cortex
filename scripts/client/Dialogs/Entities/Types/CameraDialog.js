class CameraDialog extends Dialog {
    create() {
        super.create();

        this.element.classList.add("dialog-camera");

        this.grid = document.createElement("div");
        this.grid.className = "dialog-camera-grid";
        this.content.appendChild(this.grid);
    };
};
