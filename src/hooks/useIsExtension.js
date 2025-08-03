export default function useIsExtension() {
  return window.location.origin.startsWith("chrome-extension://");
}
