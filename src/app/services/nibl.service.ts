import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of'; //proper way to import the 'of' operator
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Injectable()
export class NiblService {

    month : number;
    year : number; 
    date : Date;
    season: string;
    currentlyAiring : Object;
    searchResult : Object;
    botList : Object;
    latestPacks : Object;
    packsForBot : Object;
    observable : Observable<any>;

    constructor(private http: Http){
        console.log("Nibl Service Initialiazed...");
        this.date = new Date();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
    }

    getCurrentlyAiringAnime(){
        var seasons = [ "Winter", "Winter", "Spring", "Spring", "Spring", "Summer", "Summer", "Summer", "Fall", "Fall", "Fall", "Winter"];
        var currentSeason = seasons[this.month + 1];
        this.observable = this.http.get('https://api.nibl.co.uk:8080/anilist/series/season?year=' + this.year + '&season=' + currentSeason).map(res => {
            this.observable = null;
            this.currentlyAiring = res.json();
            return this.currentlyAiring;

        }).share();
        return this.observable;
    }

    getSearchAnimeResults(query : String){
        this.observable = this.http.get( 'https://api.nibl.co.uk:8080/nibl/search/?query=' + query + '&episodeNumber=-1').map(res => {
            this.observable = null;
            this.searchResult = res.json().content;
            return this.searchResult;
        }).share();
        return this.observable;
    }

    getBotList(){
        this.observable = this.http.get( 'https://api.nibl.co.uk:8080/nibl/bots').map(res => {
            this.observable = null;
            this.botList = res.json().content;
            return this.botList;
        }).share();
        return this.observable;
    }

    getLatestPack(){
        this.observable = this.http.get('https://api.nibl.co.uk:8080/nibl/latest?size=100').map(res => {
            this.observable = null;
            this.latestPacks = res.json().content;
            return this.latestPacks;
        }).share();
        return this.observable;
    }

    getPacksForBot(id : number){
        this.observable = this.http.get('https://api.nibl.co.uk:8080/nibl/bots/' + id).map(res => {
            this.observable = null;
            this.packsForBot = res.json().content.packList;
            return this.packsForBot;
        }).share();
        return this.observable;
    }



}