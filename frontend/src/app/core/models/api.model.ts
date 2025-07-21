/**
 * Modelos de resposta da API
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

/**
 * Modelo de erro da API
 */
export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Resposta paginada genérica
 */
export interface PagedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}
