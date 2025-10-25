// Google Analytics gtag types
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
