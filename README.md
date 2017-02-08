# Ractive.js Website

## Setup

```sh
# Install the following. Installation procedure may vary by platform.
# - Python 2.7
# - pip
# - virtualenv

# Create a virtualenv and activate it
virutalenv ractivejs.github.io
cd ractivejs.github.io
source ./bin/activate

# Fork this repo and clone your fork.
git clone git@github.com:YOUR_USERNAME/ractivejs.github.io.git src
cd src

# Install dependencies
pip install -r requirements.txt
```

### Development

```sh
# Serve the site
mkdocs serve

# Build the site
mkdocs build

# When done developing, deactivate the virtualenv
deactivate
```

Refer to the [mkdocs site](http://www.mkdocs.org) for more information.

## Notes

- Everything goes in the `docs` directory.
- The menu is managed in `mkdocs.yml`.
- Everything is written in markdown.

## TODO

- Automate build with Travis
