import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Création des mocks
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});