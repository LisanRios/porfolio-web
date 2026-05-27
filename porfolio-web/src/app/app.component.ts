import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AdminUser } from './models/admin-user.model';
import { PortfolioData, PortfolioLink } from './models/portfolio.model';
import { AuthService } from './service/auth.service';
import { PorfolioService } from './service/porfolio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'porfolio-web';
  currentYear = new Date().getFullYear();
  cvPdfPath = environment.cvPdfPath;
  isDarkMode = false;
  user$: Observable<AdminUser | null>;
  portfolio$: Observable<PortfolioData>;

  private previousTitle = 'Lisandro Rios || Portfolio Web';
  private readonly destroy$ = new Subject<void>();
  private readonly pageMetadata: Record<
    string,
    { title: string; description: string }
  > = {
    '/inicio': {
      title: 'Lisandro Rios || Portfolio Web',
      description:
        'Portfolio profesional de Lisandro Rios: experiencia, formación, proyectos y tecnologías.',
    },
    '/trabajos': {
      title: 'Lisandro Rios || Trabajos',
      description: 'Experiencia laboral y proyectos destacados de Lisandro Rios.',
    },
    '/tecnologias': {
      title: 'Lisandro Rios || Tecnologías dominadas',
      description:
        'Stack tecnologico, herramientas y conocimientos de Lisandro Rios.',
    },
    '/admin': {
      title: 'Lisandro Rios || Administracion',
      description: 'Panel administrativo protegido para la gestion del portfolio.',
    },
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private authService: AuthService,
    private portfolioService: PorfolioService
  ) {
    this.user$ = this.authService.user$;
    this.portfolio$ = this.portfolioService.obtenerDatos();
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    this.updatePageMetadata(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updatePageMetadata(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.previousTitle = this.titleService.getTitle();
    this.titleService.setTitle('Lisandro Rios || No te vayas');
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.titleService.setTitle(this.previousTitle);
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode);
  }

  private updatePageMetadata(url: string): void {
    const metadata = this.pageMetadata[url] ?? {
      title: 'Lisandro Rios || Página no encontrada',
      description:
        'La página solicitada no está disponible en el portfolio de Lisandro Rios.',
    };

    this.titleService.setTitle(metadata.title);
    this.previousTitle = metadata.title;
    this.metaService.updateTag({
      name: 'description',
      content: metadata.description,
    });
    this.metaService.updateTag({ property: 'og:title', content: metadata.title });
    this.metaService.updateTag({
      property: 'og:description',
      content: metadata.description,
    });
  }

  footerLinks(portfolio: PortfolioData): PortfolioLink[] {
    return (portfolio.links ?? []).filter((link) => link.placement === 'footer');
  }

  trackLink(_index: number, link: PortfolioLink): string {
    return link.id ?? `${link.placement}-${link.label}`;
  }
}
