window.onerror = async function(exception, file, line, column, error) {
    if(error == undefined)
        return;

    Client.loader.setError("Reporting the error to the server...");
    
    Client.loader.show();

    await Client.socket.messages.sendCall({
        OnUnhandledException: {
            file: file + ":" + line + "." + column,
            exception, stack: error.stack
        }
    }, "OnUnhandledException");

    debugger;

    Client.loader.hide();
};
