import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div class="ui grid">
      <div class="four wide column">
          <menutag></menutag>
      </div>
      <div class="ten wide column">        
        <router-outlet></router-outlet>
      </div>
  </div>
  `,
})
export class AppComponent  { }
