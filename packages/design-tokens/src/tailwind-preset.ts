import tokens from "./tokens.json" with { type: "json" };

// A Tailwind 3+ compatible preset that exposes the Faretta palette,
// type scale, radii, and font families as Tailwind utilities.
const preset = {
  theme: {
    extend: {
      colors: {
        night: tokens.color.night,
        midnight: tokens.color.midnight,
        slate: {
          DEFAULT: tokens.color.slate,
          "2": tokens.color.slate2,
        },
        ink: tokens.color.ink,
        mist: {
          DEFAULT: tokens.color.mist,
          "2": tokens.color.mist2,
        },
        gold: tokens.color.gold,
        ember: tokens.color.ember,
        flame: tokens.color.flame,
        truth: tokens.color.truth,
        warn: tokens.color.warn,
        wrath: tokens.color.wrath,
      },
      backgroundImage: {
        "f-hero": tokens.gradient.heroOverhead,
        "f-flame": tokens.gradient.flameMark,
        "f-wordmark": tokens.gradient.wordmark,
      },
      fontFamily: {
        sans: [tokens.font.family.sans],
        serif: [tokens.font.family.serif],
      },
      fontWeight: tokens.font.weight as Record<string, string>,
      letterSpacing: {
        display: tokens.font.tracking.display,
        body: tokens.font.tracking.body,
        wordmark: tokens.font.tracking.wordmark,
        kicker: tokens.font.tracking.kicker,
      },
      fontSize: {
        hero: tokens.font.size.hero,
        "f-h1": tokens.font.size.h1,
        "f-h2": tokens.font.size.h2,
        "f-body": tokens.font.size.body,
        "f-caption": tokens.font.size.caption,
      },
      borderRadius: {
        "f-primary": tokens.radius.primary,
        "f-secondary": tokens.radius.secondary,
      },
      transitionDuration: {
        hover: `${tokens.motion.hoverMs}ms`,
        press: `${tokens.motion.pressMs}ms`,
      },
      maxWidth: {
        "f-mobile": tokens.spacing.maxContentMobile,
        "f-desktop": tokens.spacing.maxContentDesktop,
      },
    },
  },
} as const;

export default preset;
