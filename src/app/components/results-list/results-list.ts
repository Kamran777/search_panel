import { Component, computed, input } from '@angular/core';
import { ResultItem } from '../../models/result.model';
import { SearchState, SearchFilterState } from '../../models/search-filters.model';
import { MOCK_RESULTS } from '../../data/mock-results';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [],
  templateUrl: './results-list.html',
  styleUrl: './results-list.scss',
})
export class ResultsList {
  readonly searchState = input<SearchState | null>(null);
  private readonly allResults = MOCK_RESULTS;

  readonly results = computed<ResultItem[]>(() => {
    const state = this.searchState();

    if (!state) {
      return this.allResults;
    }

    if (!state.query && !this.hasActiveFilters(state.filters)) {
      return this.allResults;
    }

    return this.filterResults(state);
  });

  private filterResults(state: SearchState): ResultItem[] {
    const query = state.query.trim().toLowerCase();

    return this.allResults.filter((item) => {
      return (
        this.matchesQuery(item, query) &&
        this.matchesAuthor(item, state.filters) &&
        this.matchesOnly(item, state.filters)
      );
    });
  }

  private matchesQuery(item: ResultItem, query: string): boolean {
    if (!query) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(query) ||
      item.snippet.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  private matchesAuthor(item: ResultItem, filters: SearchFilterState): boolean {
    return !filters.author || item.author.toLowerCase().includes(filters.author.toLowerCase());
  }

  private matchesOnly(item: ResultItem, filters: SearchFilterState): boolean {
    const noFilter = !filters.onlyTags && !filters.onlyRequests && !filters.onlyContacts;

    if (noFilter) {
      return true;
    }

    return (
      (filters.onlyTags && item.tags.includes('Теги')) ||
      (filters.onlyRequests && item.tags.includes('Просьбы')) ||
      (filters.onlyContacts && item.tags.includes('Контакты'))
    );
  }

  private hasActiveFilters(filters: SearchFilterState): boolean {
    return Boolean(
      filters.author ||
      filters.isParticipant ||
      filters.strictSearch ||
      filters.inTitles ||
      filters.onlyTags ||
      filters.onlyRequests ||
      filters.onlyContacts,
    );
  }
}
