import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioData, Technology } from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.css'
})
export class TechnologiesComponent implements OnInit {
  portfolio$!: Observable<PortfolioData>;
  isAdmin$ = this.authService.isAdmin$;
  technologyForm: Technology = this.createEmptyTechnology();
  editingTechnologyId: string | null = null;
  showTechnologyForm = false;
  technologyStatus = '';
 
  constructor(
    private datosPorfolio:PorfolioService,
    private adminApi: AdminPortfolioApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.portfolio$ = this.datosPorfolio.obtenerDatos();
  }

  startCreateTechnology(): void {
    this.editingTechnologyId = null;
    this.technologyForm = this.createEmptyTechnology();
    this.showTechnologyForm = true;
  }

  startEditTechnology(technology: Technology): void {
    this.editingTechnologyId = technology.id ?? null;
    this.technologyForm = { ...technology };
    this.showTechnologyForm = true;
  }

  saveTechnology(): void {
    const request$ = this.editingTechnologyId
      ? this.adminApi.updateTechnology(this.editingTechnologyId, this.technologyForm)
      : this.adminApi.createTechnology(this.technologyForm);

    request$.subscribe({
      next: () => {
        this.technologyStatus = this.editingTechnologyId
          ? 'Tecnología actualizada.'
          : 'Tecnología creada.';
        this.closeTechnologyForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.technologyStatus = 'No se pudo guardar la tecnología.';
      },
    });
  }

  deleteTechnology(technology: Technology): void {
    if (!technology.id) {
      this.technologyStatus = 'La tecnología no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${technology.name}"?`)) {
      return;
    }

    this.adminApi.deleteTechnology(technology.id).subscribe({
      next: () => {
        this.technologyStatus = 'Tecnología eliminada.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.technologyStatus = 'No se pudo eliminar la tecnología.';
      },
    });
  }

  closeTechnologyForm(): void {
    this.showTechnologyForm = false;
    this.editingTechnologyId = null;
    this.technologyForm = this.createEmptyTechnology();
  }

  trackTechnology(_index: number, technology: Technology): string {
    return technology.id ?? technology.name;
  }

  private createEmptyTechnology(): Technology {
    return {
      id: '',
      icon: '',
      name: '',
      nivel: '',
    };
  }

}
