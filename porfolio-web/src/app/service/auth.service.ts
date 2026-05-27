import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AdminUser } from '../models/admin-user.model';

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleAccountsApi {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: string;
          size?: string;
          type?: string;
          shape?: string;
          text?: string;
          locale?: string;
          width?: number;
        }
      ) => void;
      disableAutoSelect: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleAccountsApi;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly storageKey = 'portfolio-admin-session';
  private readonly userSubject = new BehaviorSubject<AdminUser | null>(null);
  private initialized = false;

  readonly user$ = this.userSubject.asObservable();
  readonly isAdmin$ = this.user$.pipe(
    map((user) => Boolean(user)),
    distinctUntilChanged()
  );

  constructor(private zone: NgZone, private http: HttpClient) {
    this.restoreSession();
  }

  get isConfigured(): boolean {
    return environment.googleClientId.endsWith('.apps.googleusercontent.com');
  }

  get isGoogleReady(): boolean {
    return Boolean(this.googleApi);
  }

  get currentCredential(): string | null {
    return this.userSubject.value?.credential ?? null;
  }

  renderGoogleButton(container: HTMLElement): boolean {
    const googleApi = this.googleApi;

    if (!this.isConfigured || !googleApi) {
      return false;
    }

    if (!this.initialized) {
      googleApi.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      this.initialized = true;
    }

    googleApi.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      locale: 'es',
      width: 280,
    });

    return true;
  }

  signOut(): void {
    this.googleApi?.accounts.id.disableAutoSelect();
    window.sessionStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  private readonly handleCredentialResponse = (
    response: GoogleCredentialResponse
  ): void => {
    if (!response.credential) {
      return;
    }

    const user = this.parseCredential(response.credential);

    if (!user || !this.apiBaseUrl) {
      this.zone.run(() => this.userSubject.next(null));
      return;
    }

    this.http
      .get<{ ok: boolean }>(`${this.apiBaseUrl}/auth/session`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${user.credential}` }),
      })
      .subscribe({
        next: () =>
          this.zone.run(() => {
            this.storeSession(user);
            this.userSubject.next(user);
          }),
        error: () =>
          this.zone.run(() => {
            window.sessionStorage.removeItem(this.storageKey);
            this.userSubject.next(null);
          }),
      });
  };

  private restoreSession(): void {
    const rawSession = window.sessionStorage.getItem(this.storageKey);

    if (!rawSession) {
      return;
    }

    try {
      const user = JSON.parse(rawSession) as AdminUser;
      const nowInSeconds = Math.floor(Date.now() / 1000);

      if (!user.credential || (user.expiresAt && user.expiresAt <= nowInSeconds)) {
        window.sessionStorage.removeItem(this.storageKey);
        return;
      }

      this.userSubject.next(user);
      this.validateStoredSession(user);
    } catch {
      window.sessionStorage.removeItem(this.storageKey);
    }
  }

  private validateStoredSession(user: AdminUser): void {
    if (!this.apiBaseUrl) {
      return;
    }

    this.http
      .get<{ ok: boolean }>(`${this.apiBaseUrl}/auth/session`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${user.credential}` }),
      })
      .subscribe({
        error: () => {
          window.sessionStorage.removeItem(this.storageKey);
          this.userSubject.next(null);
        },
      });
  }

  private storeSession(user: AdminUser): void {
    window.sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private parseCredential(credential: string): AdminUser | null {
    const payload = credential.split('.')[1];

    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = this.normalizeBase64Url(payload);
      const decodedPayload = decodeURIComponent(
        atob(normalizedPayload)
          .split('')
          .map((character) => {
            return `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`;
          })
          .join('')
      );
      const profile = JSON.parse(decodedPayload) as {
        email?: string;
        name?: string;
        picture?: string;
        exp?: number;
      };

      if (!profile.email) {
        return null;
      }

      return {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        credential,
        expiresAt: profile.exp,
      };
    } catch {
      return null;
    }
  }

  private normalizeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;

    return padding ? normalized.padEnd(normalized.length + 4 - padding, '=') : normalized;
  }

  private get googleApi(): GoogleAccountsApi | null {
    return window.google ?? null;
  }
}
