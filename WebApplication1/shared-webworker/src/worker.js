/// <reference lib="webworker" />
/// <reference path="../node_modules/@microsoft/signalr/dist/esm/index.d.ts" />
/// <reference path="worker.types.d.ts" />

importScripts("signalr.js");

let connection = /** @type {signalR.HubConnection} */ new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:5001/chat")
  .build();

connection.on("receiveMessage", (data) => {
  console.log(data);
  postMessage(
    /** @type {AppWorker.WorkerMessage} */ ({
      message: data,
      connectionId: connection.connectionId,
    })
  );
});

connection
  .start()
  .then(() => connection.invoke("sendMessage", "Hello", "user"));

onmessage = function (e) {
  console.log("Message received from main script", e);
  console.log("Posting message back to main script");
  connection.invoke("sendMessage", e.data, "user");
};

onerror = function (e) {
  console.log("error!", e);
};
