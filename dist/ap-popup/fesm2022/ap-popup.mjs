import * as i0 from '@angular/core';
import { EventEmitter, HostBinding, Output, Input, Component } from '@angular/core';
import { Subject, timer, takeUntil } from 'rxjs';
import { NgIf, NgClass, NgTemplateOutlet } from '@angular/common';

class ApPopupComponent {
    elementRef;
    text;
    svgIcon;
    template;
    templateContext = {};
    theme = 'default';
    animation = 'cubic';
    animationDuration = 900;
    animationHideDuration = 900;
    timeout = 3000;
    parentSelector = null;
    closeByMouseUp = true;
    customClass;
    customWrapperClass;
    zIndex;
    remove = new EventEmitter();
    hideAnimation;
    distanceToPageTop = 0;
    id;
    cubicBezierFunctionIn = 'cubic-bezier(0, 1.82, 0.46, 0.84)';
    cubicBezierFunctionOut = 'cubic-bezier(0.42, -0.65, 0.27, 0.93)';
    _close$ = new Subject();
    get getHostTransition() {
        let timingFunction = 'linear';
        if (this.animation === 'cubic') {
            timingFunction = this.cubicBezierFunctionIn;
        }
        return `all ${timingFunction} ${this.animationDuration}ms`;
    }
    get getZIndex() {
        return this.zIndex?.toString() || '1';
    }
    get getCursor() {
        return this.closeByMouseUp ? 'pointer' : 'default';
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnInit() {
        if (!this.timeout)
            return;
        timer(this.timeout)
            .pipe(takeUntil(this._close$))
            .subscribe(() => {
            this._startHideAnimation();
        });
    }
    ngOnDestroy() {
        this._close$.complete();
    }
    onMouseUp() {
        if (!this.closeByMouseUp)
            return;
        this.close();
    }
    close() {
        this.zIndex = 999;
        this._close$.next();
        this._startHideAnimation();
    }
    updateDistanceTop() {
        this.distanceToPageTop = this._getDistanceFromBottomToPageTop(this.elementRef.nativeElement);
    }
    _startHideAnimation() {
        this.updateDistanceTop();
        this.hideAnimation = `${this.animation}-out`;
        this.remove.emit();
    }
    _getDistanceFromBottomToPageTop(element) {
        return element.getBoundingClientRect().bottom;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: ApPopupComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.14", type: ApPopupComponent, isStandalone: true, selector: "lib-ap-popup", inputs: { text: "text", svgIcon: "svgIcon", template: "template", templateContext: "templateContext", theme: "theme", animation: "animation", animationDuration: "animationDuration", animationHideDuration: "animationHideDuration", timeout: "timeout", parentSelector: "parentSelector", closeByMouseUp: "closeByMouseUp", customClass: "customClass", customWrapperClass: "customWrapperClass", zIndex: "zIndex" }, outputs: { remove: "remove" }, host: { properties: { "style.transition": "this.getHostTransition", "style.zIndex": "this.getZIndex", "style.cursor": "this.getCursor" } }, ngImport: i0, template: "<div\r\n  class=\"ap-popup\"\r\n  [ngClass]=\"[animation, hideAnimation ? hideAnimation : '', customClass ? customClass : '']\"\r\n  [style]=\"\r\n    '--animationDuration:' +\r\n    animationDuration +\r\n    'ms;' +\r\n    '--cubicFunctionIn:' +\r\n    cubicBezierFunctionIn +\r\n    ';' +\r\n    '--cubicFunctionOut:' +\r\n    cubicBezierFunctionOut +\r\n    ';' +\r\n    '--distanceToPageTop:' +\r\n    distanceToPageTop +\r\n    'px;'\r\n  \"\r\n  (mouseup)=\"onMouseUp()\"\r\n>\r\n  <div *ngIf=\"text || template\" class=\"ap-popup__content\" [ngClass]=\"'ap-popup__content-' + theme\">\r\n    <ng-container\r\n      *ngIf=\"template\"\r\n      [ngTemplateOutlet]=\"template\"\r\n      [ngTemplateOutletContext]=\"templateContext\"\r\n    ></ng-container>\r\n\r\n    <span *ngIf=\"text && !template\" [innerHtml]=\"text\"></span>\r\n  </div>\r\n</div>\r\n", styles: [":host{--ap-popup-max-width: 540px;max-width:var(--ap-popup-max-width);display:flex;width:fit-content;position:absolute;top:0;left:0;right:0;margin-inline:auto;justify-content:center;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}.ap-popup{width:auto;max-width:fit-content}.ap-popup__content{display:flex;align-items:center;column-gap:8px;padding:12px 16px;border-radius:16px;background:#fff;box-shadow:0 4px 12px #04040414;width:fit-content;font-size:16px;font-weight:400;line-height:24px}.ap-popup__content-warning,.ap-popup__content-error{background:#fff3d1;box-shadow:0 4px 12px #8f701614}.ap-popup__content-success{background:#e9f1df;box-shadow:0 4px 12px #4a862e14}.ap-popup__content-light{background:#000;box-shadow:0 8px 28px #00000014}.slide{animation:slideInFromRight var(--animationDuration) forwards ease-in}.slide-out{animation:slideOutToRight var(--animationDuration) forwards ease-out}.cubic{animation:slideInFromTop var(--animationDuration) forwards var(--cubicFunctionIn)}.cubic-out{animation:slideOutToTop var(--animationDuration) forwards var(--cubicFunctionOut)}.fade{animation:fadeIn var(--animationDuration) forwards linear}.fade-out{animation:fadeOut var(--animationDuration) forwards linear}@keyframes slideInFromTop{0%{transform:translateY(calc(-200% - var(--distanceToPageTop)))}to{transform:translateY(0)}}@keyframes slideOutToTop{0%{transform:translateY(0)}to{transform:translateY(calc(-200% - var(--distanceToPageTop)))}}@keyframes slideInFromRight{0%{transform:translate(110%)}to{transform:translate(0)}}@keyframes slideOutToRight{0%{transform:translate(0)}to{transform:translate(110%)}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: ApPopupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-ap-popup', imports: [NgIf, NgClass, NgTemplateOutlet], template: "<div\r\n  class=\"ap-popup\"\r\n  [ngClass]=\"[animation, hideAnimation ? hideAnimation : '', customClass ? customClass : '']\"\r\n  [style]=\"\r\n    '--animationDuration:' +\r\n    animationDuration +\r\n    'ms;' +\r\n    '--cubicFunctionIn:' +\r\n    cubicBezierFunctionIn +\r\n    ';' +\r\n    '--cubicFunctionOut:' +\r\n    cubicBezierFunctionOut +\r\n    ';' +\r\n    '--distanceToPageTop:' +\r\n    distanceToPageTop +\r\n    'px;'\r\n  \"\r\n  (mouseup)=\"onMouseUp()\"\r\n>\r\n  <div *ngIf=\"text || template\" class=\"ap-popup__content\" [ngClass]=\"'ap-popup__content-' + theme\">\r\n    <ng-container\r\n      *ngIf=\"template\"\r\n      [ngTemplateOutlet]=\"template\"\r\n      [ngTemplateOutletContext]=\"templateContext\"\r\n    ></ng-container>\r\n\r\n    <span *ngIf=\"text && !template\" [innerHtml]=\"text\"></span>\r\n  </div>\r\n</div>\r\n", styles: [":host{--ap-popup-max-width: 540px;max-width:var(--ap-popup-max-width);display:flex;width:fit-content;position:absolute;top:0;left:0;right:0;margin-inline:auto;justify-content:center;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}.ap-popup{width:auto;max-width:fit-content}.ap-popup__content{display:flex;align-items:center;column-gap:8px;padding:12px 16px;border-radius:16px;background:#fff;box-shadow:0 4px 12px #04040414;width:fit-content;font-size:16px;font-weight:400;line-height:24px}.ap-popup__content-warning,.ap-popup__content-error{background:#fff3d1;box-shadow:0 4px 12px #8f701614}.ap-popup__content-success{background:#e9f1df;box-shadow:0 4px 12px #4a862e14}.ap-popup__content-light{background:#000;box-shadow:0 8px 28px #00000014}.slide{animation:slideInFromRight var(--animationDuration) forwards ease-in}.slide-out{animation:slideOutToRight var(--animationDuration) forwards ease-out}.cubic{animation:slideInFromTop var(--animationDuration) forwards var(--cubicFunctionIn)}.cubic-out{animation:slideOutToTop var(--animationDuration) forwards var(--cubicFunctionOut)}.fade{animation:fadeIn var(--animationDuration) forwards linear}.fade-out{animation:fadeOut var(--animationDuration) forwards linear}@keyframes slideInFromTop{0%{transform:translateY(calc(-200% - var(--distanceToPageTop)))}to{transform:translateY(0)}}@keyframes slideOutToTop{0%{transform:translateY(0)}to{transform:translateY(calc(-200% - var(--distanceToPageTop)))}}@keyframes slideInFromRight{0%{transform:translate(110%)}to{transform:translate(0)}}@keyframes slideOutToRight{0%{transform:translate(0)}to{transform:translate(110%)}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { text: [{
                type: Input
            }], svgIcon: [{
                type: Input
            }], template: [{
                type: Input
            }], templateContext: [{
                type: Input
            }], theme: [{
                type: Input
            }], animation: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], animationHideDuration: [{
                type: Input
            }], timeout: [{
                type: Input
            }], parentSelector: [{
                type: Input
            }], closeByMouseUp: [{
                type: Input
            }], customClass: [{
                type: Input
            }], customWrapperClass: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], remove: [{
                type: Output
            }], getHostTransition: [{
                type: HostBinding,
                args: ['style.transition']
            }], getZIndex: [{
                type: HostBinding,
                args: ['style.zIndex']
            }], getCursor: [{
                type: HostBinding,
                args: ['style.cursor']
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { ApPopupComponent };
//# sourceMappingURL=ap-popup.mjs.map
