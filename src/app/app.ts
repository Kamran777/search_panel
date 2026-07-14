import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResultsList } from './components/results-list/results-list';
import { SearchState } from './models/search-filters.model';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResultsList, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly searchExpanded = signal(false);
  protected readonly searchState = signal<SearchState | null>(null);
  protected readonly mobileMenuOpen = signal(false);

  onSearchExpandedChange(expanded: boolean): void {
    this.searchExpanded.set(expanded);
  }

  onSearchChange(state: SearchState): void {
    this.searchState.set(state);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
