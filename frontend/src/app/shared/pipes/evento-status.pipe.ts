import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatar status de eventos
 */
@Pipe({
  name: 'eventoStatus',
  standalone: true
})
export class EventoStatusPipe implements PipeTransform {

  transform(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ATIVO':
        return 'Ativo';
      case 'CANCELADO':
        return 'Cancelado';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return status || 'Indefinido';
    }
  }
}
