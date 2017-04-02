# Ractive.js Website


## Setup

```sh
# Install the following. Installation procedure may vary by platform.
# - Python 2.7
# - pip
# - virtualenv

# Create a virtualenv and activate it
virtualenv ractivejs.github.io
cd ractivejs.github.io

# Fork this repo and clone your fork.
git clone git@github.com:YOUR_USERNAME/ractivejs.github.io.git src
cd src

# Install dependencies
source ../bin/activate
pip install -r requirements.txt
```

## Development

```sh
# Activate the virtualenv
source ./bin/activate

# Serve the site
mkdocs serve

# When done developing, deactivate the virtualenv
deactivate
```

### Finding and fixing broken links

```sh
# Install broken-link checker
npm install -g broken-link-checker

# Run broken-link checker while mkdocs is running
blc -egorv http://localhost:8000
```

## Conventions

- Everything is written in vanilla Markdown.
- Current documentation goes in the `docs` directory.
- Legacy documentation goes in the `legacy` directory.
- File names should be lowercase kebab-style format (i.e. `hello-world.md`).
- All links must be relative to the current file.
- Pages should start with a title as first heading.
- The nav bar is managed in `mkdocs.yml`.
