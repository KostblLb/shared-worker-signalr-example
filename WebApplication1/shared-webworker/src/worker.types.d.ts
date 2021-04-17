export interface WorkerMessage {
  message: string;
  connectionId: string;
}

export as namespace AppWorker;
