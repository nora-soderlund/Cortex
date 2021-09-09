window.onerror = async function(exception, file, line, column, error) {
    if(error == undefined)
        return;

    Loader.setError("Reporting the error to the server...");
    
    Loader.show();

    await SocketMessages.sendCall({
        OnUnhandledException: {
            file: file + ":" + line + "." + column,
            exception, stack: error.stack
        }
    }, "OnUnhandledException");

    Loader.hide();
};
