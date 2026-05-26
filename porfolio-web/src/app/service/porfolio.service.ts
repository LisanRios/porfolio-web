import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
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

    return this.http
      .get<PortfolioData>(`${this.apiBaseUrl}/portfolio`)
      .pipe(
        switchMap((portfolio) => (portfolio.nombre ? of(portfolio) : localData$)),
        catchError(() => localData$)
      );
  }
}
