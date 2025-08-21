import { TemplateRef } from '@angular/core';

export type PopupAnimationType = 'fade' | 'slide' | 'cubic';

export type PopupThemeType =
  | 'default'
  | 'warning'
  | 'success'
  | 'error'
  | 'light';

export interface IPopupOpenData {
  text?: string;
  template?: TemplateRef<any>;
  templateContext?: object;
  theme?: PopupThemeType;
  animation?: PopupAnimationType;
  customClass?: string;
  parentSelector?: string;
  timeout?: number | null;
  animationDuration?: number;
  customWrapperClass?: string;
  closeByMouseUp?: boolean;
}
