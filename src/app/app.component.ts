import { Component, HostListener, Renderer2, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Project.Raphael.Frame.Society';
  private ambientInterval: any;
  showTermsModal = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAmbientButterflies();
      const termsAccepted = localStorage.getItem('termsAccepted');
      if (!termsAccepted) {
        this.showTermsModal = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
    }
  }

  acceptTerms() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('termsAccepted', 'true');
      this.showTermsModal = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      this.spawnButterfly(event.clientX, event.clientY, 'click-butterfly', 1800);
    }
  }

  private startAmbientButterflies() {
    this.ambientInterval = setInterval(() => {
      if (Math.random() > 0.7) return;
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 50; 
      this.spawnButterfly(startX, startY, 'ambient-butterfly', 6000);
    }, 800);
  }

  private spawnButterfly(x: number, y: number, className: string, lifetime: number) {
    const butterfly = this.renderer.createElement('div');
    this.renderer.addClass(butterfly, className);
    this.renderer.setStyle(butterfly, 'left', `${x}px`);
    this.renderer.setStyle(butterfly, 'top', `${y}px`);
    
    if (className === 'ambient-butterfly') {
       const duration = 4 + Math.random() * 4;
       this.renderer.setStyle(butterfly, 'animation-duration', `${duration}s`);
    } else if (className === 'click-butterfly') {
       const duration = 1.2 + Math.random() * 0.8;
       this.renderer.setStyle(butterfly, 'animation-duration', `${duration}s`);
    }

    this.renderer.appendChild(document.body, butterfly);

    setTimeout(() => {
      if (document.body.contains(butterfly)) {
        this.renderer.removeChild(document.body, butterfly);
      }
    }, lifetime * 1.5);
  }
}
