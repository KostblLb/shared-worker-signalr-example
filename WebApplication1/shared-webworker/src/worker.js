/// <reference lib="webworker" />
/// <reference path="../node_modules/@microsoft/signalr/dist/esm/index.d.ts" />
/// <reference path="worker.types.d.ts" />

importScripts("signalr.js");

let connection = /** @type {signalR.HubConnection} */ new signalR.HubConnectionBuilder()
  .withUrl(`${origin}/chat`)
  .build();

connection
  .start()
  .then(() => connection.invoke("sendMessage", "Hello", "user"));

onconnect = function (e) {
  var port = /** @type {MessagePort} */ (e.ports[0]);
  port.onmessage = function (e) {
    console.log("Message received from main script", e);
    connection.invoke("sendMessage", e.data, "user");
  };

  connection.on("receiveMessage", (data) => {
    console.log(data);
    port.postMessage(
      /** @type {AppWorker.WorkerMessage} */ ({
        message: data,
        connectionId: connection.connectionId,
      })
    );
  });
};
