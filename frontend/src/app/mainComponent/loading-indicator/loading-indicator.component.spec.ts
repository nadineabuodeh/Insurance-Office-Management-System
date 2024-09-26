import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { LoadingService } from '../../service/loading.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let router: Router;

  beforeEach(async () => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['loading$']);

    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent, RouterTestingModule, MatProgressSpinnerModule],
      providers: [{ provide: LoadingService, useValue: loadingServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    router = TestBed.inject(Router);
    loadingService.loading$ = of(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.spinner-container')).toBeTruthy();
  });
});