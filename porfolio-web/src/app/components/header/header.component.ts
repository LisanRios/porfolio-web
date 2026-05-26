import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Education, PortfolioData } from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  portfolio$!: Observable<PortfolioData>;
  isAdmin$ = this.authService.isAdmin$;
  educationForm: Education = this.createEmptyEducation();
  editingEducationId: string | null = null;
  showEducationForm = false;
  educationStatus = '';

  constructor(
    private datosPorfolio:PorfolioService,
    private adminApi: AdminPortfolioApiService,
    private authService: AuthService
  ) {
  
  }

  ngOnInit(): void {
    this.portfolio$ = this.datosPorfolio.obtenerDatos();
  }

  startCreateEducation(): void {
    this.editingEducationId = null;
    this.educationForm = this.createEmptyEducation();
    this.showEducationForm = true;
  }

  startEditEducation(education: Education): void {
    this.editingEducationId = education.id ?? null;
    this.educationForm = { ...education };
    this.showEducationForm = true;
  }

  saveEducation(): void {
    const request$ = this.editingEducationId
      ? this.adminApi.updateEducation(this.editingEducationId, this.educationForm)
      : this.adminApi.createEducation(this.educationForm);

    request$.subscribe({
      next: () => {
        this.educationStatus = this.editingEducationId
          ? 'Formación actualizada.'
          : 'Formación creada.';
        this.closeEducationForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.educationStatus = 'No se pudo guardar la formación.';
      },
    });
  }

  deleteEducation(education: Education): void {
    if (!education.id) {
      this.educationStatus = 'El registro no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${education.type}"?`)) {
      return;
    }

    this.adminApi.deleteEducation(education.id).subscribe({
      next: () => {
        this.educationStatus = 'Formación eliminada.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.educationStatus = 'No se pudo eliminar la formación.';
      },
    });
  }

  closeEducationForm(): void {
    this.showEducationForm = false;
    this.editingEducationId = null;
    this.educationForm = this.createEmptyEducation();
  }

  trackEducation(_index: number, education: Education): string {
    return education.id ?? `${education.name}-${education.type}`;
  }

  private createEmptyEducation(): Education {
    return {
      id: '',
      type: '',
      name: '',
      dateInicio: '',
      dateFin: '',
      description: '',
    };
  }
}
