export const environment = {
  production: true,
  tmdbApiKey: (globalThis as any)?.process?.env?.['NG_APP_TMDB_API_KEY'] || '', // Will be set by build process
};
