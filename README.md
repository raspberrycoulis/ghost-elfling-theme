# Elfling

Elfling is a free, festive Ghost theme built for [The North Pole Times](https://thenorthpoletimes.com/): Christmas stories, Santa news and festive fun for children. It is based on [Liebling by eddiesigner](https://github.com/eddiesigner/liebling), reworked as a cosy, illustrated North Pole newspaper.

Version 3 is a full festive overhaul: a new palette, a storybook masthead, redesigned story cards and post pages, and a set of seasonal touches, all controllable from Ghost admin.

## Preview

See it live at [thenorthpoletimes.com](https://thenorthpoletimes.com/).

## Download

Head to the [releases page](https://github.com/raspberrycoulis/ghost-elfling-theme/releases/) and download the `elfling-vX.Y.Z.zip` file from the latest release. Upload it in Ghost admin under **Settings → Design → Change theme → Upload theme**.

Requires Ghost 6.0 or later.

## What's new in version 3

### Look and feel

* Signature red header with a gentle shimmer, warm cream pages, evergreen footer and menus, and gold details
* "Christmas Eve" dark mode: deep evergreen, warm cream text and gold accents. It follows the visitor's device setting until they choose for themselves
* Readable typography: p22-festiva for mastheads and headlines, archer-pro for stories and navigation (via Adobe Fonts)
* A matching set of navigation icons instead of emoji
* String of twinkling fairy lights, snowdrifts under each hero image and a snowy village above the footer

### Homepage

* Masthead with a "sleeps until Christmas" countdown and two buttons: read the latest stories, or check the Nice List
* "Santa's pick": your most recent featured post leads the page and is never repeated in the grid below. If hiding it would leave a gap, an "Is your name on the Nice List?" card fills it, so every row stays full
* Story cards show the category, "By" the character who wrote it, a real date and the reading time, with long titles neatly trimmed
* "Meet the North Pole team": the character authors, with their avatars, bios and story counts (first page only)

### Posts

* Comfortable reading width and a storybook drop cap
* Compact header: category, title, then author, date and reading time on one line
* Candy-cane reading progress bar with Santa's sleigh at the tip
* Ghost editor blocks restyled to match: callouts and calls to action as "gift tags", pill-shaped buttons and paper bookmark cards
* At the end of every post: share buttons, a "Written by" card for the author, and previous and next story links
* "Post from the North Pole" newsletter sign-up, styled as an airmail envelope

### Seasonal behaviour

* Countdown: "X sleeps until Christmas" from 1 November to 24 December, a Christmas greeting on 25 and 26 December, and "Santa's having a well-earned rest!" from 27 December to 31 October
* Gentle snowfall, with a snowflake button in the header so visitors can turn it off. It stays off for visitors whose device asks for reduced motion
* Festive 404 page: "Oops! This page got lost in the snow"

### Sharing

* WhatsApp, Facebook, email and copy-link buttons on every post and on the Nice and Naughty List pages, each clearly labelled with the platform's own colours
* On phones with a built-in share menu, an extra "More ways to share" button appears
* Nothing is loaded from Facebook or WhatsApp until a visitor clicks

## Theme settings

Find these in Ghost admin under **Settings → Design → Theme settings**.

| Setting | What it does | Default |
| --- | --- | --- |
| Adobe Fonts kit ID | Loads archer-pro and p22-festiva from your Adobe Fonts kit. Leave empty to fall back to Source Sans Pro and Georgia | `cxi0seh` |
| Snowfall | Everywhere, Header only, or Off | Everywhere |
| Festive decorations | Fairy lights, snowdrifts, holly dividers, the footer village and the paper texture | On |
| Show Christmas countdown | The countdown pill in the homepage masthead | On |
| Hero button text / URL | The second masthead button. Also used by the Nice List card and the 404 page | "Check the Nice List" / `/the-nice-list/` |
| Dark mode logo, search and fade animation | Carried over from earlier versions | — |

A font chosen in **Settings → Design → Brand** takes priority over the Adobe Fonts.

## Setting up

### Code injection

Version 3 includes all the styling that previously lived in Ghost's site-wide code injection. When upgrading from version 2, clear **Settings → Code injection → Site header**, keeping only scripts such as analytics. Code injection loads after the theme, so old rules left there would override the new design.

### llms.txt

The theme no longer includes a hand-made `llms.txt`. Ghost 6.40 and later can generate `/llms.txt`, `/llms-full.txt` and Markdown versions of every post automatically, so they stay up to date as you publish. Turn it on under **Settings → Meta data → Enable structured data for LLMs and AI search engines**. Sites upgraded from older Ghost versions have this switched off by default.

### Navigation icons

Icons are matched to menu items by their slug, which Ghost creates from the label in **Settings → Navigation**:

| Label | Icon |
| --- | --- |
| Home | Snowy cottage |
| The Nice List | Star |
| The Naughty List | Lump of coal |
| My Account | Santa hat |
| Support us | Gift |

Remove any emoji from the labels. Items without a matching icon simply show their label. If you rename an item, its slug changes and it loses its icon until the theme is updated in `partials/icons/nav-icon.hbs`.

### Featured posts

Mark a post as featured to make it "Santa's pick". Only the most recent featured post leads the homepage. Older featured posts get a gold frame and a "Santa's pick" badge wherever they appear in the grid.

## Ghost features

* Members, newsletter sign-up and native comments
* Multiple authors, tags and authors index pages
* Logo, secondary navigation and accent colour
* Featured posts and pages
* Koenig editor cards, including bookmarks, galleries, buttons, calls to action, callouts, toggles, products, audio, video, files and headers
* Normal, wide and full-width images, with image zoom
* Per-page "Show title and feature image" setting
* Search (Ghost's native search or the theme's own)
* Custom subscribe, authors, tags and error pages
* RTL language support

## Development

There is no build step. The original Liebling styles and scripts in `assets/css` and `assets/js` are compiled and left untouched. Everything festive lives in two readable files that load after them:

* `assets/css/festive.css`: palette tokens, typography and every festive component, organised into numbered sections
* `assets/js/festive.js`: countdown, snowfall controls, reading progress and share buttons

The festive markup is in the templates and in partials such as `team.hbs`, `share.hbs`, `author-signoff.hbs`, `post-nav.hbs` and `icons/`.

Check the theme with Ghost's validator before releasing:

```bash
npx gscan .
```

### Releasing

Pushing a tag such as `v3.0.0` runs the GitHub Actions workflow. It checks the theme with gscan, builds `elfling-v3.0.0.zip` and attaches it to a new GitHub release. Keep the `version` in `package.json` in step with the tag.

## Credits

Based on [Liebling](https://github.com/eddiesigner/liebling) by Eduardo Gómez. Snowfall by [Snowstorm](http://schillmania.com/projects/snowstorm/) by Scott Schiller (BSD licence).

## Licence

Released under the [MIT licence](LICENSE).
