import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

/**
 * Componente de loading reutilizável
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="loading-container" *ngIf="loading">
      <mat-card class="loading-card" [class.overlay-style]="overlay">
        <mat-card-content>
          <div class="loading-content">
            <mat-spinner [diameter]="size"></mat-spinner>
            <p class="loading-text" *ngIf="message">{{ message }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      padding: 20px;
    }

    .loading-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 300px;
    }

    .loading-card.overlay-style {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      background: rgba(255, 255, 255, 0.95);
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    .loading-text {
      margin-top: 16px;
      color: #666;
      text-align: center;
    }
  `]
})
export class LoadingComponent {
  @Input() message: string = 'Carregando...';
  @Input() size: number = 40;
  @Input() overlay: boolean = false;
  @Input() loading: boolean = false;
}
