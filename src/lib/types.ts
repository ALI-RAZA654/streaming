export type AnimeFormat = 'TV' | 'Movie' | 'OVA' | 'Special';
export type AnimeStatus = 'Ongoing' | 'Completed' | 'Upcoming';
export type AnimeSeason = 'Spring' | 'Summer' | 'Fall' | 'Winter';
export type WatchStatus = 'Watching' | 'Plan to Watch' | 'Completed' | 'On Hold' | 'Dropped';

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string; // e.g. "24m"
  airDate: string;
  description: string;
  videoUrl: string;
  isFiller?: boolean;
}

export interface Anime {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  synopsis: string;
  posterImage: string;
  bannerImage: string;
  trailerUrl?: string;
  rating: number; // e.g. 8.9
  scoreCount: number;
  rank: number;
  popularity: number;
  format: AnimeFormat;
  status: AnimeStatus;
  episodesCount: number;
  releasedYear: number;
  season?: AnimeSeason;
  studio: string;
  genres: string[];
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  latest?: boolean;
  episodes: Episode[];
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  avatar: string;
  banner: string;
  joinedDate: string;
  episodesWatched: number;
  hoursWatched: number;
  favoriteGenre: string;
  level: number;
  xp: number;
}

export interface WatchHistoryItem {
  anime: Anime;
  episode: Episode;
  watchedAt: string;
  progressSeconds: number;
  durationSeconds: number;
}

export interface FilterState {
  search: string;
  genre: string;
  format: string;
  status: string;
  season: string;
  sortBy: 'popularity' | 'rating' | 'latest' | 'title';
}
