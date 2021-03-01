import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
export class TooltipService implements OnDestroy {
  private renderer: Renderer2;
  private tooltipElement: HTMLElement;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'text-align', 'center');
    this.renderer.setStyle(this.tooltipElement, 'background-color', 'black');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 7px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '5px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'max-width', '150px');
    this.renderer.setStyle(this.tooltipElement, 'overflow', 'hidden');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'all, 300ms');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '-1');

    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  ngOnDestroy() {
    this.renderer.removeChild(this.document, this.tooltipElement);
    this.tooltipElement = null;
  }

  showTooltip(mouseEvent: MouseEvent, text: string, position: 'top'|'bottom'|'right'|'left' = 'top'): void {
    this.tooltipElement.textContent = text;
    const target = mouseEvent.target as HTMLElement;
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    this.renderer.setStyle( this.tooltipElement, 'top', `${targetRect.top - (tooltipRect.height + 2)}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${(targetRect.left + (targetRect.width / 2)) - (tooltipRect.width / 2)}px`);
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1001');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '.9');
  }

  hideTooltip(): void {
    this.tooltipElement.textContent = '';
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '-1');
    this.renderer.removeStyle(this.tooltipElement, 'top');
    this.renderer.removeStyle(this.tooltipElement, 'left');
  }
}
