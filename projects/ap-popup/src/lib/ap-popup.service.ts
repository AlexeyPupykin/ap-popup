import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { take, timer } from 'rxjs';
import { ApPopupComponent } from './ap-popup.component';
import { IPopupOpenData } from './utils/types';

@Injectable({
  providedIn: 'root',
})
export class ApPopupService {
  private _zIndexCounter = 1000;
  private _wrapper: HTMLElement | null = null;

  private _renderer: Renderer2;
  private _popups: ApPopupComponent[] = [];
  private _removingPopupIds = new Set<number>();

  private _customWrapperClass?: string;

  public constructor(
    rendererFactory: RendererFactory2,
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
    private readonly _appRef: ApplicationRef,
    private readonly _injector: Injector,
    @Inject(DOCUMENT) private readonly _document: Document
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  public openPopup(data: IPopupOpenData): ApPopupComponent {
    if (!this._popups.length) {
      if (this._wrapper) {
        this._renderer.removeChild(this._document.body, this._wrapper);
      }

      this._wrapper = null;
    }

    if (!this._wrapper) {
      this._wrapper = this._renderer.createElement('div');
      this._renderer.addClass(this._wrapper, 'popups-wrapper');
      this._customWrapperClass = data.customWrapperClass;

      if (this._customWrapperClass) {
        this._renderer.addClass(this._wrapper, this._customWrapperClass);
      }

      let parent = this._document.body;

      if (data.parentSelector) {
        const parentRef = this._document.querySelector(data.parentSelector);

        if (parentRef) {
          parent = parentRef as HTMLElement;
        }
      }

      this._renderer.appendChild(parent, this._wrapper);
    }

    const componentFactory =
      this._componentFactoryResolver.resolveComponentFactory(ApPopupComponent);
    const componentRef = componentFactory.create(this._injector);

    componentRef.instance.text = data.text;
    componentRef.instance.template = data.template;
    componentRef.instance.customClass = data.customClass;
    componentRef.instance.customWrapperClass = data.customWrapperClass;
    componentRef.instance.zIndex = ++this._zIndexCounter;
    componentRef.instance.id = this._zIndexCounter;
    componentRef.instance.theme = data.theme || componentRef.instance.theme;

    componentRef.instance.templateContext =
      data.templateContext || componentRef.instance.templateContext;

    componentRef.instance.animation =
      data.animation || componentRef.instance.animation;

    componentRef.instance.timeout =
      data.timeout === null
        ? null
        : data.timeout || componentRef.instance.timeout;

    componentRef.instance.parentSelector =
      data.parentSelector || componentRef.instance.parentSelector;

    componentRef.instance.animationDuration =
      data.animationDuration || componentRef.instance.animationDuration;

    componentRef.instance.closeByMouseUp =
      data.closeByMouseUp === undefined
        ? componentRef.instance.closeByMouseUp
        : data.closeByMouseUp;

    componentRef.instance.remove.pipe(take(1)).subscribe(() => {
      this.removePopup(componentRef.instance);
    });

    this._appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    this._renderer.appendChild(this._wrapper, domElem);

    const animatedPopups = this._popups.filter((p) => !p.hideAnimation);

    animatedPopups.forEach((popup, index) => {
      const previousPopupsHeight = animatedPopups
        .filter((_, i) => i < index)
        .reduce((acc, p) => {
          return acc + p.elementRef.nativeElement.clientHeight;
        }, 0);

      setTimeout(() => {
        this._renderer.setStyle(
          popup.elementRef.nativeElement,
          'transform',
          `translateY(calc(${
            previousPopupsHeight +
            componentRef.instance.elementRef.nativeElement.clientHeight
          }px + ${12 * (index + 1)}px))`
        );
      }, 0);

      popup.updateDistanceTop();
    });

    this._popups.unshift(componentRef.instance);

    return componentRef.instance;
  }

  public removePopup(popup: ApPopupComponent): void {
    const index = this._popups.findIndex((p) => p.id === popup.id);

    if (index < 0) return;

    this._removingPopupIds.add(popup.id!);

    timer(popup.animationDuration / 4)
      .pipe(take(1))
      .subscribe(() => {
        const newList = this._popups.filter(
          (p) => !this._removingPopupIds.has(p.id!)
        );

        for (let i = index; i < newList.length; i++) {
          const currentPopup = newList[i];
          const previousPopupsHeight = newList
            .filter((_, pi) => pi < i)
            .reduce((acc, p) => {
              return acc + p.elementRef.nativeElement.clientHeight;
            }, 0);

          this._renderer.setStyle(
            currentPopup.elementRef.nativeElement,
            'transform',
            `translateY(calc(${previousPopupsHeight}px + ${12 * i}px))`
          );
        }

        this._popups = this._popups.filter((p) => p.id !== popup.id);
      });

    timer(popup.animationDuration)
      .pipe(take(1))
      .subscribe(() => {
        this._renderer.removeChild(parent, popup.elementRef.nativeElement);
        this._removingPopupIds.delete(popup.id!);

        if (
          !this._popups.length &&
          this._wrapper &&
          !this._removingPopupIds.size
        ) {
          this._renderer.removeChild(this._document.body, this._wrapper);
          this._wrapper = null;
        }
      });
  }

  public clearAll(): void {
    if (this._wrapper) {
      this._renderer.removeChild(this._document.body, this._wrapper);
    }

    this._popups.length = 0;
  }
}
