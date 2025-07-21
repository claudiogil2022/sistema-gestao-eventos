import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventoService as CoreEventoService } from '../../../core/services/evento.service';
import { 
  Evento, 
  EventoCreateRequest, 
  EventoUpdateRequest, 
  PagedResponse,
  PaginationParams 
} from '../../../core/models';

/**
 * Serviço específico da feature de eventos
 * Pode conter lógica adicional específica da feature
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private eventoService: CoreEventoService) {}

  /**
   * Busca eventos com configurações específicas da feature
   */
  getEventsList(params?: PaginationParams): Observable<PagedResponse<Evento>> {
    return this.eventoService.getEvents(params);
  }

  /**
   * Cria evento com validações específicas da feature
   */
  createEvent(evento: EventoCreateRequest): Observable<Evento> {
    // Aqui podem ser adicionadas validações específicas da feature
    return this.eventoService.createEvent(evento);
  }

  /**
   * Atualiza evento
   */
  updateEvent(id: number, evento: EventoUpdateRequest): Observable<Evento> {
    return this.eventoService.updateEvent(id, evento);
  }

  /**
   * Remove evento
   */
  deleteEvent(id: number): Observable<void> {
    return this.eventoService.deleteEvent(id);
  }

  /**
   * Busca evento por ID
   */
  getEventById(id: number): Observable<Evento> {
    return this.eventoService.getEventById(id);
  }

  /**
   * Busca eventos por termo
   */
  searchEvents(searchTerm: string, params?: PaginationParams): Observable<PagedResponse<Evento>> {
    return this.eventoService.searchEvents(searchTerm, params);
  }
}
