import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { Subject, timer, takeUntil } from 'rxjs';
import { PopupAnimationType, PopupThemeType } from './utils/types';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-ap-popup',
  imports: [NgIf, NgClass, NgTemplateOutlet],
  templateUrl: './ap-popup.component.html',
  styleUrls: ['./ap-popup.component.scss'],
})
export class ApPopupComponent {
  @Input() public text?: string;
  @Input() public template?: TemplateRef<any>;
  @Input() public templateContext: object = {};

  @Input() public theme: PopupThemeType = 'default';
  @Input() public animation: PopupAnimationType = 'cubic';
  @Input() public animationDuration = 900;
  @Input() public animationHideDuration = 900;
  @Input() public timeout: number | null = 3000;
  @Input() public parentSelector: string | null = null;
  @Input() public closeByMouseUp = true;

  @Input() public customClass?: string;
  @Input() public customWrapperClass?: string;
  @Input() public zIndex?: number;

  @Output() public remove = new EventEmitter<void>();

  public hideAnimation?: string;
  public distanceToPageTop = 0;
  public id?: number;

  protected readonly cubicBezierFunctionIn = 'cubic-bezier(0, 1.82, 0.46, 0.84)';
  protected readonly cubicBezierFunctionOut = 'cubic-bezier(0.42, -0.65, 0.27, 0.93)';

  private readonly _close$ = new Subject<void>();

  @HostBinding('style.transition') public get getHostTransition(): string {
    let timingFunction = 'linear';

    if (this.animation === 'cubic') {
      timingFunction = this.cubicBezierFunctionIn;
    }

    return `all ${timingFunction} ${this.animationDuration}ms`;
  }

  @HostBinding('style.zIndex') public get getZIndex(): string {
    return this.zIndex?.toString() || '1';
  }

  @HostBinding('style.cursor') public get getCursor(): string {
    return this.closeByMouseUp ? 'pointer' : 'default';
  }

  public constructor(public readonly elementRef: ElementRef) {}

  public ngOnInit(): void {
    if (!this.timeout) return;

    timer(this.timeout)
      .pipe(takeUntil(this._close$))
      .subscribe(() => {
        this._startHideAnimation();
      });
  }

  public ngOnDestroy(): void {
    this._close$.complete();
  }

  public onMouseUp(): void {
    if (!this.closeByMouseUp) return;

    this.close();
  }

  public close(): void {
    this.zIndex = 999;
    this._close$.next();
    this._startHideAnimation();
  }

  public updateDistanceTop(): void {
    this.distanceToPageTop = this._getDistanceFromBottomToPageTop(this.elementRef.nativeElement);
  }

  private _startHideAnimation(): void {
    this.updateDistanceTop();
    this.hideAnimation = `${this.animation}-out`;
    this.remove.emit();
  }

  private _getDistanceFromBottomToPageTop(element: HTMLElement): number {
    return element.getBoundingClientRect().bottom;
  }
}
