import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NiblService} from '../../services/nibl.service'
import {ShareService} from '../../services/share.service'
import {UtilityService} from '../../services/utility.service'
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Component({
    selector: 'latestpack',
    template: `<packlist></packlist>`,
})
export class LatestPack {
    latestpackObservable : any;
    constructor(private niblService : NiblService, private shareService : ShareService){
       
    }

    ngOnInit(){
         this.latestpackObservable = this.niblService.getLatestPack().subscribe(json => {
            var animePacks = [{id : "", botId : "", name : ""}];
            for(let pack of json){
                animePacks.push({id : pack.number, botId : pack.botId, name : pack.name});
            }
            animePacks.splice(0, 1);
            this.shareService.setPackList(animePacks);
        });
        
        console.log("component loaded");

    }

    ngOnDestroy(){
        this.shareService.clearPackList();
        this.latestpackObservable.unsubscribe();
        console.log("component closed");
    }
}