import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://porfolio-web-fe382.web.app/Contacto'; // Ajusta esta URL a la correcta

  constructor(private http: HttpClient) { }

  sendEmail(emailData: { to: string, subject: string, text: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, emailData, { headers });
  }
}
