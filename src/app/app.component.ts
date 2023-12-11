import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'porfolio-web';
}
let previousTitle = document.title;

window.addEventListener('blur', () => {
  previousTitle = document.title;
  document.title = ' Porfolio web || ¡No te vayas! :(';
})
window.addEventListener('focus', () => {
  document.title = previousTitle;
})