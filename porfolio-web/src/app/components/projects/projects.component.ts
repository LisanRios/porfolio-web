import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DescriptionPoint,
  IconReference,
  PortfolioData,
  Project,
  WorkExperience,
} from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';
import { PorfolioService } from '../../service/porfolio.service';


@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{
  portfolio$!: Observable<PortfolioData>;
  isAdmin$ = this.authService.isAdmin$;
  workForm: WorkExperience = this.createEmptyWork();
  workDescriptionText = '';
  workTechnologyText = '';
  editingWorkId: string | null = null;
  showWorkForm = false;
  workStatus = '';
  projectForm: Project = this.createEmptyProject();
  projectLanguageText = '';
  editingProjectId: string | null = null;
  showProjectForm = false;
  projectStatus = '';

  constructor(
    private datosPorfolio:PorfolioService,
    private adminApi: AdminPortfolioApiService,
    private authService: AuthService
  ) {
  
  }

  ngOnInit(): void {
    this.portfolio$ = this.datosPorfolio.obtenerDatos();
  }

  startCreateWork(): void {
    this.editingWorkId = null;
    this.workForm = this.createEmptyWork();
    this.workDescriptionText = '';
    this.workTechnologyText = '';
    this.showWorkForm = true;
  }

  startEditWork(work: WorkExperience): void {
    this.editingWorkId = work.id ?? null;
    this.workForm = {
      ...work,
      description: [...work.description],
      technologies: [...(work.technologies ?? [])],
    };
    this.workDescriptionText = work.description.map((item) => item.punto).join('\n');
    this.workTechnologyText = (work.technologies ?? [])
      .map((item) => item.icon)
      .filter((icon): icon is string => Boolean(icon))
      .join(', ');
    this.showWorkForm = true;
  }

  saveWork(): void {
    const payload: WorkExperience = {
      ...this.workForm,
      description: this.parseDescriptionText(this.workDescriptionText),
      technologies: this.parseIconText(this.workTechnologyText),
    };
    const request$ = this.editingWorkId
      ? this.adminApi.updateWork(this.editingWorkId, payload)
      : this.adminApi.createWork(payload);

    request$.subscribe({
      next: () => {
        this.workStatus = this.editingWorkId ? 'Trabajo actualizado.' : 'Trabajo creado.';
        this.closeWorkForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.workStatus = 'No se pudo guardar el trabajo.';
      },
    });
  }

  deleteWork(work: WorkExperience): void {
    if (!work.id) {
      this.workStatus = 'El trabajo no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${work.name}"?`)) {
      return;
    }

    this.adminApi.deleteWork(work.id).subscribe({
      next: () => {
        this.workStatus = 'Trabajo eliminado.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.workStatus = 'No se pudo eliminar el trabajo.';
      },
    });
  }

  closeWorkForm(): void {
    this.showWorkForm = false;
    this.editingWorkId = null;
    this.workForm = this.createEmptyWork();
    this.workDescriptionText = '';
    this.workTechnologyText = '';
  }

  startCreateProject(): void {
    this.editingProjectId = null;
    this.projectForm = this.createEmptyProject();
    this.projectLanguageText = '';
    this.showProjectForm = true;
  }

  startEditProject(project: Project): void {
    this.editingProjectId = project.id ?? null;
    this.projectForm = {
      ...project,
      lenguaje: [...project.lenguaje],
    };
    this.projectLanguageText = project.lenguaje
      .map((item) => item.name)
      .filter((name): name is string => Boolean(name))
      .join(', ');
    this.showProjectForm = true;
  }

  saveProject(): void {
    const payload: Project = {
      ...this.projectForm,
      lenguaje: this.parseLanguageText(this.projectLanguageText),
    };
    const request$ = this.editingProjectId
      ? this.adminApi.updateProject(this.editingProjectId, payload)
      : this.adminApi.createProject(payload);

    request$.subscribe({
      next: () => {
        this.projectStatus = this.editingProjectId
          ? 'Proyecto actualizado.'
          : 'Proyecto creado.';
        this.closeProjectForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.projectStatus = 'No se pudo guardar el proyecto.';
      },
    });
  }

  deleteProject(project: Project): void {
    if (!project.id) {
      this.projectStatus = 'El proyecto no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${project.name}"?`)) {
      return;
    }

    this.adminApi.deleteProject(project.id).subscribe({
      next: () => {
        this.projectStatus = 'Proyecto eliminado.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.projectStatus = 'No se pudo eliminar el proyecto.';
      },
    });
  }

  closeProjectForm(): void {
    this.showProjectForm = false;
    this.editingProjectId = null;
    this.projectForm = this.createEmptyProject();
    this.projectLanguageText = '';
  }

  trackWork(_index: number, work: WorkExperience): string {
    return work.id ?? `${work.name}-${work.type}`;
  }

  trackProject(_index: number, project: Project): string {
    return project.id ?? `${project.name}-${project.type}`;
  }

  private createEmptyWork(): WorkExperience {
    return {
      id: '',
      order: 0,
      type: '',
      name: '',
      dateInicio: '',
      dateFin: '',
      logo: '',
      link: '',
      description: [],
      technologies: [],
    };
  }

  private createEmptyProject(): Project {
    return {
      id: '',
      order: 0,
      type: '',
      name: '',
      date: '',
      image: '',
      description: '',
      link: '',
      lenguaje: [],
    };
  }

  private parseDescriptionText(value: string): DescriptionPoint[] {
    return value
      .split('\n')
      .map((punto) => punto.trim())
      .filter(Boolean)
      .map((punto) => ({ punto }));
  }

  private parseIconText(value: string): IconReference[] {
    return value
      .split(',')
      .map((icon) => icon.trim())
      .filter(Boolean)
      .map((icon) => ({ icon }));
  }

  private parseLanguageText(value: string): IconReference[] {
    return value
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }));
  }
}
