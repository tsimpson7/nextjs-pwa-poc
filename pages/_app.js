import '../styles/reset.css';
import '../styles/main.css';
import { useEffect, useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

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
  const [displayMode, setDisplayMode] = useState('');
  //const []

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

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator && window.navigator.standalone === true)
    ) {
      setDisplayMode('standalone');
    }
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

  return (
    <>
      <Component {...pageProps} />
      <h2>v1.0</h2>
      <h2>Display mode: {displayMode}</h2>
      <h2>Install Demo</h2>
      {/* Non-iOS has built-in installation readiness ie if it hasn't already been installed it is INSTALLABLE therefore show a custom install prompt.
          If it has been installed, it is no longer INSTALLABLE therefore it wont prompt for installation */}
      {isMobile && installable && displayMode !== 'standalone' && (
        <button className="install-button" onClick={handleInstallClick}>
          INSTALL ME
        </button>
      )}
      {/* CAN DETECT IF IT IS RUNNING on iOS but not as a PWA 
          therefore we can render a custom iOS add to homescreen prompt  */}
      {isMobile && isIOS && displayMode !== 'standalone' && (
        <button className="ios-install-button" onClick={handleInstallClick}>
          iOS - INSTALL ME - not being viewed as a PWA
        </button>
      )}
      {/* CAN DETECT IF IT IS RUNNING AS A PWA ON iOS 
          therefore don't need to show any install prompt  */}
      {isMobile && isIOS && displayMode == 'standalone' && (
        <button className="ios-install-button" onClick={handleInstallClick}>
          iOS - dont install me - already viewing as a PWA
        </button>
      )}
    </>
  );
}

export default MyApp;
