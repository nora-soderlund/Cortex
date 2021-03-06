Client.socket.messages.register("OnRoomUserChat", function(data) {
    const user = Client.rooms.interface.users[data.id];

    Client.rooms.interface.chat.addMessage("hobba", user.data.name + ": " + data.message);
});
