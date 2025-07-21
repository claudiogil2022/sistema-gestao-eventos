import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventoService } from '../../../core/services';
import { 
  Evento, 
  EventoCreateRequest, 
  EventoUpdateRequest, 
  PagedResponse, 
  PaginationParams 
} from '../../../core/models';

/**
 * Facade service para operações de eventos
 * Encapsula a lógica de negócio específica do módulo de eventos
 */
@Injectable()
export class EventsFacadeService {

  constructor(private eventoService: EventoService) {}

  /**
   * Carrega eventos com paginação
   */
  loadEvents(params?: PaginationParams): Observable<PagedResponse<Evento>> {
    return this.eventoService.getEvents(params);
  }

  /**
   * Carrega um evento específico
   */
  loadEvent(id: number): Observable<Evento> {
    return this.eventoService.getEventById(id);
  }

  /**
   * Cria um novo evento
   */
  createEvent(evento: EventoCreateRequest): Observable<Evento> {
    return this.eventoService.createEvent(evento);
  }

  /**
   * Atualiza um evento existente
   */
  updateEvent(id: number, evento: EventoUpdateRequest): Observable<Evento> {
    return this.eventoService.updateEvent(id, evento);
  }

  /**
   * Remove um evento
   */
  deleteEvent(id: number): Observable<void> {
    return this.eventoService.deleteEvent(id);
  }

  /**
   * Busca eventos por termo
   */
  searchEvents(searchTerm: string, params?: PaginationParams): Observable<PagedResponse<Evento>> {
    return this.eventoService.searchEvents(searchTerm, params);
  }
}
