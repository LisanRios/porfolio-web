import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../../models/admin-user.model';
import { IconReference, PortfolioData, Project } from '../../models/portfolio.model';
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
  projectForm: Project = this.createEmptyProject();
  languageText = '';
  editingProjectId: string | null = null;
  isSavingProject = false;
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
      this.statusMessage = 'La API administrativa no está disponible.';
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

  saveProject(): void {
    if (!this.isApiConfigured) {
      this.statusMessage = 'La API administrativa no está disponible.';
      return;
    }

    const payload: Project = {
      ...this.projectForm,
      lenguaje: this.parseLanguageText(this.languageText),
    };
    const request$ = this.editingProjectId
      ? this.adminApi.updateProject(this.editingProjectId, payload)
      : this.adminApi.createProject(payload);

    this.isSavingProject = true;
    request$.subscribe({
      next: () => {
        this.statusMessage = this.editingProjectId
          ? 'Proyecto actualizado.'
          : 'Proyecto creado.';
        this.resetProjectForm();
        this.loadPortfolio();
        this.isSavingProject = false;
      },
      error: () => {
        this.statusMessage = 'No se pudo guardar el proyecto.';
        this.isSavingProject = false;
      },
    });
  }

  editProject(project: Project): void {
    this.editingProjectId = project.id ?? null;
    this.projectForm = {
      ...project,
      lenguaje: [...project.lenguaje],
    };
    this.languageText = project.lenguaje
      .map((item) => item.name)
      .filter((name): name is string => Boolean(name))
      .join(', ');
  }

  deleteProject(project: Project): void {
    if (!project.id) {
      this.statusMessage = 'El proyecto no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Desactivar el proyecto "${project.name}"?`)) {
      return;
    }

    this.adminApi.deleteProject(project.id).subscribe({
      next: () => {
        this.statusMessage = 'Proyecto desactivado.';
        this.resetProjectForm();
        this.loadPortfolio();
      },
      error: () => {
        this.statusMessage = 'No se pudo desactivar el proyecto.';
      },
    });
  }

  resetProjectForm(): void {
    this.editingProjectId = null;
    this.projectForm = this.createEmptyProject();
    this.languageText = '';
  }

  generateCv(): void {
    if (!this.isApiConfigured) {
      this.statusMessage = 'La generación de CV no está disponible.';
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

  trackProject(_index: number, project: Project): string {
    return project.id ?? project.name;
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

  private createEmptyProject(): Project {
    return {
      id: '',
      type: '',
      name: '',
      date: '',
      image: '',
      description: '',
      link: '',
      lenguaje: [],
    };
  }

  private parseLanguageText(value: string): IconReference[] {
    return value
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
  }
}
