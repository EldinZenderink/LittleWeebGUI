import {Component} from '@angular/core';


@Component({
    selector: 'menutag',
    template: `
        <div class="ui grey secondary vertical pointing menu fixed" style="height: 100%">
          <div class="ui horizontal divider">
            Little Weeb
          </div>
          <div *ngFor="let menuItem of menuItems">
            <a class="item" routerLink="{{menuItem.view}}" routerLinkActive="active">
                <i class="{{menuItem.icon}} icon "></i> {{menuItem.title}}
            </a>
          </div>
        </div>
    `,
})
export class MenuComponent {
    menuItems : menuItemToAdd[];
    menuItemToAdd : menuItemToAdd;
    constructor(){
        console.log("Menu Succesfully Loaded!");
        this.menuItems = [];
        this.menuItemToAdd = {
            title: 'Currently Airing',
            icon: 'add to calendar',
            view : 'currentlyairing'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Packlist',
            icon: 'add to calendar',
            view : 'packlist'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Latest XDCC Pack',
            icon: 'add to calendar',
            view : 'latestpack'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Search',
            icon: 'search',
            view : 'search'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Bot List',
            icon: 'disk outline',
            view : 'botlist'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Downloads',
            icon: 'download',
            view : 'downloads'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'Settings',
            icon: 'settings',
            view : 'settings'
        }
        this.menuItems.push(this.menuItemToAdd);
        this.menuItemToAdd = {
            title: 'About',
            icon: 'info',
            view : 'about'
        }
        this.menuItems.push(this.menuItemToAdd);
    }

}


interface menuItemToAdd {
    title: string;
    icon : string;
    view : string;
}
