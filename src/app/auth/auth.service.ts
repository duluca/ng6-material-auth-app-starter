import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as decode from 'jwt-decode'
import { BehaviorSubject, Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { transformError } from '../common/common'
import { CacheService } from './cache.service'
import { Role } from './role.enum'

export interface IAuthService {
  authStatus: BehaviorSubject<IAuthStatus>
  login(email: string, password: string): Observable<IAuthStatus>
  logout()
  getToken(): string
}

export interface IAuthStatus {
  isAuthenticated: boolean
  userRole: Role
  userId: string
}

interface IServerAuthResponse {
  accessToken: string
}

export const defaultAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: null,
}

@Injectable()
export class AuthService extends CacheService implements IAuthService {
  private readonly authProvider: (
    email: string,
    password: string
  ) => Observable<IServerAuthResponse>
  authStatus = new BehaviorSubject<IAuthStatus>(
    this.getItem('authStatus') || defaultAuthStatus
  )

  constructor(private httpClient: HttpClient) {
    super()
    this.authStatus.subscribe(authStatus => this.setItem('authStatus', authStatus))
    // Fake login function to simulate roles
    // Example of a real login call to server-side
    this.authProvider = this.exampleAuthProvider
  }

  login(email: string, password: string): Observable<IAuthStatus> {
    this.logout()

    const loginResponse = this.authProvider(email, password).pipe(
      map(value => {
        this.setToken(value.accessToken)
        return decode(value.accessToken) as IAuthStatus
      }),
      catchError(transformError)
    )

    loginResponse.subscribe(
      res => {
        this.authStatus.next(res)
      },
      err => {
        this.logout()
        return observableThrowError(err)
      }
    )

    return loginResponse
  }

  private exampleAuthProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    return this.httpClient.post<IServerAuthResponse>(`${environment.baseUrl}/v1/login`, {
      email: email,
      password: password,
    })
  }

  logout() {
    this.clearToken()
    this.authStatus.next(defaultAuthStatus)
  }

  private setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }

  private getDecodedToken(): IAuthStatus {
    return decode(this.getItem('jwt'))
  }

  getToken(): string {
    return this.getItem('jwt') || ''
  }

  private clearToken() {
    this.removeItem('jwt')
  }
}
