import { ImageSize, BackdropSize } from '../interfaces/media.interface';

export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  YOUTUBE_THUMBNAIL_URL: 'https://img.youtube.com/vi',
  YOUTUBE_EMBED_URL: 'https://www.youtube.com/embed'
} as const;

export const IMAGE_SIZES: Record<string, ImageSize> = {
  POSTER_SMALL: 'w185',
  POSTER_MEDIUM: 'w342',
  POSTER_LARGE: 'w500',
  POSTER_ORIGINAL: 'original'
} as const;

export const BACKDROP_SIZES: Record<string, BackdropSize> = {
  BACKDROP_SMALL: 'w300',
  BACKDROP_MEDIUM: 'w780',
  BACKDROP_LARGE: 'w1280',
  BACKDROP_ORIGINAL: 'original'
} as const;

export const FALLBACK_IMAGES = {
  MEDIA: '/media-no-image.svg',
  PEOPLE: '/people-no-image.svg'
} as const;

export const YOUTUBE_THUMBNAIL_QUALITIES = [
  'maxresdefault',
  'hqdefault',
  'mqdefault',
  'default'
] as const;

export const TRAILER_TYPES = ['Trailer', 'Teaser', 'Clip'] as const;

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv'
} as const;
