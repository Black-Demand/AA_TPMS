import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AATPMS';

  constructor(
    private languageService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.languageService.setDefaultLang('am');

    if (isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem('lang') || 'am';
      this.languageService.use(storedLang);
    } else {
      this.languageService.use('am');
    }
  }
}
