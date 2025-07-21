import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsFacadeService } from './services';

// Pages
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';

/**
 * Events Feature Module
 * Módulo para funcionalidades relacionadas a eventos
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    EventListComponent,
    EventFormComponent,
    EventDetailComponent
  ],
  declarations: [],
  providers: [
    EventsFacadeService
  ]
})
export class EventsModule { }
