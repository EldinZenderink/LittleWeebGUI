import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NiblService} from '../../services/nibl.service'
import {ShareService} from '../../services/share.service'
import {UtilityService} from '../../services/utility.service'
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Component({
    selector: 'search',
    template: `
        <div class="row" style="width: 100%;">
            <div class="ui horizontal divider">SEARCH</div>
            <div class="ui icon input"  style="width: 100%;">
                <input #searchInput (keyup.enter)="search(searchInput.value)" class="prompt" type="text" placeholder="Search Anime">
                <i class="search icon"></i>
            </div>
        </div>
        <div *ngIf="showPacks">        
            <packlist></packlist>
        </div>
    `,
})
export class Search {
    
    showPacks : boolean;

    constructor(private niblService : NiblService, private shareService : ShareService){
        this.showPacks = false;
    }

    search(value:string){
        console.log("searching for: " + value)
        this.niblService.getSearchAnimeResults(value).subscribe(json => {
            console.log(json);
            var animePacks = [{number : "", botId : "", name : ""}];
            for(let pack of json){
                animePacks.push({number : pack.number, botId : pack.botId, name : pack.name});
            }
            animePacks.splice(0, 1);
            this.shareService.setPackList(animePacks);
            this.showPacks = true;
        });
    }
}