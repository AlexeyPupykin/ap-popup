import { Component, inject } from '@angular/core';
import { ApPopupService } from '../../../ap-popup/src/lib/ap-popup.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _popupService = inject(ApPopupService);

  title = 'sandbox';

  public openPopup(): void {
    this._popupService.openPopup({ text: 'text' });
  }
}
