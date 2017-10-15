import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NiblService} from '../../services/nibl.service'
import {ShareService} from '../../services/share.service'
import {UtilityService} from '../../services/utility.service'
import {BackEndService} from '../../services/backend.service'
import {Subject} from 'rxjs/Rx';
import {Pipe} from '@angular/core';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
declare var $:any;

@Component({
    selector: 'downloads',
    template: `
        <div class="ui horizontal divider"> DOWNLOAD QUE </div>
        <div class="row">
            <table class="ui very basic table" style="width: 100%; background-color: white;">
            <thead>
                <tr>
                <th style="width: 10%;">File</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 40%;">Progress</th>
                <th style="width: 40%;">Options</th>
                </tr>
            </thead>
            <tbody id="listWithDownloads">
                <tr *ngFor="let download of downloads">
                    <td id="filename_{{download.id}}">{{download.filename}}</td>
                    <td id="status_{{download.id}}">{{download.status}}</td>
                    <td>
                        <div class="ui progress" id="progress_{{download.id}}" [attr.data-percent]="download.progress" >
                            <div class="bar">
                                <div class="progress"></div>
                            </div>
                            <div class="label" id="speed_{{download.id}}">{{download.speed}}</div>
                        </div>
                    </td>
                    <td id="buttons_{{download.id}}">
                        <button (click)="sendPlayRequest(download)" class="ui primary button">Play</button>
                        <button (click)="sendOpenLocationRequest(download)"  class="ui primary button">Open Location</button>
                        <button (click)="sendAbortRequest(download)"  class="ui primary button">Abort</button>
                        <button (click)="sendDeleteRequest(download)"  class="ui primary button">Delete</button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div> 
        <div class="ui horizontal divider"> ALREADY DOWNLOADED </div>
        <div class="row">
            <table class="ui very basic table" style="width: 100%; background-color: white;">
            <thead>
                <tr>
                <th style="width: 10%;">File</th>
                <th style="width: 10%;">Status</th>
                <th style="width: 40%;">Progress</th>
                <th style="width: 40%;">Options</th>
                </tr>
            </thead>
            <tbody id="listWithDownloads">
                <tr *ngFor="let download of alreadyDownloaded">
                    <td id="filename_{{download.id}}">{{download.filename}}</td>
                    <td id="status_{{download.id}}">{{download.status}}</td>
                    <td>
                        <div class="ui progress" id="progress_{{download.id}}" [attr.data-percent]="download.progress" >
                            <div class="bar">
                                <div class="progress"></div>
                            </div>
                            <div class="label" id="speed_{{download.id}}">{{download.speed}}</div>
                        </div>
                    </td>
                    <td id="buttons_{{download.id}}">
                        <button (click)="sendPlayRequest(download)" class="ui primary button">Play</button>
                        <button (click)="sendOpenLocationRequest(download)"  class="ui primary button">Open Location</button>
                        <button (click)="sendAbortRequest(download)"  class="ui primary button">Abort</button>
                        <button (click)="sendDeleteRequest(download)"  class="ui primary button">Delete</button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    `,
})


export class Downloads {
    downloads : any[];
    alreadyDownloaded : any[];
    constructor(private shareService : ShareService, private backEndService : BackEndService){
        this.downloads = this.shareService.getAlreadyAddedDownloads();
        this.alreadyDownloaded = [];
        
    }

    ngOnInit(){
        //downloads object = {id : string, pack : string, bot : string, filename : string, status : string, progress : string, speed : string}
        
        this.backEndService.websocketConnected.subscribe(data => {            
            this.backEndService.sendMessage("GetAlreadyDownloadedFiles");
            console.log("websocket is running");
        });

        var alreadyAdded = this.shareService.getAlreadyAddedDownloads();
         for(let download of alreadyAdded){
             console.log(download);
           // this.downloads.push(download);
        }

        
        this.shareService.newdownload.subscribe((download) => {
            if(download !== null){
                var json = JSON.parse(download);
                //this.downloads.push(json);
                this.backEndService.sendMessage("AddToDownloads:" + json.id + ":" + json.pack + ":" + json.bot);
            }
        });

        this.shareService.newdownloads.subscribe((downloads) => {
            
            if(downloads !== null){
                var json = JSON.parse(downloads);
                var downloadRequest = "";

                for(let download of json){
                    downloadRequest = downloadRequest + "," + download.id + ":" + download.pack + ":" + download.bot;
                    //this.downloads.push(download);
                }
                
                this.backEndService.sendMessage("AddToDownloads:" + downloadRequest);

            }
        });


        this.backEndService.websocketMessages.subscribe((message) => {
            if(message !== null){
                console.log(message);
                if(message.indexOf("DOWNLOADUPDATE") > -1 && message.indexOf("NO DOWNLOAD") == -1){
                    var data = message.split(':');
                    var dataToUpdate = {
                        id: data[1],
                        progress: data[2],
                        speed: data[3],
                        status: data[4],
                        filename: data[5]
                    };
                    let obj = this.downloads.find(x => x.id === dataToUpdate.id);
                    let index = this.downloads.indexOf(obj);
                    if(index > -1){
                        this.downloads[index].progress = dataToUpdate.progress;
                        this.downloads[index].status = dataToUpdate.status;
                        this.downloads[index].speed = dataToUpdate.speed;
                        this.downloads[index].filename = dataToUpdate.filename;
                        $('#progress_' + dataToUpdate.id).progress({
                            percent: dataToUpdate.progress
                        });
                        if(message.indexOf("COMPLETED") > -1){
                            this.downloads.splice(index, 1); 
                            this.shareService.removeFromAlreadyAddedDownloadsWithIndex(index);    
                            this.backEndService.sendMessage("GetAlreadyDownloadedFiles");
                        }
                    } else {
                        this.downloads.push(dataToUpdate);
                    }

                    
                } 
                if (message.indexOf("ALREADYDOWNLOADED")> -1){
                    var objects = message.split(',');
                    console.log(objects);
                    for(let object of objects){
                        var data = object.split(':');
                        console.log(data);
                        if(data.length > 1){
                            var dataToUpdate = {
                                id: data[0],
                                progress: data[1],
                                speed: data[2],
                                status: data[3],
                                filename: data[4]
                            };
                            let obj = this.alreadyDownloaded.find(x => x.id === dataToUpdate.id);
                            let index = this.alreadyDownloaded.indexOf(obj);
                            if(index > -1){
                                this.alreadyDownloaded[index].progress = dataToUpdate.progress;
                                this.alreadyDownloaded[index].status = dataToUpdate.status;
                                this.alreadyDownloaded[index].speed = dataToUpdate.speed;
                                this.alreadyDownloaded[index].filename = dataToUpdate.filename;

                            } else {
                                this.alreadyDownloaded.push(dataToUpdate);        
                            }
                        }
                    }
                }
            }
        });
    }

    ngOnDestroy(){
        //this.shareService.newdownload.unsubscribe();
        //this.shareService.newdownloads.unsubscribe();
        //this.backEndService.websocketMessages.unsubscribe();
    }

    sendPlayRequest(download : any){
        this.backEndService.sendMessage("PlayFile:" + download.id + ":" + download.filename);
    }

    sendOpenLocationRequest(download : any){
        this.backEndService.sendMessage("OpenDirectory");
    }

    sendAbortRequest(download : any){
        this.backEndService.sendMessage("AbortDownload");
    }

    sendDeleteRequest(download : any){
        this.shareService.removeFromAlreadyAddedDownloads(download);
        this.downloads = this.shareService.getAlreadyAddedDownloads();
        this.backEndService.sendMessage("DeleteDownload:" + download.id + ":" + download.filename);
        this.backEndService.sendMessage("GetAlreadyDownloadedFiles");
    }
}