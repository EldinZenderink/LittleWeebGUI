import {Component, OnInit, OnDestroy} from '@angular/core';
import {ShareService} from '../../services/share.service'
import {NiblService} from '../../services/nibl.service'
import {UtilityService} from '../../services/utility.service'
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
declare var $:any;
@Component({
    selector: 'packlist',
    template: `
                <div class="ui horizontal divider" id="animeTitle">Pack List</div>
                <div class="ui active centered inline inverted dimmer" style="display:none;" id="animeLoading" >
                <div class="ui text loader">Loading</div>
                </div>
                <div class="row">
                    <div class="ui selection dropdown" style="width: 10%;">
                        <input type="hidden" name="botanime"  style="width: 10%;">
                        <i class="dropdown icon"></i>
                        <div class="default text">All Bots</div>
                        <div class="menu botlist" style="min-width: 10%;" >  
                            <div class="item" (click)="showBot('all')" >All Bots</div>
                            <div class="item" *ngFor="let bot of botList"  (click)="showBot(bot.name)"  >{{bot.name}}</div>
                        </div>
                    </div>
                    <div class="ui selection dropdown" style="width: 10%;"  >
                        <input type="hidden" name="resolutionAnime"  style="width: 10%;">
                        <i class="dropdown icon"></i>
                        <div class="default text">All Resolutions</div>
                        <div class="menu" style="min-width: 10%;">                
                        <div class="item active" (click)="showResolution('all')">All Resolutions</div>
                        <div class="item" (click)="showResolution('480')" >480p</div>
                        <div class="item" (click)="showResolution('720')" >720p</div>
                        <div class="item" (click)="showResolution('1080')" >1080p</div>
                        </div>
                    </div>
                    </div>
                    <div class="divider ui"></div>
                    <div class="row">
                    <div class="row multipleselected" id="multipleselected" *ngIf="packsSelected">
                        <p>             
                        <button class="ui primary button" style="width: 100%" (click)="appendToDownloads()"> Append selected to download list. </button>
                        </p>
                        <br>
                    </div>
                    <div class="ui styled accordion" id="packs" style=" width: 100%; ">
                        <div *ngFor="let pages of packlistfinal; let a=index" >                                                                   
                            <ng-container *ngIf="page == a">
                                <div *ngFor="let p of pages; let i=index" >
                                    <ng-container *ngIf="p.name.indexOf(resolution) > -1 || showAllResolutions">
                                        <ng-container *ngIf="p.botId.indexOf(botname) > -1 || showAllBots"> 
                                            <div class="title">
                                                <i class="dropdown icon"></i>
                                                <div class="ui checkbox">
                                                    <input type="checkbox" class="' + key + '"  (click)="aCheckBoxChecked(p)">
                                                    <label>{{p.botId}} | {{p.name}}</label>
                                                </div>
                                            </div>
                                            <div class="content">
                                                <p class="transition hidden">
                                                    <button class="ui primary button" style="width: 100%" (click)="sendDownloadRequest(p)">
                                                        Download
                                                    </button>
                                                </p>
                                            </div>
                                        </ng-container>
                                    </ng-container>
                                </div>                            
                            </ng-container>
                        </div>
                    </div>
                    <div class="ui divider"> </div>                     
                    <div class="container" *ngFor="let p of packlistfinal; let i=index" >
                        <button class="ui primary button " style="float: left; width: 50px; margin-bottom: 3px;" (click)="setPage(i)">
                            {{i}}
                        </button>
                    </div>
                </div>
                <script>                 
                    $('.ui.accordion').accordion();
                    $('.ui.dropdown').dropdown();
                </script>
    `
})
export class PackList {

    packlistfinal : any[];
    botList : [{}];
    botname : string;
    resolution : string;
    showAllBots : boolean;
    showAllResolutions : boolean;
    botlistobserver : any;
    packlistobserver : any;
    itemsPerPage : number;
    page : number;
    selectedItems : any[];
    packsSelected :boolean;
    title : string;

    constructor(private shareService: ShareService, private niblService:NiblService, private utilityService: UtilityService){
        console.log("initianted pakclist");
        this.botname = "all";
        this.showAllBots = true;
        this.showAllResolutions = true;
        this.itemsPerPage = 100;
        this.page = 0;
        this.packlistfinal = [[{botId : "0", name: "0"}]];
        this.packsSelected = false;
        this.selectedItems = [];
        this.title = "";
    }

    ngOnInit(){

        this.botlistobserver = this.niblService.getBotList().subscribe((bots) => {
           this.packlistobserver = this.shareService.packlistsub.subscribe((packs) => {
                if(bots[0] !== undefined && packs !== undefined && packs !== null){
                    this.botList = bots;                    
                    var packsjson = JSON.parse(packs);                  
                    this.parsePacks(this.botList, packsjson);
                } 
            });
        });       

    }
    
    ngOnDestroyt(){
        console.log("packlist destroyed");
        this.packlistfinal = [{botId : "none", name : "none"}];
        this.shareService.clearPackList();
        this.botlistobserver.unsubscribe();
        this.packlistobserver.unsubscribe();
    }


    parsePacks(bots: any, packs: any){
        var pages = [];
        var stupidArray = [];
        var itemcounter = 0;
        var packsjson = JSON.parse(packs);
        console.log(packsjson);
        for(let bot of bots){
            for(let pack of packsjson){
                if (Object.is(bot.id, pack.botId)) {
                    pack.botId = bot.name;
                    stupidArray[stupidArray.length] = pack;
                    if(itemcounter >= (this.itemsPerPage - 1)){
                        itemcounter = 0;
                        pages[pages.length] = stupidArray;
                        stupidArray = [];
                    }
                    itemcounter++;
                }
                
            }    
        }
        if(pages.length == 0 && stupidArray.length > 0){
            pages[pages.length] = stupidArray;
            this.packlistfinal = pages;
        } else {
            console.log(pages);
            this.packlistfinal = pages;
        }
        $('.ui.accordion').accordion();
        $('.ui.dropdown').dropdown();

    }

    setPage(i:number){
        this.page = i;
    }

    showBot(bot: string){
        if(bot == "all"){
            //every filename has a dot for extension
            this.showAllBots = true;
            this.botname = ".";
        } else {
            this.showAllBots = false;
            this.botname = bot;
        }
    }

    showResolution(res: string){
        if(res == "all"){
            //every filename has a dot for extension
            this.showAllResolutions = true;
            this.resolution = ".";
        } else {
            this.showAllResolutions = false;
            this.resolution = res;
        }
    }

    aCheckBoxChecked(pack: Object){
        var checkIfExists = this.selectedItems.indexOf(pack);
        if(checkIfExists == -1){            
            this.selectedItems.push(pack);
            console.log("added pack: ");
            console.log(pack);
        } else {
            this.selectedItems.splice(checkIfExists, 1);            
            console.log("removed pack at index: ");
            console.log(checkIfExists);
            console.log(pack);
        }
        
        if(this.selectedItems.length > 0){
            this.packsSelected = true;
        } else {
            this.packsSelected = false;
        }
    }

    sendDownloadRequest(pack: any){
        var genid = this.utilityService.generateId(pack.botId, pack.number);
        var newObj = {id : genid, pack : pack.number, bot: pack.botId, filename: pack.name, status : "Waiting", progress : "0", speed : "0"};
        this.shareService.appendNewDownload(newObj);
    }

    appendToDownloads(){
        var listWithDownloads = [];

        for(let download of this.selectedItems){
            console.log(download);
            var genid = this.utilityService.generateId(download.botId, download.number);
            var newObj = {id : genid, pack : download.number, bot: download.botId, filename: download.name, status : "Waiting", progress : "0", speed : "0"};
            listWithDownloads.push(newObj);
        }

        this.shareService.appendNewDownloads(listWithDownloads);

    }
}
