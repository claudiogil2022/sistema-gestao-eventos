import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  },
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/events'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Para debugging, mude para true se necessário
    preloadingStrategy: undefined // Lazy loading sem preload
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
