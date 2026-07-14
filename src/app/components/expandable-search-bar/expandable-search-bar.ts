import {
  Component,
  ElementRef,
  HostListener,
  signal,
  output,
  ViewChild,
  PLATFORM_ID,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SearchFilters } from '../search-filters/search-filters';
import {
  SearchFilterState,
  SearchState,
  createEmptyFilters,
} from '../../models/search-filters.model';

@Component({
  selector: 'app-expandable-search-bar',
  standalone: true,
  imports: [SearchFilters],
  templateUrl: './expandable-search-bar.html',
  styleUrl: './expandable-search-bar.scss',
})
export class ExpandableSearchBar implements OnInit, OnDestroy {
  @ViewChild('queryInput')
  queryInputRef?: ElementRef<HTMLInputElement>;

  readonly expanded = signal(false);
  readonly query = signal('');
  readonly showHistory = signal(true);
  readonly filters = signal<SearchFilterState>(createEmptyFilters());
  readonly searchChange = output<SearchState>();
  readonly expandedChange = output<boolean>();
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private mediaQuery?: MediaQueryList;

  toggleExpanded(): void {
    this.setExpanded(!this.expanded());
  }

  setExpanded(value: boolean): void {
    if (this.expanded() === value) {
      return;
    }

    this.expanded.set(value);

    this.expandedChange.emit(value);

    if (value) {
      queueMicrotask(() => this.queryInputRef?.nativeElement.focus());
    }
  }

  close(): void {
    this.setExpanded(false);
  }

  onQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.query.set(value);

    this.emitSearch();
  }

  onFiltersChange(filters: SearchFilterState): void {
    this.filters.set(filters);

    this.emitSearch();
  }

  onHistoryItemSelected(item: string): void {
    this.query.set(item);

    this.emitSearch();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.emitSearch();
  }

  private emitSearch(): void {
    this.searchChange.emit({
      query: this.query(),
      filters: this.filters(),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.expanded()) {
      return;
    }

    const target = event.target as Node;

    if (!this.hostRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.expanded()) {
      this.close();
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.mediaQuery = window.matchMedia('(max-width: 1024px)');
    this.updateHistoryVisibility(this.mediaQuery);
    this.mediaQuery.addEventListener('change', this.updateHistoryVisibility);
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.updateHistoryVisibility);
  }

  private readonly updateHistoryVisibility = (
    event: MediaQueryList | MediaQueryListEvent,
  ): void => {
    this.showHistory.set(!event.matches);
  };
}
