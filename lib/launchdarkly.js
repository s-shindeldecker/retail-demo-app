// lib/launchdarkly.js
import * as LDClient from 'launchdarkly-js-client-sdk';

let ldClient = null;

export const initializeLaunchDarkly = (user) => {
  ldClient = LDClient.initialize(
    process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID,
    user
  );
  return ldClient.waitForInitialization();
};

export const getLDClient = () => ldClient;
