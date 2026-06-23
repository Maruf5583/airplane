import SearchResults from '../user/SearchResults';

export default function AgentSearchResults() {
  // Reuses the exact same component — flight selection logic is identical
  // for agents and passengers. The booking flow afterward (passenger
  // details, seats, review, payment) is shared via the same routes.
  return <SearchResults />;
}