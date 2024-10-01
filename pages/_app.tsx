// pages/_app.tsx
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { CartProvider } from '../context/CartContext';
import { v4 as uuidv4 } from "uuid";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';


function MyApp({ Component, pageProps }) {
  const [LDProvider, setLDProvider] = useState<React.ComponentType | null>(null);
  const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
  const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';

  const context = {
    kind: "multi",
    user: {
      key: uuidv4().slice(0, 10),
      name: "User",
      email: "user" + uuidv4().slice(0, 10) + "@email.com",
      appName: "Retail Demo App",
    },
    device: {
      key: device,
      name: device,
      operating_system: operatingSystem,
      platform: device,
    },
    location: {
      key: Intl.DateTimeFormat().resolvedOptions().timeZone,
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      country: "US",
    },
    audience: {
      key: uuidv4().slice(0, 10),
    }
  };

  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID!,
        reactOptions: {
          useCamelCaseFlagKeys: false,
        },
        options: {
          privateAttributes: ['email', 'name']
        },
        context: context
      });
      setLDProvider(() => provider);
    })();
  }, []);

  if (!LDProvider) {
    return <div>Loading...</div>;
  }

  return (
      <LDProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </LDProvider>
  );
}

export default MyApp;