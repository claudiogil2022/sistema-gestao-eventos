import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';

/**
 * Rotas do módulo de eventos
 * /events - lista paginada
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
    path: ':id',
    loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/event-form/event-form.component').then(m => m.EventFormComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
