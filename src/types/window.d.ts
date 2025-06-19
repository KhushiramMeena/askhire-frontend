declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    adsbygoogle: any[];
    dataLayer: any[];
    FB: any;
    fbAsyncInit: () => void;
    twttr: any;
  }
}

export {};