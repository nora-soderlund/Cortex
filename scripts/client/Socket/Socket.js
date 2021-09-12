class Socket {
    static connected = false;

    static sent = 0;
    static received = 0;

    static open = function(url = "ws" + ((Loader.settings.socket.ssl)?("s"):("")) + "://" + Loader.settings.socket.address + ":" + Loader.settings.socket.port + "/" + key) {
        return new Promise(function(resolve, failure) {
            console.log("[%cSocket%c]%c Connecting to the server at " + url + "...", "color: orange", "color: inherit", "color: lightblue");

            const timestamp = performance.now();

            const server = new WebSocket(url);

            server.onopen = function() {
                Socket.connected = true;

                console.log("[%cSocket%c]%c Connected to the server after " + Math.floor(performance.now() - timestamp) + "ms!", "color: orange", "color: inherit", "color: lightblue");

                server.onopen = function() {
                    
                };

                server.onclose = function() {
                    if(!Socket.connected)
                        return;

                    Socket.connected = false;

                    Loader.setError("Lost connection with the server...");

                    Loader.show();
                };

                SocketMessages.block("OnSocketPing");
            

                setInterval(async function() {
                    const time = Date.now();
            
                    const tick = performance.now();
            
                    const received = Socket.received;
            
                    const result = await SocketMessages.sendCall({
                        OnSocketPing: null
                    }, "OnSocketPing");
            
                    const sent = Socket.sent;
            
                    //console.log("[%cSocketNetwork%c]%c Communicated ping " + (Math.round((performance.now() - tick) *  100) / 100) + "ms (to " + Math.round(result.time - time) + "ms, from " + Math.round(Date.now() - result.time) + "ms); sent " + sent + "/" + result.received + "; received " + received + "/" + result.sent, "color: orange", "color: inherit", "color: lightblue");
                
                    ClientDevelopment.ping.innerText = (Math.round((performance.now() - tick) *  100) / 100);
                }, 1000);

                SocketMessages.block("OnSocketUpdate");
            
                SocketMessages.register("OnSocketUpdate", function(data) {
                    //Client.development.$uptime.html("Uptime: " + data.uptime + "");
                    ClientDevelopment.online.innerText = (data.users);
                });

                resolve(server);
            };

            server.onmessage = function(data) {
                Socket.received++;
                
                const message = JSON.parse(data.data);

                for(let key in message)
                    SocketMessages.call(key, message[key]);
            };

            server.onclose = function() {
                console.log("[%cSocket%c]%c Failed to connect to the server after " + Math.floor(performance.now() - timestamp) + "ms!", "color: orange", "color: inherit", "color: lightblue");

                failure(server);
            };
        });
    };
};
