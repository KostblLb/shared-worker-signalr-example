import { Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inputValue = '';
  worker: SharedWorker;
  lastWorkerReceivedMessage$ = new BehaviorSubject<string>('');

  constructor(private zone: NgZone) {
    if (!window.SharedWorker) {
      console.log('no worker!');
    } else {
      this.worker = new SharedWorker('worker.js');
    }
  }
  ngOnInit() {
    this.worker.port.onmessage = (msg) =>
      this.zone.run(() => {
        console.log(msg.data);
        this.lastWorkerReceivedMessage$.next(
          JSON.stringify({
            data: msg.data.message,
            id: msg.data.connectionId,
          })
        );
      });
  }

  sendInput() {
    this.worker.port.postMessage(this.inputValue);
  }
}
