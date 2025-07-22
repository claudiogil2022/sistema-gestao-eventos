import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Evento } from '../../../../core/models';
import { NotificationService } from '../../../../core/services';
import { EventsFacadeService } from '../../services/events-facade.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

/**
 * Componente para exibir detalhes de um evento
 */
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingComponent,
    ErrorMessageComponent
  ],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  evento: Evento | null = null;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsFacade: EventsFacadeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.params['id']);
    
    if (!this.eventId || isNaN(this.eventId) || this.eventId <= 0) {
      this.errorMessage = 'ID do evento inválido';
      return;
    }
    
    this.loadEvent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.eventsFacade.loadEvent(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
            this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
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
    if (!this.evento) return;

    const confirmed = confirm(`Tem certeza que deseja excluir o evento "${this.evento.titulo}"?`);
    
    if (confirmed && this.eventId) {
      this.deleteEvent();
    }
  }

  private deleteEvent(): void {
    if (!this.eventId) return;

    this.isLoading = true;
    
    this.eventsFacade.deleteEvent(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.success('Evento excluído com sucesso!');
          // Aguardar um pouco antes de navegar para garantir que a mensagem seja vista
          setTimeout(() => {
            this.router.navigate(['/events']);
          }, 1000);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erro ao excluir evento:', error);
          
          let errorMessage = 'Erro ao excluir evento';
          if (error.status === 404) {
            errorMessage = 'Evento não encontrado';
          } else if (error.status === 403) {
            errorMessage = 'Sem permissão para excluir este evento';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.notificationService.error(errorMessage);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não informada';
    
    try {
      const date = new Date(dateString);
      
      // Verificar se a data é válida
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
      console.error('Erro ao formatar data:', error);
      return 'Erro na data';
    }
  }
}

