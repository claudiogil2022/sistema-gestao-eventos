import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('event-manager-frontend');

  ngOnInit(): void {
    // App inicializado sem interceptadores de overlay
    console.log('Event Manager App iniciado');
  }
}
