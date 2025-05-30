// pages/_app.tsx
import '../styles/globals.css';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { CartProvider } from '../context/CartContext';
import { v4 as uuidv4 } from "uuid";
import type { AppProps } from "next/app";
import NoSSRWrapper from "../components/no-ssr.js"

import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';

let c;

if (typeof window !== "undefined") {
  //const uniqueKey = uuidv4().slice(0, 4);
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
      key: device + uuidv4().slice(0,10),
      name: device,
      operating_system: operatingSystem,
      platform: device,
    },
    location: {
      key: Intl.DateTimeFormat().resolvedOptions().timeZone,
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      country: Intl.DateTimeFormat().resolvedOptions().timeZoneName
    },
    audience: {
      key: uuidv4().slice(0, 10),
    }
  };

  console.log(context)
  const LDProvider = await asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID! || "",
    reactOptions: {
      useCamelCaseFlagKeys: false,
    },
    options: {
      privateAttributes: ['email', 'name']
    },
    context: context
  });

  c = ({ Component, pageProps }: AppProps) => {

    return (
      <NoSSRWrapper>
        <LDProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </LDProvider>
      </NoSSRWrapper>
    );

  }
}
else {
  c = () => null;
}

export default c;