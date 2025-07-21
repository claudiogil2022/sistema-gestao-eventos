import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente para exibir mensagens de erro de forma consistente
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="error-card">
      <mat-card-content>
        <div class="error-content">
          <mat-icon class="error-icon">error</mat-icon>
          <h3 class="error-title">{{ title }}</h3>
          <p class="error-message">{{ message }}</p>
          <button
            mat-raised-button
            color="primary"
            *ngIf="showRetry"
            (click)="onRetry()">
            <mat-icon>refresh</mat-icon>
            Tentar Novamente
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .error-card {
      margin: 20px;
      background-color: #ffebee;
      border-left: 4px solid #f44336;
    }

    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px;
    }

    .error-icon {
      color: #f44336;
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .error-title {
      color: #c62828;
      margin-bottom: 8px;
    }

    .error-message {
      color: #666;
      margin-bottom: 20px;
      max-width: 400px;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() title: string = 'Ops! Algo deu errado';
  @Input() message: string = 'Ocorreu um erro inesperado. Tente novamente.';
  @Input() retry: boolean = false;
  @Output() retryEvent = new EventEmitter<void>();

  get showRetry(): boolean {
    return this.retry;
  }

  onRetry(): void {
    this.retryEvent.emit();
  }
}
