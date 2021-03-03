Client.socket.network = new function() {
    this.sent = 0;
    this.received = 0;

    Client.socket.messages.block("OnSocketPing");

    setInterval(async function() {
        if(Client.socket.server == undefined)
            return;

        if(Client.socket.server.readyState != 1)
            return;

        const time = Date.now();

        const tick = performance.now();

        const received = Client.socket.network.received;

        const result = await Client.socket.messages.sendCall({
            OnSocketPing: null
        }, "OnSocketPing");

        const sent = Client.socket.network.sent;

        //console.log("[%cSocketNetwork%c]%c Communicated ping " + (Math.round((performance.now() - tick) *  100) / 100) + "ms (to " + Math.round(result.time - time) + "ms, from " + Math.round(Date.now() - result.time) + "ms); sent " + sent + "/" + result.received + "; received " + received + "/" + result.sent, "color: orange", "color: inherit", "color: lightblue");
    
        Client.development.$network.text("Ping " + (Math.round((performance.now() - tick) *  100) / 100) + "ms");
    }, 1000);

    Client.socket.messages.block("OnSocketUpdate");

    Client.socket.messages.register("OnSocketUpdate", function(data) {
        Client.development.$uptime.html("Uptime: " + data.uptime + "");
        Client.development.$players.html("(" + data.users + " users)");
    });
};
