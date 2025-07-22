import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';

/**
 * Rotas do módulo de eventos
 * /events - lista paginada
 * /events/manager - nova tela de gestão funcional
 * /events/new - formulário de criação  
 * /events/:id/edit - formulário de edição
 * /events/:id - detalhes
 */
const routes: Routes = [
  {
    path: '',
    component: EventListComponent,
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: 'manager',
    loadComponent: () => import('./pages/event-manager/event-manager.component').then(m => m.EventManagerComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/event-detail-simple/event-detail-simple.component').then(m => m.EventDetailSimpleComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
