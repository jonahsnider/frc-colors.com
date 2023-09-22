import convert from 'convert';

/** Duration to cache response for team media for year. */
export const CACHE_TTL_TBA_TEAM_MEDIA = convert(1, 'week');

/** Duration to cache response for team. */
export const CACHE_TTL_TBA_TEAM = convert(2, 'week');

/** Duration to cache response for event teams. */
export const CACHE_TTL_TBA_EVENT_TEAMS = convert(1, 'week');

/** Lifetime of DB rows for caching team avatars. */
export const CACHE_TTL_TEAM_AVATAR = convert(14, 'days');

/** Lifetime of Redis key for caching generated colors. */
export const CACHE_TTL_GENERATED_COLORS = CACHE_TTL_TEAM_AVATAR;
