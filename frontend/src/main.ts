import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

// Bootstrap da aplicação Angular
platformBrowser()
  .bootstrapModule(AppModule)
  .then(() => {
    console.log('🚀 Angular carregado com sucesso');
  })
  .catch(err => {
    // Filtrar erros de overlay
    const errorMessage = String(err);
    if (!errorMessage.includes('removeOverlay') && 
        !errorMessage.includes('removeChild')) {
      console.error(err);
    }
  });
