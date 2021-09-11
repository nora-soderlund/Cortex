RoomInterface.chat.input = new function() {
    this.element = document.createElement("div");
    this.element.className = "room-interface-chat-input";
    this.element.innerHTML = `
        <input type="text" placeholder="Click here to chat...">
    `;
    RoomInterface.element.append(this.element);

    this.input = this.element.querySelector("input");

    this.input.addEventListener("keyup", (event) => {
        if(event.key != "Enter")
            return;

        if(this.input.value.length == 0)
            return;

        SocketMessages.send({
            OnRoomUserChat: this.input.value
        });

        this.input.value = "";
    });
};
