Client.socket = new function() {
    this.open = function(url = "ws://127.0.0.1:81/local:cake") {
        return new Promise(function(resolve, failure) {
            Client.utils.log("Socket", "Connecting to the server at " + url + "...");

            const timestamp = performance.now();

            const server = new WebSocket(url);

            server.onopen = function() {
                Client.utils.log("Socket", "Connected to the server after " + Math.floor(performance.now() - timestamp) + "ms!");

                server.onopen = function() {

                };

                server.onclose = function() {
                    Client.loader.setError("Lost connection with the server...");

                    Client.loader.show();
                };

                resolve(server);
            };

            server.onmessage = function(data) {
                const message = JSON.parse(data.data);

                for(let key in message)
                    Client.socket.messages.call(key, message[key]);
            };

            server.onclose = function() {
                Client.utils.error("Socket", "Failed to connect to the server after " + Math.floor(performance.now() - timestamp) + "ms!");

                failure(server);
            };
        });
    };
};
