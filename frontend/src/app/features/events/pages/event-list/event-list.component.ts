import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Evento, PagedResponse } from '../../../../core/models';
import { LoadingService, NotificationService, OverlayCleanupService } from '../../../../core/services';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EventsFacadeService } from '../../services/events-facade.service';

/**
 * Componente para listagem de eventos
 */
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Evento[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private eventsFacade: EventsFacadeService,
    private router: Router,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private overlayCleanup: OverlayCleanupService
  ) {}

  ngOnInit(): void {
    // Aguardar um tick para garantir que o DOM esteja estabilizado
    setTimeout(() => {
      this.loadEvents();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      page: this.currentPage,
      size: this.pageSize
    };

    this.eventsFacade.loadEvents(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedResponse<Evento>) => {
          this.events = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar eventos:', error);
          this.errorMessage = 'Não foi possível carregar os eventos. Tente novamente.';
          this.isLoading = false;
        }
      });
  }

  createNewEvent(): void {
    this.router.navigate(['/events/new']);
  }

  viewEvent(id: number): void {
    this.router.navigate(['/events', id]);
  }

  editEvent(id: number): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  onDeleteEvent(event: Evento): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o evento "${event.titulo}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: false,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && event.id) {
        this.deleteEvent(event.id);
      }
    });
  }

  private deleteEvent(id: number): void {
    this.eventsFacade.deleteEvent(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Evento excluído com sucesso!');
          this.loadEvents();
        },
        error: (error) => {
          console.error('Erro ao excluir evento:', error);
          this.notificationService.error('Não foi possível excluir o evento.');
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEvents();
  }

  // Helper methods for the new UI
  getTotalEvents(): number {
    return this.totalElements;
  }

  getActiveEvents(): number {
    // Considera eventos ativos como aqueles que não foram deletados (todos os que estão na lista)
    return this.events.length;
  }

  getUpcomingEvents(): number {
    return this.events.filter(event => this.getEventStatus(event) === 'upcoming').length;
  }

  getEventStatus(event: Evento): 'active' | 'upcoming' | 'finished' | 'cancelled' {
    const now = new Date();
    const eventDate = new Date(event.dataHoraEvento);
    
    // Lógica baseada apenas na data
    if (eventDate > now) {
      return 'upcoming';
    } else if (eventDate.toDateString() === now.toDateString()) {
      return 'active';
    } else {
      return 'finished';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'play_circle';
      case 'upcoming': return 'schedule';
      case 'finished': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'event';
    }
  }

  formatDateTime(date: string): string {
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return eventDate.toLocaleDateString('pt-BR', options);
  }

  navigateToCreate(): void {
    this.router.navigate(['/events/new']);
  }

  refresh(): void {
    this.loadEvents();
  }
}
