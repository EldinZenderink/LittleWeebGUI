import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Injectable()
export class BackEndService {

    public websocketMessages : Subject<string> = new BehaviorSubject<string>(null);
    public websocketConnected : Subject<string> = new BehaviorSubject<string>(null);
    websocket : any;
    constructor(private http: Http){
        console.log("Initiated backend!");
        this.http.get('http://localhost:6010/whatsyourip').map(res => res.text()).subscribe((result) => {
            this.websocket = new WebSocket("ws://" + result + ":600");
            console.log(result);
            this.websocket.onopen = (evt : any) =>{
                this.websocketConnected.next(evt);
            };
            this.websocket.onmessage = (evt : any) => {
                this.websocketMessages.next(evt.data);
            };
        });
    }

    sendMessage(message :string){
        try{
            this.websocket.send(message);
        } catch(Ex){
            console.log("Cannot send message, websocket hasn't been opened yet: ");
            console.log(Ex);
        }
    }

}