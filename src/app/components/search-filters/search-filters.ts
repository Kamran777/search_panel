import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilterState } from '../../models/search-filters.model';
import { DEFAULT_HISTORY } from '../../data/search-history';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.scss',
})
export class SearchFilters {
  readonly history = input<string[]>(DEFAULT_HISTORY);
  readonly filters = input.required<SearchFilterState>();
  readonly showHistory = input<boolean>(true);
  readonly filtersChange = output<SearchFilterState>();
  readonly historyItemSelected = output<string>();
  readonly searchOptions = [
    {
      key: 'isParticipant',
      label: 'Я участник',
    },
    {
      key: 'strictSearch',
      label: 'Строгий поиск',
    },
    {
      key: 'inTitles',
      label: 'В заголовках',
    },
  ] as const;

  readonly onlyOptions = [
    {
      key: 'onlyTags',
      label: 'Теги',
    },
    {
      key: 'onlyRequests',
      label: 'Просьбы',
    },
    {
      key: 'onlyContacts',
      label: 'Контакты',
    },
  ] as const;

  protected onFieldChange<K extends keyof SearchFilterState>(
    key: K,
    value: SearchFilterState[K],
  ): void {
    this.filtersChange.emit({
      ...this.filters(),
      [key]: value,
    });
  }

  protected onCheckboxChange(key: keyof SearchFilterState, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.onFieldChange(key, checked as SearchFilterState[typeof key]);
  }

  protected onAuthorInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.onFieldChange('author', value);
  }

  protected selectHistoryItem(item: string): void {
    this.historyItemSelected.emit(item);
  }
}
