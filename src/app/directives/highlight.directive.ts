import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @HostListener('mouseenter') onMouseEnter(){
    this.element.nativeElement.style.backgroundColor = '#e8ceca';
    this.element.nativeElement.style.borderRadius = '15px';
    this.element.nativeElement.style.transition = '1s all ease-in';
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.element.nativeElement.style.backgroundColor = '';
  }

  constructor(private element: ElementRef) {
  }

}
