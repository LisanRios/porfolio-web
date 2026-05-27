import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../../models/admin-user.model';
import { PortfolioData } from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements AfterViewInit, OnDestroy {
  @ViewChild('googleButton') googleButton?: ElementRef<HTMLDivElement>;

  readonly user$: Observable<AdminUser | null> = this.authService.user$;
  readonly isAuthConfigured = this.authService.isConfigured;
  readonly isApiConfigured = this.adminApi.isConfigured;

  portfolio?: PortfolioData;
  statusMessage = '';
  private googleRenderAttempts = 0;
  private googleRenderTimeout?: number;

  constructor(
    private authService: AuthService,
    private adminApi: AdminPortfolioApiService
  ) {}

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  ngOnDestroy(): void {
    if (this.googleRenderTimeout) {
      window.clearTimeout(this.googleRenderTimeout);
    }
  }

  loadPortfolio(): void {
    if (!this.isApiConfigured) {
      this.statusMessage = 'La API administrativa no esta disponible.';
      return;
    }

    this.adminApi.getPortfolio().subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
        this.statusMessage = 'Datos cargados desde la API segura.';
      },
      error: () => {
        this.statusMessage = 'No se pudo cargar la API administrativa.';
      },
    });
  }

  generateCv(): void {
    if (!this.isApiConfigured) {
      this.statusMessage = 'La generacion de CV no esta disponible.';
      return;
    }

    this.adminApi.generateCv().subscribe({
      next: (cvBlob) => {
        const cvUrl = URL.createObjectURL(cvBlob);
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Lisandro-Gabriel-Rios-De-Morla-CV.pdf';
        link.click();
        URL.revokeObjectURL(cvUrl);
        this.statusMessage = 'CV generado correctamente.';
      },
      error: () => {
        this.statusMessage = 'No se pudo generar el CV.';
      },
    });
  }

  signOut(): void {
    this.authService.signOut();
    this.portfolio = undefined;
    this.statusMessage = '';
  }

  private renderGoogleButton(): void {
    if (!this.googleButton?.nativeElement || !this.isAuthConfigured) {
      return;
    }

    const rendered = this.authService.renderGoogleButton(
      this.googleButton.nativeElement
    );

    if (!rendered && this.googleRenderAttempts < 20) {
      this.googleRenderAttempts += 1;
      this.googleRenderTimeout = window.setTimeout(
        () => this.renderGoogleButton(),
        250
      );
    }
  }
}
