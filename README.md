# Magar Dev portfolio


## Pages and features

- **Portfolio** (`index.html`): introduction, experience, projects, and social links.
- **FAQ** (`faq.html`): answers about studies, interests, and projects.
- **Music** (`music.html`): an interactive album-cover gallery.
- **Tools** (`tools.html`): a password generator and a browser-based notebook.
- **Travels** (`travels.html`): an interactive globe with visited and planned
  destinations.
- **Theme switcher:** dark and light themes are available across the pages.

The globe texture is rendered from Natural Earth's public-domain Admin 0 -
Countries dataset, version 5.1.1. The Travels page links to the dataset and
includes its recommended attribution.

The notebook and theme preference are saved in the browser's local storage.
They stay on the visitor's device and are not sent to a server by this site.

## Technology

- HTML for page structure and content
- CSS for layout, responsive styling, and themes
- Vanilla JavaScript for page interactions
- GitHub Pages for static hosting

There is no application server, package manager, framework, or build step
required to run the site.

## Run locally

You can open `index.html` directly in a browser. For a more realistic preview,
serve the project directory locally. If Python 3 is installed, run:

```sh
python3 -m http.server 5000
```

Then open <http://localhost:5000>. Stop the server with `Ctrl+C`.

## Project structure

```text
.
├── .github/workflows/site-checks.yml  # Automated HTML and JavaScript checks
├── assets/                            # Images, logos, favicon, and map texture
├── index.html                         # Main portfolio page
├── faq.html                           # FAQ page
├── music.html                         # Music gallery page
├── tools.html                         # Browser tools page
├── travels.html                       # Interactive travel globe page
├── style.css                          # Shared site styles
├── darkmode.js                        # Shared theme switcher
├── music.js                           # Music gallery behavior
├── password_generator.js              # Password generator behavior
├── tools.js                           # Notebook and tools-page behavior
├── travels.js                         # Travel globe behavior
└── CNAME                              # Custom domain for GitHub Pages
```

## Quality checks

GitHub Actions runs checks on pushes and pull requests. To run them locally,
install [Node.js](https://nodejs.org/) and execute these commands from the
project directory:

```sh
for file in *.js; do node --check "$file" || exit 1; done
npx --yes html-validate@10.5.0 *.html
```

- `node --check` catches JavaScript syntax errors; it does not test runtime
  behavior.
- `html-validate` checks for common HTML markup errors; it does not replace
  accessibility checks or testing in a browser.

The HTML validator is pinned to a specific version so local and automated
checks use the same release. `npx` downloads it when needed; no project
dependencies are added.
