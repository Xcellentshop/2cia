export const SADE_BASE_URL = 'https://harpya.pm.pr.gov.br';

export function isSadeUrl(url: string): boolean {
  return url.startsWith(SADE_BASE_URL);
}

export function openInCustomBrowser(url: string) {
  if (window.electron) {
    window.electron.send('open-browser', url);
  } else {
    window.open(url, '_blank');
  }
}