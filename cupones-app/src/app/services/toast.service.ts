import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async showToast(message: string, color: string = 'success', duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'bottom',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  async showSuccess(message: string) {
    await this.showToast(message, 'success');
  }

  async showError(message: string) {
    await this.showToast(message, 'danger');
  }

  async showWarning(message: string) {
    await this.showToast(message, 'warning');
  }

  async showInfo(message: string) {
    await this.showToast(message, 'primary');
  }

  async showCustom(message: string, color: string = 'medium', duration: number = 3000) {
    await this.showToast(message, color, duration);
  }
}