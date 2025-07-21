import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Evento, PagedResponse } from '../../../../core/models';
import { LoadingService, NotificationService, OverlayCleanupService } from '../../../../core/services';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EventsFacadeService } from '../../services/events-facade.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { EventoStatusPipe } from '../../../../shared/pipes/evento-status.pipe';

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
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    LoadingComponent,
    ErrorMessageComponent,
    TruncatePipe,
    EventoStatusPipe
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

  displayedColumns: string[] = ['nome', 'data', 'local', 'status', 'actions'];

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
    // Limpeza robusta de overlays e dialogs
    this.overlayCleanup.cleanupAll();
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    // Limpeza preventiva de overlays antes de iniciar carregamento
    this.overlayCleanup.cleanupAll();
    
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
    // Fechar qualquer dialog aberto antes de abrir um novo
    this.dialog.closeAll();
    
    // Aguardar um tick para garantir que o overlay anterior foi removido
    setTimeout(() => {
      const dialogData: ConfirmationDialogData = {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o evento "${event.nome}"? Esta ação não pode ser desfeita.`,
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

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed && event.id) {
          this.deleteEvent(event.id);
        }
      });
    }, 100);
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
}
