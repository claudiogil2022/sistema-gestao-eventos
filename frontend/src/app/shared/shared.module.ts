import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

// Shared Components
import { 
  LoadingComponent,
  ErrorMessageComponent,
  ConfirmationDialogComponent,
  ConfirmButtonComponent
} from './components';

// Shared Pipes
import { TruncatePipe } from './pipes';

const ANGULAR_MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatCheckboxModule,
  MatRadioModule
];

const SHARED_COMPONENTS = [
  LoadingComponent,
  ErrorMessageComponent,
  ConfirmationDialogComponent,
  ConfirmButtonComponent
];

const SHARED_PIPES = [
  TruncatePipe
];

/**
 * Shared Module - Contém componentes, diretivas e pipes reutilizáveis
 * Pode ser importado por qualquer feature module
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...ANGULAR_MATERIAL_MODULES,
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...ANGULAR_MATERIAL_MODULES,
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES
  ]
})
export class SharedModule { }
