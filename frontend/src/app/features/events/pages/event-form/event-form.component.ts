import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Evento, EventoCreateRequest, EventoUpdateRequest } from '../../../../core/models';
import { LoadingService, NotificationService } from '../../../../core/services';
import { EventsFacadeService } from '../../services/events-facade.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

/**
 * Componente para criar/editar eventos
 */
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    LoadingComponent,
    ErrorMessageComponent
  ],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private eventsFacade: EventsFacadeService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    console.log('EventForm - Parâmetro ID recebido:', this.eventId);
    console.log('EventForm - URL atual:', window.location.href);
    this.isEditMode = !!this.eventId;
    console.log('EventForm - Modo de edição:', this.isEditMode);

    if (this.isEditMode) {
      this.loadEvent();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      dataEvento: ['', [Validators.required]],
      horaEvento: ['', [Validators.required]],
      local: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.eventsFacade.loadEvent(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (evento: Evento) => {
          this.populateForm(evento);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Erro ao carregar evento';
          this.isLoading = false;
          this.notificationService.error('Erro ao carregar evento');
          console.error('Erro ao carregar evento:', error);
        }
      });
  }

  private populateForm(evento: Evento): void {
    // Separar data e hora
    const dataEvento = new Date(evento.dataHoraEvento);
    const hora = dataEvento.toTimeString().slice(0, 5); // HH:MM

    this.eventForm.patchValue({
      titulo: evento.titulo,
      descricao: evento.descricao || '',
      dataEvento: dataEvento,
      horaEvento: hora,
      local: evento.local
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.eventForm.value;
    
    if (this.isEditMode) {
      // Combinar data e hora
      const dataHoraEvento = this.combinarDataHora(formValue.dataEvento, formValue.horaEvento);
      
      const eventoUpdate: EventoUpdateRequest = {
        titulo: formValue.titulo,
        descricao: formValue.descricao,
        dataHoraEvento: dataHoraEvento.toISOString(),
        local: formValue.local
      };

      this.eventsFacade.updateEvent(this.eventId!, eventoUpdate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Evento atualizado com sucesso!');
            this.router.navigate(['/events']);
          },
          error: (error: any) => {
            this.errorMessage = 'Erro ao atualizar evento';
            this.isSaving = false;
            console.error('Erro ao atualizar evento:', error);
          }
        });
    } else {
      // Combinar data e hora
      const dataHoraEvento = this.combinarDataHora(formValue.dataEvento, formValue.horaEvento);
      
      const eventoCreate: EventoCreateRequest = {
        titulo: formValue.titulo,
        descricao: formValue.descricao,
        dataHoraEvento: dataHoraEvento.toISOString(),
        local: formValue.local
      };

      this.eventsFacade.createEvent(eventoCreate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Evento criado com sucesso!');
            this.router.navigate(['/events']);
          },
          error: (error: any) => {
            this.errorMessage = 'Erro ao criar evento';
            this.isSaving = false;
            console.error('Erro ao criar evento:', error);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        switch(fieldName) {
          case 'titulo': return 'Nome do evento é obrigatório';
          case 'dataEvento': return 'Data do evento é obrigatória';
          case 'horaEvento': return 'Horário do evento é obrigatório';
          case 'local': return 'Local do evento é obrigatório';
          default: return `${fieldName} é obrigatório`;
        }
      }
      if (control.errors['minlength']) return `${fieldName} deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `${fieldName} deve ter no máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `${fieldName} deve ser maior que ${control.errors['min'].min}`;
      if (control.errors['max']) return `${fieldName} deve ser menor que ${control.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.eventForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  private combinarDataHora(data: Date, hora: string): Date {
    const [horas, minutos] = hora.split(':').map(Number);
    const dataCompleta = new Date(data);
    dataCompleta.setHours(horas, minutos, 0, 0);
    return dataCompleta;
  }
}

