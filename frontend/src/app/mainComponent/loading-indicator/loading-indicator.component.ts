import { Component, Input } from '@angular/core';
import { LoadingService } from '../../service/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.css',
})
export class LoadingIndicatorComponent {
  loading$!: Observable<boolean>;

  @Input() detectRouteTransitions = false;

  constructor(private loadingService: LoadingService, private router: Router) {}

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;

    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof NavigationStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof NavigationEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}
