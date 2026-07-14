import { Component, output, signal } from '@angular/core';
import { ExpandableSearchBar } from '../../../components/expandable-search-bar/expandable-search-bar';
import { SearchState } from '../../../models/search-filters.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ExpandableSearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly searchChange = output<SearchState>();

  readonly searchExpanded = signal(false);
  readonly mobileMenuOpen = signal(false);

  onSearchExpandedChange(value: boolean): void {
    this.searchExpanded.set(value);
  }

  onSearchChange(state: SearchState): void {
    this.searchChange.emit(state);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
