Client.socket = new function() {
    this.connected = false;

    this.open = function(url = "ws://" + Client.loader.settings.socket.address + ":" + Client.loader.settings.socket.port + "/" + key) {
        return new Promise(function(resolve, failure) {
            console.log("[%cSocket%c]%c Connecting to the server at " + url + "...", "color: orange", "color: inherit", "color: lightblue");

            const timestamp = performance.now();

            const server = new WebSocket(url);

            server.onopen = function() {
                Client.socket.connected = true;

                console.log("[%cSocket%c]%c Connected to the server after " + Math.floor(performance.now() - timestamp) + "ms!", "color: orange", "color: inherit", "color: lightblue");

                server.onopen = function() {

                };

                server.onclose = function() {
                    if(!Client.socket.connected)
                        return;

                    Client.socket.connected = false;

                    Client.loader.setError("Lost connection with the server...");

                    Client.loader.show();
                };

                resolve(server);
            };

            server.onmessage = function(data) {
                Client.socket.network.received++;
                
                const message = JSON.parse(data.data);

                for(let key in message)
                    Client.socket.messages.call(key, message[key]);
            };

            server.onclose = function() {
                console.log("[%cSocket%c]%c Failed to connect to the server after " + Math.floor(performance.now() - timestamp) + "ms!", "color: orange", "color: inherit", "color: lightblue");

                failure(server);
            };
        });
    };
};
