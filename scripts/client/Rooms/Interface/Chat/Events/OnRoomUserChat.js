Client.socket.messages.register("OnRoomUserChat", function(data) {
    const user = Client.rooms.interface.users[data.id];
                
    const center = Client.rooms.interface.entity.center;
    const position = Client.rooms.interface.entity.offset;
    const offset = user.getOffset();

    Client.rooms.interface.chat.addMessage("bot_a", "**" + user.data.name + ":** " + data.message, center + offset[0] + 64);
});
