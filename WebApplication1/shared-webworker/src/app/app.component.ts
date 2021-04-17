import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inputValue = '';
  worker: Worker;
  lastWorkerReceivedMessage$ = new BehaviorSubject<string>('');
  constructor() {
    if (!window.Worker) {
      console.log('no worker!');
    } else {
      this.worker = new Worker('worker.js');
    }
  }
  ngOnInit() {
    this.worker.addEventListener('message', (msg) => {
      console.log(msg.data);
      this.lastWorkerReceivedMessage$.next(
        JSON.stringify({ data: msg.data.message, id: msg.data.connectionId })
      );
    });
  }

  sendInput() {
    this.worker.postMessage(this.inputValue);
  }
}
