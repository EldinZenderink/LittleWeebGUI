import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

//main components
import { AppComponent }  from './app.component';

//body components
import { MenuComponent } from './components/menu.component';

//view components
import { CurrentlyAiring } from './components/views/currentlyairing.component';
import { LatestPack } from './components/views/latestpack.component';
import { Search } from './components/views/search.component';
import { BotList } from './components/views/botlist.component';
import { Downloads } from './components/views/downloads.component';
import { Settings } from './components/views/settings.component';
import { About } from './components/views/about.component';
import { PackList } from './components/views/packlist.component';

//services

import {NiblService} from './services/nibl.service'
import {ShareService} from './services/share.service'
import {UtilityService} from './services/utility.service'
import {BackEndService} from './services/backend.service'
//view routes
const appRoutes: Routes = [
  {
    path: 'currentlyairing',
    component: CurrentlyAiring,
    data: { title: 'Currently Airing' }
  },
  {
    path: 'latestpack',
    component: LatestPack,
    data: { title: 'Latest XDCC Pack' }
  },
  {
    path: 'search',
    component: Search,
    data: { title: 'Search' }
  },
  {
    path: 'botlist',
    component: BotList,
    data: { title: 'Bot List' }
  },
  {
    path: 'downloads',
    component: Downloads,
    data: { title: 'Downloads' }
  },
  {
    path: 'settings',
    component: Settings,
    data: { title: 'Settings' }
  },
  {
    path: 'about',
    component: About,
    data: { title: 'About' }
  },
  {
    path: 'packlist',
    component: PackList,
    data: { title: 'Pack List' }
  },
  { path: '',
    redirectTo: 'currentlyairing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:      [ BrowserModule,  RouterModule.forRoot(appRoutes, { enableTracing: true }), FormsModule, HttpModule, CommonModule ],
  declarations: [ AppComponent, MenuComponent, CurrentlyAiring, LatestPack, Search, BotList, Downloads, Settings, About, PackList ],
  bootstrap:    [ AppComponent ],
  providers: [NiblService, UtilityService, ShareService, BackEndService]
})
export class AppModule { }
