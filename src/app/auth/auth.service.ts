import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  API_ENDPOINTS,
  APP_ROUTES,
  CommonHttpService,
  IHttpResponse,
  IUserDetails,
  SESSION_KEYS,
} from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private commonHttpClient: CommonHttpService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  loginWithGoogle() {
    return this.commonHttpClient.get(API_ENDPOINTS.auth.googleLogin);
  }

  verifyGoogleCode(code: string, seed: string): Observable<IHttpResponse<IUserDetails>> {
    return this.commonHttpClient.get<IHttpResponse<IUserDetails>>(
      API_ENDPOINTS.auth.verifyCode(code, seed)
    );
  }

  set userData(userData: IUserDetails) {
    sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(userData));
  }

  get userData(): IUserDetails {
    return JSON.parse(sessionStorage.getItem(SESSION_KEYS.USER) ?? '');
  }

  private storeTokens(tokens: { accessToken: string; refreshToken: string }) {
    sessionStorage.setItem(SESSION_KEYS.TOKEN, tokens.accessToken);
    sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  logout() {
    this.commonHttpClient
      .post(API_ENDPOINTS.auth.logout, {
        refreshToken: this.refreshToken,
      })
      .subscribe({
        next: () => {
          console.log('LOGOUT SUCCESSFUL!');
          sessionStorage.clear();
          this.toastrService.success('Logged out successfully!');
          this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
        },
      });
  }

  login(email: string, password: string) {
    return this.commonHttpClient.post<IHttpResponse<IUserDetails>>(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
  }

  signupUser(userDetails: { name: string; password: string; email: string }) {
    return this.commonHttpClient.post<IHttpResponse<IUserDetails>>(
      API_ENDPOINTS.auth.signup,
      userDetails
    );
  }

  refresh() {
    const refreshToken = sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);

    return this.commonHttpClient
      .post<{ accessToken: string; refreshToken: string }>(API_ENDPOINTS.auth.refresh, {
        refreshToken,
      })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  set token(authToken: string) {
    sessionStorage.setItem(SESSION_KEYS.TOKEN, authToken);
  }

  set refreshToken(token: string) {
    sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, token);
  }

  get refreshToken(): string {
    return sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN) as string;
  }
}
