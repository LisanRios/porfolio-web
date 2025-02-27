import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'porfolio-web';
  previousTitle = document.title;

  constructor(private titleService: Title, private router: Router) {
    // Cambiar título según la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.url;
      switch (currentRoute) {
        case '/inicio':
          this.titleService.setTitle('Lisandro Rios || Porfolio Web');
          break;
        case '/trabajos':
          this.titleService.setTitle('Lisandro Rios || Trabajos');
          break;
        case '/tecnologias':
          this.titleService.setTitle('Lisandro Rios || Tecnologías dominadas');
          break;
        default:
          this.titleService.setTitle('Lisandro Rios || Oh no !!');
          break;
      }
    });

    // Cambiar título cuando la ventana pierde o gana el foco
    window.addEventListener('blur', () => {
      this.previousTitle = this.titleService.getTitle();
      this.titleService.setTitle('Lisandro Rios || ¡No te vayas! :(');
    });
    window.addEventListener('focus', () => {
      this.titleService.setTitle(this.previousTitle);
    });
  }
}
