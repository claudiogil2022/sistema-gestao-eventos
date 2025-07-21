import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Evento, 
  EventoCreateRequest, 
  EventoUpdateRequest, 
  PagedResponse,
  PaginationParams 
} from '../models';

/**
 * Serviço centralizado para operações com eventos
 * Implementa todas as operações CRUD e comunicação com a API
 */
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os eventos com paginação
   */
  getEvents(params?: PaginationParams): Observable<PagedResponse<Evento>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.direction) httpParams = httpParams.set('direction', params.direction);
    }

    return this.http.get<PagedResponse<Evento>>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca um evento por ID
   */
  getEventById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cria um novo evento
   */
  createEvent(evento: EventoCreateRequest): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Atualiza um evento existente
   */
  updateEvent(id: number, evento: EventoUpdateRequest): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Remove um evento
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca eventos por filtros
   */
  searchEvents(searchTerm: string, params?: PaginationParams): Observable<PagedResponse<Evento>> {
    let httpParams = new HttpParams().set('search', searchTerm);
    
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.direction) httpParams = httpParams.set('direction', params.direction);
    }

    return this.http.get<PagedResponse<Evento>>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(error: any): Observable<never> {
    console.error('Erro no EventoService:', error);
    
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
