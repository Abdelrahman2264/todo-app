import { Injectable, signal } from '@angular/core';

export type ThemeName = 'lagoon' | 'ember';

const STORAGE_KEY = 'flow-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeName>(this.readInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    this.setTheme(this.theme() === 'lagoon' ? 'ember' : 'lagoon');
  }

  setTheme(theme: ThemeName): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  private applyTheme(theme: ThemeName): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private readInitialTheme(): ThemeName {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored === 'lagoon' || stored === 'ember') {
      return stored;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'ember' : 'lagoon';
  }
}
