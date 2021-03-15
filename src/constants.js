// for testing: https://testing-dot-reflected-codex-228006.uc.r.appspot.com/
export const URL_PREFIX = process.env.NODE_ENV === 'production' ? 'https://zephyrus.gg/' : 'http://127.0.0.1:8000/';

export const PAGES = {
    Replays: 'Replays',
    Winrate: 'Winrate',
    Performance: 'Season Stats',
    Trends: 'Trends',
    Upload: 'Upload Replays',
};

export const RACES_LOWER = ['protoss', 'terran', 'zerg'];
