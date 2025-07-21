/**
 * Interface principal para representar um Evento
 * Centraliza a definição do modelo de dados
 */
export interface Evento {
  id?: number;
  titulo: string;
  dataHoraEvento: string; // ISO date string
  local: string;
  descricao?: string;
  organizador?: string;
  capacidade?: number;
  status?: 'ATIVO' | 'CANCELADO' | 'FINALIZADO';
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para criação de eventos
 */
export interface EventoCreateRequest {
  titulo: string;
  dataHoraEvento: string;
  local: string;
  descricao?: string;
  organizador?: string;
  capacidade?: number;
}

/**
 * DTO para atualização de eventos
 */
export interface EventoUpdateRequest extends Partial<EventoCreateRequest> {
  status?: 'ATIVO' | 'CANCELADO' | 'FINALIZADO';
}

/**
 * Resposta paginada para listagem de eventos
 */
export interface EventoPaginatedResponse {
  content: Evento[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
