import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EventsFacadeService } from '../../services/events-facade.service';
import { Evento } from '../../../../core/models/evento.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-event-manager',
  templateUrl: './event-manager.component.html',
  styleUrls: ['./event-manager.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class EventManagerComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<Evento>;
  
  events: Evento[] = [];
  selectedEvent: Evento | null = null;
  eventForm: FormGroup;
  isEditing = false;
  loading = false;
  
  displayedColumns = ['titulo', 'dataHoraEvento', 'local', 'actions'];
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private eventsFacade: EventsFacadeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      dataEvento: ['', Validators.required],
      horaEvento: ['', Validators.required],
      local: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsFacade.loadEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.events = response.content || response;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar eventos:', error);
          this.showMessage('Erro ao carregar eventos', 'error');
          this.loading = false;
        }
      });
  }

  onEventSelect(event: Evento): void {
    this.selectedEvent = event;
    this.isEditing = true;
    
    // Separar data e hora formatando corretamente para DD/MM/AAAA
    const dataEvento = new Date(event.dataHoraEvento);
    
    // Formatar data para DD/MM/AAAA no formato brasileiro
    const dia = String(dataEvento.getDate()).padStart(2, '0');
    const mes = String(dataEvento.getMonth() + 1).padStart(2, '0');
    const ano = dataEvento.getFullYear();
    const dataFormatada = `${ano}-${mes}-${dia}`; // Para input type="date"
    
    const horaFormatada = dataEvento.toTimeString().slice(0, 5);
    
    this.eventForm.patchValue({
      titulo: event.titulo,
      descricao: event.descricao,
      dataEvento: dataFormatada,
      horaEvento: horaFormatada,
      local: event.local
    });
  }

  onNewEvent(): void {
    this.selectedEvent = null;
    this.isEditing = false;
    this.eventForm.reset();
  }

  onSaveEvent(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.eventForm.value;
    const dataHora = this.combinarDataHora(formValue.dataEvento, formValue.horaEvento);
    
    const evento: Partial<Evento> = {
      titulo: formValue.titulo,
      descricao: formValue.descricao,
      dataHoraEvento: dataHora,
      local: formValue.local
    };

    if (this.isEditing && this.selectedEvent) {
      this.updateEvent({ ...evento, id: this.selectedEvent.id } as Evento);
    } else {
      this.createEvent(evento as Evento);
    }
  }

  private createEvent(evento: Evento): void {
    this.loading = true;
    this.eventsFacade.createEvent(evento)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Evento criado com sucesso!', 'success');
          this.onNewEvent();
          this.loadEvents();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao criar evento:', error);
          this.showMessage('Erro ao criar evento', 'error');
          this.loading = false;
        }
      });
  }

  private updateEvent(evento: Evento): void {
    this.loading = true;
    this.eventsFacade.updateEvent(evento.id!, evento)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showMessage('Evento atualizado com sucesso!', 'success');
          this.onNewEvent();
          this.loadEvents();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao atualizar evento:', error);
          this.showMessage('Erro ao atualizar evento', 'error');
          this.loading = false;
        }
      });
  }

  onDeleteEvent(event: Evento): void {
    const confirmed = confirm(`Tem certeza que deseja excluir o evento "${event.titulo}"?`);
    
    if (confirmed && event.id) {
      this.loading = true;
      this.eventsFacade.deleteEvent(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showMessage('Evento excluído com sucesso!', 'success');
            this.loadEvents();
            this.loading = false;
            
            // Se estava editando este evento, limpar o formulário
            if (this.selectedEvent?.id === event.id) {
              this.onNewEvent();
            }
          },
          error: (error: any) => {
            console.error('Erro ao excluir evento:', error);
            this.showMessage('Erro ao excluir evento', 'error');
            this.loading = false;
          }
        });
    }
  }

  onViewEvent(event: Evento): void {
    // Navegar para a página de detalhes do evento
    if (event.id) {
      this.router.navigate(['/events', event.id]);
    }
  }

  private combinarDataHora(data: string, hora: string): string {
    return `${data}T${hora}:00`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} é obrigatório`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} deve ter no máximo ${maxLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} deve ser maior que zero`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      titulo: 'Título',
      descricao: 'Descrição',
      dataEvento: 'Data do evento',
      horaEvento: 'Hora do evento',
      local: 'Local'
    };
    return labels[fieldName] || fieldName;
  }

  formatarDataBrasileira(dataISO: string): string {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
