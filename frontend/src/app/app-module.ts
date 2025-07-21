import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Core Module
import { CoreModule } from './core';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Routing
import { AppRoutingModule } from './app-routing-module';

// Main App Component
import { App } from './app';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Core module (singleton services)
    CoreModule,
    
    // Shared module (common components)
    SharedModule,
    
    // App routing (must be last)
    AppRoutingModule
  ],
  bootstrap: [App]
})
export class AppModule { }
