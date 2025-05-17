import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface AdBannerProps {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "leaderboard";
  responsive?: boolean;
  className?: string;
  layout?: string; // for in-article or in-feed
}

/**
 * Smart AdBanner component optimized for Google AdSense dynamic positioning
 */
const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
  layout
}) => {
  const adRef = useRef<HTMLModElement>(null);

  const publisherId =
    process.env.REACT_APP_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [slotId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        my: 2,
        overflow: "hidden",
      }}
      className={className}
      data-testid="ad-banner"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-adtest="on" // Remove in production
      />
    </Box>
  );
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdBanner;

