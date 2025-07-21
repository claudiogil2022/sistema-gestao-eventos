import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { Evento } from '../../../../core/models';
import { NotificationService, OverlayCleanupService } from '../../../../core/services';
import { EventsFacadeService } from '../../services/events-facade.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { EventoStatusPipe } from '../../../../shared/pipes/evento-status.pipe';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
    ErrorMessageComponent,
    EventoStatusPipe
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
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private overlayCleanup: OverlayCleanupService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.params['id']);
    if (this.eventId) {
      this.loadEvent();
    }
  }

  ngOnDestroy(): void {
    // Limpeza robusta de overlays e dialogs
    this.overlayCleanup.cleanupAll();
    
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
          this.errorMessage = 'Erro ao carregar detalhes do evento';
          this.isLoading = false;
          console.error('Erro ao carregar evento:', error);
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

    // Fechar qualquer dialog aberto antes de abrir um novo
    this.dialog.closeAll();
    
    // Aguardar um tick para garantir que o overlay anterior foi removido
    setTimeout(() => {
      const dialogData: ConfirmationDialogData = {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o evento "${this.evento?.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: false,
        hasBackdrop: true,
        panelClass: 'confirmation-dialog'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.eventId) {
          this.deleteEvent();
        }
      });
    }, 100);
  }

  private deleteEvent(): void {
    if (!this.eventId) return;

    this.eventsFacade.deleteEvent(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Evento excluído com sucesso!');
          this.router.navigate(['/events']);
        },
        error: (error: any) => {
          this.notificationService.error('Erro ao excluir evento');
          console.error('Erro ao excluir evento:', error);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/events']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ATIVO':
        return 'primary';
      case 'FINALIZADO':
        return 'accent';
      case 'CANCELADO':
        return 'warn';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

