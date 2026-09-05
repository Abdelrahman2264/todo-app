import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'flow-sidebar-collapsed';

@Injectable({ providedIn: 'root' })
export class UiService {
  /** Desktop: collapse sidebar to icon rail. Persisted. */
  readonly collapsed = signal<boolean>(localStorage.getItem(STORAGE_KEY) === '1');

  /** Mobile: off-canvas sidebar open state. Not persisted. */
  readonly mobileOpen = signal<boolean>(false);

  toggleCollapsed(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
