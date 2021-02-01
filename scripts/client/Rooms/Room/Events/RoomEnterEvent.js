Client.socket.messages.register("OnRoomEnter", function(data) {
    Client.room.load(data);
});
