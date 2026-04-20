import tokens from "./tokens.json" with { type: "json" };

// A Tailwind 3+ compatible preset that exposes the Gideon palette,
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
        "g-hero": tokens.gradient.heroOverhead,
        "g-flame": tokens.gradient.flameMark,
        "g-wordmark": tokens.gradient.wordmark,
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
        "g-h1": tokens.font.size.h1,
        "g-h2": tokens.font.size.h2,
        "g-body": tokens.font.size.body,
        "g-caption": tokens.font.size.caption,
      },
      borderRadius: {
        "g-primary": tokens.radius.primary,
        "g-secondary": tokens.radius.secondary,
      },
      transitionDuration: {
        hover: `${tokens.motion.hoverMs}ms`,
        press: `${tokens.motion.pressMs}ms`,
      },
      maxWidth: {
        "g-mobile": tokens.spacing.maxContentMobile,
        "g-desktop": tokens.spacing.maxContentDesktop,
      },
    },
  },
} as const;

export default preset;
