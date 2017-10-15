import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NiblService} from '../../services/nibl.service'
import {ShareService} from '../../services/share.service'
import {UtilityService} from '../../services/utility.service'
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
declare var $:any;

@Component({
    selector: 'botlist',
    template: `
        <div class="ui top attached two item menu">
            <a class="item" (click)="showBots = true; showBot = false;">BOTS</a>
            <a class="item" (click)="showBots = false; showBot = true;">{{botName}}</a>
        </div>
        <div *ngIf="showBots">
            <div class="step" [class.show]="botlistLoading" *ngIf="botlistLoading">
                <div class="ui horizontal divider"> Bot List </div>
                <div class="row">
                    <div class="ui items" id="botlistDiv" *ngFor="let bot of botlist">
                        <div (click)="showPackListFor(bot)" class="item">
                            <div class="middle aligned content">
                                <a class="header">{{bot.name}}</a>
                            </div>
                        </div> 
                        <div class="ui divider"> </div>
                    </div>
                </div>
            </div>
        </div>
        <div *ngIf="showBot">
            <packlist></packlist>
        </div>
    `,
})
export class BotList {
    botlistLoading : boolean;
    botName : string;
    botlist : any[];
    showBots : boolean;
    showBot : boolean;
    constructor(private niblService : NiblService, private shareService : ShareService){
        niblService.getBotList().subscribe(json => {
            this.botlist = json;
            this.botlistLoading = true;
        });
        this.showBot = false;
        this.showBots = true;
    }

    ngOnInit(){
    }

    ngOnDestroy(){
        this.shareService.clearPackList();
    }

    showPackListFor(bot : any){
        this.botName = bot.name;
        this.niblService.getPacksForBot(bot.id).subscribe(json => {
            console.log(json);
            var animePacks = [{number : "", botId : "", name : ""}];
            for(let pack of json){
                animePacks.push({number : pack.number, botId : pack.botId, name : pack.name});
            }
            animePacks.splice(0, 1);
            this.shareService.setPackList(animePacks);
            this.showBot =  true;
            this.showBots = false;
        });
    }
}