import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NiblService} from '../../services/nibl.service'
import {ShareService} from '../../services/share.service'
import {UtilityService} from '../../services/utility.service'
import {BackEndService} from '../../services/backend.service'
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
declare var $:any;

@Component({
    selector: 'currentlyairing',
    template: `
        <div class="ui top attached two item menu">
            <a class="item" data-tab="first" (click)="showCurAir = true; showAnime = false;">Currently Airing</a>
            <a class="item" data-tab="second" (click)="showCurAir = false; showAnime = true;">{{animeTitle}}</a>
        </div>
        <div *ngIf="showCurAir">
            <div class="step" [class.show]="currentlyAiringLoading" *ngIf="currentlyAiringLoading">
                <div class="ui horizontal divider"> Currently Airing </div>
                <div class="row">
                    <div class="ui items" id="currentlyAiringAnimes" *ngFor="let anime of airingAnime">
                        <div (click)="showPackListFor(anime)" class="item" *ngIf="anime.airing_status == 'currently airing'">
                            <div class="ui tiny image"> 
                                <img src="{{anime.image_url_med}}" /> 
                            </div>
                            <div class="middle aligned content">
                                <a class="header">{{anime.title_english}}</a>
                            </div>
                        </div> 
                        <div class="ui divider" *ngIf="anime.airing_status == 'currently airing'"> </div>
                    </div>
                </div>
            </div>
        </div>
        <div *ngIf="showAnime">
            <packlist></packlist>
        </div>
    `
})
export class CurrentlyAiring {
    airingAnime : Object;
    currentlyAiringLoading : boolean;
    waitForDataInterval : any;
    animeTitle : string;
    showCurAir : boolean;
    showAnime : boolean;

    constructor(private niblService: NiblService, private shareService: ShareService, private utilityService: UtilityService, private backendService : BackEndService, private router: Router){
        this.currentlyAiringLoading = false;
        this.animeTitle = "Anime";
        this.showCurAir = true;
        this.showAnime = false;
        this.niblService.getCurrentlyAiringAnime().subscribe(json => {
            console.log(json);
            this.airingAnime = json.content; 
            this.currentlyAiringLoading = true;
        });
    }

    ngOnInit(){
        //semantic-ui code for enabeling tab menu...
        $('.menu .item').tab();
        $.tab('change tab', 'third');
    }

    ngOnDestroy(){
        this.shareService.clearPackList();
         $.tab('change tab', 'third');
    }

    showPackListFor(anime : any){
        
        var synonyms = [];
        if(anime.synonyms[0] != ""){
            synonyms = anime.synonyms;
        }
        synonyms.push(anime.title_english);
        synonyms.push(anime.title_romaji);
        this.animeTitle = anime.title_english;
        var animePacks = [{id : "", botId : "", name : ""}];
        for(let synonym of synonyms){
            synonym = this.utilityService.stripName(synonym);
            if(synonym.length > 0){
                this.niblService.getSearchAnimeResults(synonym).subscribe(json => {
                    console.log(synonym);
                    if(json.length > 0){
                        for(let pack of json){
                            if(this.utilityService.compareNames(synonym, this.utilityService.stripName(pack.name)) > 50){
                                var exists = false;
                                for(let temppack of animePacks){
                                    if(temppack.id == pack.id && temppack.botId == pack.botId && temppack.name == pack.name){
                                        exists = true;
                                        break;
                                    }
                                }
                                if(!exists){
                                    animePacks.push(pack);
                                    if(animePacks[0].id == ""){
                                        animePacks.splice(0,1);
                                    }
                                }
                            }                       
                        }
                    }
                });
            }            
        }
        this.waitForDataInterval = setInterval(() => {
            if(animePacks.length > 0){
                console.log(animePacks);
                this.shareService.setPackList(animePacks);    
                this.router.navigate(['/packlist']);            
               // this.showAnime = true;
               // this.showCurAir = false;
                clearInterval(this.waitForDataInterval);
            } else{
                setTimeout(() => {clearInterval(this.waitForDataInterval)}, 1000);
            }
        }, 500);        
    }
}
