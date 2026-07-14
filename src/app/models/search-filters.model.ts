export interface SearchFilterState {
  author: string;
  isParticipant: boolean;
  strictSearch: boolean;
  inTitles: boolean;
  onlyTags: boolean;
  onlyRequests: boolean;
  onlyContacts: boolean;
}

export function createEmptyFilters(): SearchFilterState {
  return {
    author: '',
    isParticipant: false,
    strictSearch: false,
    inTitles: false,
    onlyTags: false,
    onlyRequests: false,
    onlyContacts: false,
  };
}

export interface SearchState {
  query: string;
  filters: SearchFilterState;
}
