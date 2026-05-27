import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Certification,
  Education,
  FocusArea,
  OrganizationLogo,
  PortfolioData,
  PortfolioHighlight,
  PortfolioLink,
  Project,
  Technology,
  WorkExperience,
} from '../models/portfolio.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPortfolioApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  constructor(private http: HttpClient, private authService: AuthService) {}

  get isConfigured(): boolean {
    return Boolean(this.apiBaseUrl);
  }

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(this.buildUrl('/portfolio'), {
      headers: this.buildAuthHeaders(),
    });
  }

  updatePortfolio(data: PortfolioData): Observable<PortfolioData> {
    return this.http.put<PortfolioData>(this.buildUrl('/portfolio'), data, {
      headers: this.buildAuthHeaders(),
    });
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.buildUrl('/projects'), project, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateProject(projectId: string, project: Project): Observable<Project> {
    return this.http.put<Project>(
      this.buildUrl(`/projects/${encodeURIComponent(projectId)}`),
      project,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/projects/${encodeURIComponent(projectId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createWork(work: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(this.buildUrl('/work'), work, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateWork(workId: string, work: WorkExperience): Observable<WorkExperience> {
    return this.http.put<WorkExperience>(
      this.buildUrl(`/work/${encodeURIComponent(workId)}`),
      work,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteWork(workId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/work/${encodeURIComponent(workId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createTechnology(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>(this.buildUrl('/technologies'), technology, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateTechnology(
    technologyId: string,
    technology: Technology
  ): Observable<Technology> {
    return this.http.put<Technology>(
      this.buildUrl(`/technologies/${encodeURIComponent(technologyId)}`),
      technology,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteTechnology(technologyId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/technologies/${encodeURIComponent(technologyId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(this.buildUrl('/education'), education, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateEducation(educationId: string, education: Education): Observable<Education> {
    return this.http.put<Education>(
      this.buildUrl(`/education/${encodeURIComponent(educationId)}`),
      education,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteEducation(educationId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/education/${encodeURIComponent(educationId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createCertification(certification: Certification): Observable<Certification> {
    return this.http.post<Certification>(
      this.buildUrl('/certifications'),
      certification,
      { headers: this.buildAuthHeaders() }
    );
  }

  updateCertification(
    certificationId: string,
    certification: Certification
  ): Observable<Certification> {
    return this.http.put<Certification>(
      this.buildUrl(`/certifications/${encodeURIComponent(certificationId)}`),
      certification,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteCertification(certificationId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/certifications/${encodeURIComponent(certificationId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createOrganization(organization: OrganizationLogo): Observable<OrganizationLogo> {
    return this.http.post<OrganizationLogo>(
      this.buildUrl('/organizations'),
      organization,
      { headers: this.buildAuthHeaders() }
    );
  }

  updateOrganization(
    organizationId: string,
    organization: OrganizationLogo
  ): Observable<OrganizationLogo> {
    return this.http.put<OrganizationLogo>(
      this.buildUrl(`/organizations/${encodeURIComponent(organizationId)}`),
      organization,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteOrganization(organizationId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/organizations/${encodeURIComponent(organizationId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createHighlight(highlight: PortfolioHighlight): Observable<PortfolioHighlight> {
    return this.http.post<PortfolioHighlight>(this.buildUrl('/highlights'), highlight, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateHighlight(
    highlightId: string,
    highlight: PortfolioHighlight
  ): Observable<PortfolioHighlight> {
    return this.http.put<PortfolioHighlight>(
      this.buildUrl(`/highlights/${encodeURIComponent(highlightId)}`),
      highlight,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteHighlight(highlightId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/highlights/${encodeURIComponent(highlightId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createFocusArea(focusArea: FocusArea): Observable<FocusArea> {
    return this.http.post<FocusArea>(this.buildUrl('/focus-areas'), focusArea, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateFocusArea(focusAreaId: string, focusArea: FocusArea): Observable<FocusArea> {
    return this.http.put<FocusArea>(
      this.buildUrl(`/focus-areas/${encodeURIComponent(focusAreaId)}`),
      focusArea,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteFocusArea(focusAreaId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/focus-areas/${encodeURIComponent(focusAreaId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  createLink(link: PortfolioLink): Observable<PortfolioLink> {
    return this.http.post<PortfolioLink>(this.buildUrl('/links'), link, {
      headers: this.buildAuthHeaders(),
    });
  }

  updateLink(linkId: string, link: PortfolioLink): Observable<PortfolioLink> {
    return this.http.put<PortfolioLink>(
      this.buildUrl(`/links/${encodeURIComponent(linkId)}`),
      link,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteLink(linkId: string): Observable<void> {
    return this.http.delete<void>(
      this.buildUrl(`/links/${encodeURIComponent(linkId)}`),
      { headers: this.buildAuthHeaders() }
    );
  }

  updateProfileValue(key: string, value: string): Observable<{ key: string; value: string }> {
    return this.http.put<{ key: string; value: string }>(
      this.buildUrl(`/profile/${encodeURIComponent(key)}`),
      { value },
      { headers: this.buildAuthHeaders() }
    );
  }

  generateCv(): Observable<Blob> {
    return this.http.get(this.buildUrl('/cv'), {
      headers: this.buildAuthHeaders(),
      responseType: 'blob',
    });
  }

  private buildUrl(path: string): string {
    if (!this.apiBaseUrl) {
      throw new Error('apiBaseUrl is not configured.');
    }

    return `${this.apiBaseUrl}${path}`;
  }

  private buildAuthHeaders(): HttpHeaders {
    const credential = this.authService.currentCredential;

    return credential
      ? new HttpHeaders({ Authorization: `Bearer ${credential}` })
      : new HttpHeaders();
  }
}
