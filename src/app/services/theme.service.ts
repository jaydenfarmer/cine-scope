import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }

  toggleTheme() {
    const isDark = !this.isDarkMode();
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
  }
}