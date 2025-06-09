import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly defaultLang = 'am';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang(this.defaultLang);
    const savedLang = this.getStoredLanguage();
    this.translate.use(savedLang);
  }

  getStoredLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('lang') || this.defaultLang;
    }
    return this.defaultLang;
  }

  changeLanguage(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || this.defaultLang;
  }
}
