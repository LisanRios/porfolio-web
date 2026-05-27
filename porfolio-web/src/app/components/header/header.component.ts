import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  Certification,
  Education,
  FocusArea,
  OrganizationLogo,
  PortfolioData,
  PortfolioHighlight,
  PortfolioLink,
} from '../../models/portfolio.model';
import { AdminPortfolioApiService } from '../../service/admin-portfolio-api.service';
import { AuthService } from '../../service/auth.service';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-header',
  standalone: false,
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
  organizationForm: OrganizationLogo = this.createEmptyOrganization();
  editingOrganizationId: string | null = null;
  showOrganizationForm = false;
  organizationStatus = '';
  highlightForm: PortfolioHighlight = this.createEmptyHighlight();
  editingHighlightId: string | null = null;
  showHighlightForm = false;
  highlightStatus = '';
  focusAreaForm: FocusArea = this.createEmptyFocusArea();
  editingFocusAreaId: string | null = null;
  showFocusAreaForm = false;
  focusAreaStatus = '';
  linkForm: PortfolioLink = this.createEmptyLink();
  editingLinkId: string | null = null;
  showLinkForm = false;
  linkStatus = '';

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
      heroKicker: portfolio.heroKicker || `Hola, soy ${portfolio.nombre}`,
      heroSubtitle: portfolio.heroSubtitle ?? '',
      contactTitle: portfolio.contactTitle || '¿Interesado en conocerme?',
      copyrightName: portfolio.copyrightName || 'Lisandro Gabriel Rios De Morla',
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
      this.adminApi.updateProfileValue('heroKicker', this.profileForm.heroKicker),
      this.adminApi.updateProfileValue('heroSubtitle', this.profileForm.heroSubtitle),
      this.adminApi.updateProfileValue('contactTitle', this.profileForm.contactTitle),
      this.adminApi.updateProfileValue('copyrightName', this.profileForm.copyrightName),
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

  startCreateOrganization(): void {
    this.editingOrganizationId = null;
    this.organizationForm = this.createEmptyOrganization();
    this.showOrganizationForm = true;
  }

  startEditOrganization(organization: OrganizationLogo): void {
    this.editingOrganizationId = organization.id ?? null;
    this.organizationForm = { ...organization };
    this.showOrganizationForm = true;
  }

  saveOrganization(): void {
    const request$ = this.editingOrganizationId
      ? this.adminApi.updateOrganization(this.editingOrganizationId, this.organizationForm)
      : this.adminApi.createOrganization(this.organizationForm);

    request$.subscribe({
      next: () => {
        this.organizationStatus = this.editingOrganizationId
          ? 'Organización actualizada.'
          : 'Organización creada.';
        this.closeOrganizationForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.organizationStatus = 'No se pudo guardar la organización.';
      },
    });
  }

  deleteOrganization(organization: OrganizationLogo): void {
    if (!organization.id) {
      this.organizationStatus = 'La organización no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${organization.name}"?`)) {
      return;
    }

    this.adminApi.deleteOrganization(organization.id).subscribe({
      next: () => {
        this.organizationStatus = 'Organización eliminada.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.organizationStatus = 'No se pudo eliminar la organización.';
      },
    });
  }

  closeOrganizationForm(): void {
    this.showOrganizationForm = false;
    this.editingOrganizationId = null;
    this.organizationForm = this.createEmptyOrganization();
  }

  startCreateHighlight(): void {
    this.editingHighlightId = null;
    this.highlightForm = this.createEmptyHighlight();
    this.showHighlightForm = true;
  }

  startEditHighlight(highlight: PortfolioHighlight): void {
    this.editingHighlightId = highlight.id ?? null;
    this.highlightForm = { ...highlight };
    this.showHighlightForm = true;
  }

  saveHighlight(): void {
    const request$ = this.editingHighlightId
      ? this.adminApi.updateHighlight(this.editingHighlightId, this.highlightForm)
      : this.adminApi.createHighlight(this.highlightForm);

    request$.subscribe({
      next: () => {
        this.highlightStatus = this.editingHighlightId
          ? 'Indicador actualizado.'
          : 'Indicador creado.';
        this.closeHighlightForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.highlightStatus = 'No se pudo guardar el indicador.';
      },
    });
  }

  deleteHighlight(highlight: PortfolioHighlight): void {
    if (!highlight.id) {
      this.highlightStatus = 'El indicador no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${highlight.label}"?`)) {
      return;
    }

    this.adminApi.deleteHighlight(highlight.id).subscribe({
      next: () => {
        this.highlightStatus = 'Indicador eliminado.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.highlightStatus = 'No se pudo eliminar el indicador.';
      },
    });
  }

  closeHighlightForm(): void {
    this.showHighlightForm = false;
    this.editingHighlightId = null;
    this.highlightForm = this.createEmptyHighlight();
  }

  startCreateFocusArea(): void {
    this.editingFocusAreaId = null;
    this.focusAreaForm = this.createEmptyFocusArea();
    this.showFocusAreaForm = true;
  }

  startEditFocusArea(focusArea: FocusArea): void {
    this.editingFocusAreaId = focusArea.id ?? null;
    this.focusAreaForm = { ...focusArea };
    this.showFocusAreaForm = true;
  }

  saveFocusArea(): void {
    const request$ = this.editingFocusAreaId
      ? this.adminApi.updateFocusArea(this.editingFocusAreaId, this.focusAreaForm)
      : this.adminApi.createFocusArea(this.focusAreaForm);

    request$.subscribe({
      next: () => {
        this.focusAreaStatus = this.editingFocusAreaId
          ? 'Área actualizada.'
          : 'Área creada.';
        this.closeFocusAreaForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.focusAreaStatus = 'No se pudo guardar el área.';
      },
    });
  }

  deleteFocusArea(focusArea: FocusArea): void {
    if (!focusArea.id) {
      this.focusAreaStatus = 'El área no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${focusArea.title}"?`)) {
      return;
    }

    this.adminApi.deleteFocusArea(focusArea.id).subscribe({
      next: () => {
        this.focusAreaStatus = 'Área eliminada.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.focusAreaStatus = 'No se pudo eliminar el área.';
      },
    });
  }

  closeFocusAreaForm(): void {
    this.showFocusAreaForm = false;
    this.editingFocusAreaId = null;
    this.focusAreaForm = this.createEmptyFocusArea();
  }

  startCreateLink(): void {
    this.editingLinkId = null;
    this.linkForm = this.createEmptyLink();
    this.showLinkForm = true;
  }

  startEditLink(link: PortfolioLink): void {
    this.editingLinkId = link.id ?? null;
    this.linkForm = { ...link };
    this.showLinkForm = true;
  }

  saveLink(): void {
    const request$ = this.editingLinkId
      ? this.adminApi.updateLink(this.editingLinkId, this.linkForm)
      : this.adminApi.createLink(this.linkForm);

    request$.subscribe({
      next: () => {
        this.linkStatus = this.editingLinkId ? 'Enlace actualizado.' : 'Enlace creado.';
        this.closeLinkForm();
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.linkStatus = 'No se pudo guardar el enlace.';
      },
    });
  }

  deleteLink(link: PortfolioLink): void {
    if (!link.id) {
      this.linkStatus = 'El enlace no tiene ID para eliminar.';
      return;
    }

    if (!window.confirm(`Eliminar "${link.label}"?`)) {
      return;
    }

    this.adminApi.deleteLink(link.id).subscribe({
      next: () => {
        this.linkStatus = 'Enlace eliminado.';
        this.datosPorfolio.refresh();
      },
      error: () => {
        this.linkStatus = 'No se pudo eliminar el enlace.';
      },
    });
  }

  closeLinkForm(): void {
    this.showLinkForm = false;
    this.editingLinkId = null;
    this.linkForm = this.createEmptyLink();
  }

  linksByPlacement(portfolio: PortfolioData, placement: string): PortfolioLink[] {
    return (portfolio.links ?? []).filter((link) => link.placement === placement);
  }

  trackEducation(_index: number, education: Education): string {
    return education.id ?? `${education.name}-${education.type}`;
  }

  trackCertification(_index: number, certification: Certification): string {
    return certification.id ?? `${certification.issuer}-${certification.title}`;
  }

  trackOrganization(_index: number, organization: OrganizationLogo): string {
    return organization.id ?? organization.name;
  }

  trackHighlight(_index: number, highlight: PortfolioHighlight): string {
    return highlight.id ?? highlight.label;
  }

  trackFocusArea(_index: number, focusArea: FocusArea): string {
    return focusArea.id ?? focusArea.title;
  }

  trackLink(_index: number, link: PortfolioLink): string {
    return link.id ?? `${link.placement}-${link.label}`;
  }

  private createEmptyEducation(): Education {
    return {
      id: '',
      order: 0,
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
  > & {
    heroKicker: string;
    heroSubtitle: string;
    contactTitle: string;
    copyrightName: string;
  } {
    return {
      nombre: '',
      age: '',
      foto: '',
      position: '',
      ubication: '',
      heroKicker: '',
      heroSubtitle: '',
      contactTitle: '',
      copyrightName: '',
    };
  }

  private createEmptyCertification(): Certification {
    return {
      id: '',
      order: 0,
      title: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      description: '',
      icon: 'bi bi-award',
    };
  }

  private createEmptyOrganization(): OrganizationLogo {
    return {
      id: '',
      order: 0,
      name: '',
      image: '',
      alt: '',
      link: '',
    };
  }

  private createEmptyHighlight(): PortfolioHighlight {
    return {
      id: '',
      order: 0,
      value: '',
      label: '',
      icon: 'bi bi-stars',
    };
  }

  private createEmptyFocusArea(): FocusArea {
    return {
      id: '',
      order: 0,
      icon: 'bi bi-compass',
      title: '',
      description: '',
    };
  }

  private createEmptyLink(): PortfolioLink {
    return {
      id: '',
      order: 0,
      label: '',
      url: '',
      icon: 'bi bi-link-45deg',
      placement: 'footer',
      downloadName: '',
    };
  }
}
