import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  Certification,
  Education,
  PortfolioData,
} from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  readonly defaultAboutText =
    'Me destaco por ser una persona responsable, dedicada y orientada a la mejora continua. Mi ética de trabajo se refleja en el esfuerzo constante por elevar mis habilidades y conocimientos. Mi entusiasmo por la tecnología y mi compromiso con el crecimiento profesional son activos que busco aportar a cada equipo.';

  portfolio$!: Observable<PortfolioData>;
  isAdmin$ = this.authService.isAdmin$;
  educationForm: Education = this.createEmptyEducation();
  editingEducationId: string | null = null;
  showEducationForm = false;
  educationStatus = '';
  profileForm = this.createEmptyProfile();
  showProfileForm = false;
  profileStatus = '';
  aboutText = '';
  showAboutForm = false;
  aboutStatus = '';
  certificationForm: Certification = this.createEmptyCertification();
  editingCertificationId: string | null = null;
  showCertificationForm = false;
  certificationStatus = '';

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

  startEditProfile(portfolio: PortfolioData): void {
    this.profileForm = {
      nombre: portfolio.nombre,
      age: portfolio.age,
      foto: portfolio.foto,
      position: portfolio.position,
      ubication: portfolio.ubication,
    };
    this.showProfileForm = true;
  }

  saveProfile(): void {
    forkJoin([
      this.adminApi.updateProfileValue('nombre', this.profileForm.nombre),
      this.adminApi.updateProfileValue('age', this.profileForm.age),
      this.adminApi.updateProfileValue('foto', this.profileForm.foto),
      this.adminApi.updateProfileValue('position', this.profileForm.position),
      this.adminApi.updateProfileValue('ubication', this.profileForm.ubication),
    ]).subscribe({
      next: () => {
        this.profileStatus = 'Perfil actualizado.';
        this.showProfileForm = false;
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.profileStatus = 'No se pudo guardar el perfil.';
      },
    });
  }

  closeProfileForm(): void {
    this.showProfileForm = false;
    this.profileForm = this.createEmptyProfile();
  }

  startEditAbout(portfolio: PortfolioData): void {
    this.aboutText = portfolio.about || this.defaultAboutText;
    this.showAboutForm = true;
  }

  saveAbout(): void {
    this.adminApi.updateProfileValue('about', this.aboutText).subscribe({
      next: () => {
        this.aboutStatus = 'Sobre mí actualizado.';
        this.showAboutForm = false;
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.aboutStatus = 'No se pudo guardar Sobre mí.';
      },
    });
  }

  closeAboutForm(): void {
    this.showAboutForm = false;
    this.aboutText = '';
  }

  startCreateCertification(): void {
    this.editingCertificationId = null;
    this.certificationForm = this.createEmptyCertification();
    this.showCertificationForm = true;
  }

  startEditCertification(certification: Certification): void {
    this.editingCertificationId = certification.id ?? null;
    this.certificationForm = { ...certification };
    this.showCertificationForm = true;
  }

  saveCertification(): void {
    const request$ = this.editingCertificationId
      ? this.adminApi.updateCertification(
          this.editingCertificationId,
          this.certificationForm
        )
      : this.adminApi.createCertification(this.certificationForm);

    request$.subscribe({
      next: () => {
        this.certificationStatus = this.editingCertificationId
          ? 'Diploma actualizado.'
          : 'Diploma creado.';
        this.closeCertificationForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.certificationStatus = 'No se pudo guardar el diploma.';
      },
    });
  }

  deleteCertification(certification: Certification): void {
    if (!certification.id) {
      this.certificationStatus = 'El diploma no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${certification.title}"?`)) {
      return;
    }

    this.adminApi.deleteCertification(certification.id).subscribe({
      next: () => {
        this.certificationStatus = 'Diploma eliminado.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.certificationStatus = 'No se pudo eliminar el diploma.';
      },
    });
  }

  closeCertificationForm(): void {
    this.showCertificationForm = false;
    this.editingCertificationId = null;
    this.certificationForm = this.createEmptyCertification();
  }

  trackEducation(_index: number, education: Education): string {
    return education.id ?? `${education.name}-${education.type}`;
  }

  trackCertification(_index: number, certification: Certification): string {
    return certification.id ?? `${certification.issuer}-${certification.title}`;
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

  private createEmptyProfile(): Pick<
    PortfolioData,
    'nombre' | 'age' | 'foto' | 'position' | 'ubication'
  > {
    return {
      nombre: '',
      age: '',
      foto: '',
      position: '',
      ubication: '',
    };
  }

  private createEmptyCertification(): Certification {
    return {
      id: '',
      title: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      description: '',
      icon: 'bi bi-award',
    };
  }
}
