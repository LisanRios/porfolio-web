import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PortfolioData } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})  
export class PorfolioService {
  private readonly dataUrl = 'assets/data/data.json';
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);
  private readonly portfolioData$ = this.refreshSubject.pipe(
    switchMap(() => this.loadPortfolio()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http:HttpClient) { }

  obtenerDatos(): Observable<PortfolioData> {
    return this.portfolioData$;
  }

  refresh(): void {
    this.refreshSubject.next();
  }

  private loadPortfolio(): Observable<PortfolioData> {
    const localData$ = this.http.get<PortfolioData>(this.dataUrl);

    if (!this.apiBaseUrl) {
      return localData$;
    }

    return forkJoin({
      local: localData$,
      remote: this.http
        .get<PortfolioData>(`${this.apiBaseUrl}/portfolio`)
        .pipe(catchError(() => of(null))),
    }).pipe(
      map(({ local, remote }) => {
        if (!remote) {
          return local;
        }

        return {
          ...local,
          ...remote,
          project: remote.project?.length ? remote.project : local.project,
          trabajo: remote.trabajo?.length ? remote.trabajo : local.trabajo,
          tecnology: remote.tecnology?.length ? remote.tecnology : local.tecnology,
          titule: remote.titule?.length ? remote.titule : local.titule,
          certifications: remote.certifications?.length
            ? remote.certifications
            : local.certifications ?? [],
          organizations: remote.organizations?.length
            ? remote.organizations
            : local.organizations ?? [],
          highlights: remote.highlights?.length ? remote.highlights : local.highlights ?? [],
          focusAreas: remote.focusAreas?.length
            ? remote.focusAreas
            : local.focusAreas ?? [],
          links: remote.links?.length ? remote.links : local.links ?? [],
          about: remote.about || local.about,
        };
      })
    );
  }
}
