import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Evento } from '../../../../core/models';
import { EventoService } from '../../../../core/services';

/**
 * Componente simples para exibir detalhes de um evento
 */
@Component({
  selector: 'app-event-detail-simple',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <!-- Loading -->
      <div *ngIf="isLoading" class="loading">
        <p>Carregando...</p>
      </div>

      <!-- Error -->
      <div *ngIf="errorMessage && !isLoading" class="error">
        <mat-card>
          <mat-card-content>
            <h3>Erro</h3>
            <p>{{ errorMessage }}</p>
            <button mat-raised-button color="primary" (click)="loadEvent()">
              Tentar Novamente
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Event Details -->
      <div *ngIf="evento && !isLoading && !errorMessage" class="event-details">
        <div class="header">
          <button mat-button (click)="onBack()">
            <mat-icon>arrow_back</mat-icon>
            Voltar
          </button>
        </div>

        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ evento.titulo }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Descrição:</strong> {{ evento.descricao }}</p>
            <p><strong>Data/Hora:</strong> {{ formatDate(evento.dataHoraEvento) }}</p>
            <p><strong>Local:</strong> {{ evento.local }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="onEdit()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="onDelete()">
              <mat-icon>delete</mat-icon>
              Excluir
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .loading, .error {
      text-align: center;
      padding: 20px;
    }

    .header {
      margin-bottom: 20px;
    }

    .event-details mat-card {
      margin-bottom: 20px;
    }
  `]
})
export class EventDetailSimpleComponent implements OnInit {
  evento: Evento | null = null;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('EventDetailSimple - Parâmetro ID recebido:', id);
    console.log('EventDetailSimple - URL atual:', window.location.href);
    this.eventId = Number(id);
    
    if (!this.eventId || isNaN(this.eventId) || this.eventId <= 0) {
      console.log('EventDetailSimple - ID inválido detectado:', this.eventId);
      this.errorMessage = 'ID do evento inválido';
      return;
    }
    
    this.loadEvent();
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.eventoService.getEventById(this.eventId).subscribe({
      next: (evento: Evento) => {
        this.evento = evento;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Erro ao carregar evento:', error);
        
        if (error.status === 404) {
          this.errorMessage = `Evento com ID ${this.eventId} não foi encontrado`;
        } else if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor';
        } else {
          this.errorMessage = 'Erro ao carregar detalhes do evento';
        }
      }
    });
  }

  onEdit(): void {
    if (this.eventId) {
      this.router.navigate(['/events', this.eventId, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.evento || !this.eventId) return;

    const confirmed = confirm(`Excluir o evento "${this.evento.titulo}"?`);
    
    if (confirmed) {
      this.isLoading = true;
      
      this.eventoService.deleteEvent(this.eventId).subscribe({
        next: () => {
          alert('Evento excluído com sucesso!');
          this.router.navigate(['/events']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erro ao excluir evento:', error);
          alert('Erro ao excluir evento');
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não informada';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Erro na data';
    }
  }
}
