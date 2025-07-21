import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Interface para dados do diálogo de confirmação
 */
export interface ConfirmationDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

/**
 * Diálogo de confirmação reutilizável
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <h1 mat-dialog-title>{{ dialogTitle }}</h1>
    <div mat-dialog-content>
      <p>{{ dialogMessage }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ dialogCancelText }}</button>
      <button mat-raised-button [color]="dialogConfirmColor" (click)="onConfirm()">
        {{ dialogConfirmText }}
      </button>
    </div>
  `
})
export class ConfirmationDialogComponent {
  dialogTitle: string = 'Confirmar';
  dialogMessage: string = 'Tem certeza?';
  dialogConfirmText: string = 'Confirmar';
  dialogCancelText: string = 'Cancelar';
  dialogConfirmColor: 'primary' | 'accent' | 'warn' = 'primary';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    // Inicializar propriedades do data se fornecido
    if (data) {
      this.dialogTitle = data.title || this.dialogTitle;
      this.dialogMessage = data.message || this.dialogMessage;
      this.dialogConfirmText = data.confirmText || this.dialogConfirmText;
      this.dialogCancelText = data.cancelText || this.dialogCancelText;
      this.dialogConfirmColor = data.confirmColor || this.dialogConfirmColor;
    }
  }

  onConfirm(): void {
    // Garantir que o dialog é fechado corretamente
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Garantir que o dialog é fechado corretamente
    this.dialogRef.close(false);
  }
}

/**
 * Botão de confirmação que abre um diálogo
 */
@Component({
  selector: 'app-confirm-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <button
      mat-button
      [color]="color"
      [matTooltip]="tooltip"
      (click)="openConfirmDialog()">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      <span *ngIf="text">{{ text }}</span>
    </button>
  `
})
export class ConfirmButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() tooltip: string = '';
  @Input() confirmTitle: string = 'Confirmar';
  @Input() confirmMessage: string = 'Tem certeza?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Output() confirmed = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  openConfirmDialog(): void {
    const dialogData: ConfirmationDialogData = {
      title: this.confirmTitle,
      message: this.confirmMessage,
      confirmText: this.confirmText,
      cancelText: this.cancelText,
      confirmColor: this.color
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmed.emit();
      }
    });
  }
}
