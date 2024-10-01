// pages/_app.js
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { initializeLaunchDarkly } from '../lib/launchdarkly';
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps }) {
  const [ldReady, setLdReady] = useState(false);

  useEffect(() => {
    const user = {
      key: 'anonymous_user',
      anonymous: true,
    };
    initializeLaunchDarkly(user).then(() => {
      setLdReady(true);
    });
  }, []);

  if (!ldReady) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
