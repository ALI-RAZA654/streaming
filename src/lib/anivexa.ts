/**
 * Anivexa API Service Helper (Client-side / Next.js)
 */

const ANIVEXA_BASE_URL = process.env.NEXT_PUBLIC_ANIVEXA_API_URL || 'https://anivexa-api.vercel.app';
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface AnivexaSource {
  url: string;
  quality: string;
  isM3U8?: boolean;
}

export interface AnivexaStreamData {
  streamUrl: string;
  hlsUrl?: string;
  quality: string;
  format: 'hls' | 'mp4';
  headers?: Record<string, string>;
}

/**
 * Fetch streaming sources from Anivexa API for a given AniList ID & Episode
 */
export async function fetchAnivexaStream(
  anilistId: number | string,
  episodeNumber: number | string,
  provider: string = 'anizone',
  subOrDub: 'sub' | 'dub' = 'sub'
): Promise<AnivexaStreamData | null> {
  try {
    // Try backend proxy endpoint first, fallback to direct Anivexa API
    let url = `${BACKEND_API_URL}/anivexa/watch/${provider}/${anilistId}/${subOrDub}/${episodeNumber}`;
    
    let response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      // Fallback direct to Anivexa API
      url = `${ANIVEXA_BASE_URL}/watch/${provider}/${anilistId}/${subOrDub}/${episodeNumber}`;
      response = await fetch(url, { cache: 'no-store' });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data || json;

    if (data && (data.sources?.length || data.streamUrl || data.url)) {
      const primaryUrl = data.streamUrl || data.sources?.[0]?.url || data.url;
      const isHls = primaryUrl?.includes('.m3u8');

      return {
        streamUrl: primaryUrl,
        hlsUrl: isHls ? primaryUrl : undefined,
        quality: data.quality || data.sources?.[0]?.quality || '1080p',
        format: isHls ? 'hls' : 'mp4',
        headers: data.headers || { Referer: 'https://anivexa.net/' },
      };
    }
  } catch (error) {
    console.warn('[Anivexa API Client] Failed to fetch stream:', error);
  }

  return null;
}

/**
 * Fetch episode mappings for an AniList ID
 */
export async function fetchAnivexaEpisodes(anilistId: number | string): Promise<any> {
  try {
    const url = `${ANIVEXA_BASE_URL}/episodes/${anilistId}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('[Anivexa API Client] Failed to fetch episode list:', error);
  }
  return null;
}
