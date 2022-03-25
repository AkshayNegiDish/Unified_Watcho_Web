import { Directive, HostBinding, Input, ElementRef, AfterViewInit } from '@angular/core';
import { PlatformIdentifierService } from './services/platform-identifier.service';

@Directive({
  selector: 'img[appLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  @HostBinding('attr.src') srcAttr = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  @Input() src: string;

  constructor(private el: ElementRef, private platformIdentifierService: PlatformIdentifierService) { }

  ngAfterViewInit() {
    if (this.platformIdentifierService.isBrowser()) {
      this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    }
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const options = {
      threshold: .10
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach((isIntersecting) => {
        if (isIntersecting.intersectionRatio > 0) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
          obs.disconnect();
        }
      });
    }, options);
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.srcAttr = this.src;
  }

}
