import { useEffect, useState } from 'react';
import { getLDClient } from '../lib/launchdarkly';

const FeatureFlag = ({ flagKey, children }) => {
  const [showFeature, setShowFeature] = useState(false);

  useEffect(() => {
    const ldClient = getLDClient();
    const flagValue = ldClient.variation(flagKey, false);
    setShowFeature(flagValue);

    const handleFlagChange = (changes) => {
      if (changes[flagKey]) {
        setShowFeature(changes[flagKey].current);
      }
    };

    ldClient.on('change', handleFlagChange);

    return () => {
      ldClient.off('change', handleFlagChange);
    };
  }, [flagKey]);

  return showFeature ? <>{children}</> : null;
};

export default FeatureFlag;
