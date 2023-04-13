import '../styles/reset.css';
import '../styles/main.css';
import { useEffect, useState } from 'react';
import { isIOS } from 'react-device-detect';

let deferredPrompt;

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log(
              'Service Worker registration successful with scope: ',
              registration.scope
            );
          },
          function (err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('INSTALL: Success');
    });
  }, []);

  const handleInstallClick = (e) => {
    // Hide the app provided install promotion
    setInstallable(false);
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  // Handle iOS install prompt
  if (typeof window !== 'undefined') {
    // function isIos() {
    //   const userAgent = window.navigator.userAgent.toLowerCase();
    //   return /iphone|ipad|ipod/.test(userAgent);
    // }

    function isInStandaloneMode() {
      return 'standalone' in window.navigator && window.navigator.standalone;
    }
  }

  return (
    <>
      <Component {...pageProps} />
      <h2>Install Demo</h2>
      {installable && (
        <button className="install-button" onClick={handleInstallClick}>
          INSTALL ME
        </button>
      )}
      {isIOS && (
        <button className="ios-install-button" onClick={handleInstallClick}>
          iOS INSTALL ME
        </button>
      )}
    </>
  );
}

export default MyApp;
