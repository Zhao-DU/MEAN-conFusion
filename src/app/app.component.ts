import { Component } from '@angular/core';


//Takes a JS object as a parameter 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
//these words displayed in the browser!
export class AppComponent {
  title = 'conFusion';
}