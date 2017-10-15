import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class ShareService {

    public packlistsub : Subject<string> = new BehaviorSubject<string>(null);
    public newdownload : Subject<string> = new BehaviorSubject<string>(null);
    public newdownloads : Subject<string> = new BehaviorSubject<string>(null);

    public newdownloadlist : any;

    constructor(){
        this.newdownloadlist = [];
    }

    setPackList(json : any){
        var jsoncombined = JSON.stringify(json);
        this.packlistsub.next(JSON.stringify(jsoncombined));
    }

    clearPackList(){
        this.packlistsub.next();
    }


    appendNewDownload(json : any){
        this.newdownload.next(JSON.stringify(json));
        this.newdownloadlist.push(json);
    }

    clearNewDownload(){
        this.newdownload.next();
    }

    appendNewDownloads(json : any){
        this.newdownloads.next(JSON.stringify(json));
        for(let dl of json){
            this.newdownloadlist.push(dl);
        }
    }

    clearNewDownloads(){
        this.newdownloads.next();
    }

    getAlreadyAddedDownloads(){
        return this.newdownloadlist;
    }

    removeFromAlreadyAddedDownloads(download : any){
        var index = this.newdownloadlist.indexOf(download);
        if(index > -1){
            this.newdownloadlist.splice(index, 1);
        }        
    }

    removeFromAlreadyAddedDownloadsWithIndex(index : any){
        if(index > -1){
            this.newdownloadlist.splice(index, 1);
        }        
    }

}