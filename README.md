# Ractive.js Website

## Super basic setup

You only need a text editor with Markdown support and preview to start writing documentation. Simply fork the repo, clone your fork and start writing.

```sh
# Fork this repo and clone your fork
git clone git@github.com:YOUR_USERNAME/ractivejs.github.io.git ractive.js.org
cd ractive.js.org

# Start editing the docs!
```

## Running the site locally

If you want to run the full site locally, you will need a virtualenv setup. Install the following additional software and do the following commands. Installation of the additional software may vary by platform. Refer to their platform-specific documentation to know more.

- Python 2.7
- pip
- virtualenv

```sh
# Create a virtualenv and activate it
virtualenv ractivejs.github.io
cd ractivejs.github.io

# Fork this repo and clone your fork
git clone git@github.com:YOUR_USERNAME/ractivejs.github.io.git src
cd src

# Start the virtualenv
source ../bin/activate

# on Windows start the virtualenv with
..\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the webserver
mkdocs serve

# When done developing, deactivate the virtualenv
deactivate
```

## Finding and fixing broken links

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
- Paths should be in lowercase kebab-style (i.e. `path-to/my/hello-world.md`).
- All links must be relative to the current file.
- Pages should start with a title as first heading.
- The nav bar is managed in `mkdocs.yml` under `pages`.
- Providing examples:
    - Create a **bare minimum** example in the [playground](/playground/) that demonstrates only the related property.
    - Get the content data of your example (eg. `N4IgFiBcoE5S...cASlxA`) and use it to place a `RUN IT` button right above your code section.
    - Strip down your example (remove unnecessary parts, like `el: '#container'`, unnecessary parts of template, the `new` keyword, ...) and place it in a code section under **Examples** header.
    - Follow the other examples' coding style.
    - Example of an example:

            <div data-playground="N4IgFiBcoE5S...cASlxA"></div>
            ```js
            Ractive({
                template: `
                    <button on-click="foo">make foo!</button>
                    <p>message {{hello}}</p>
                `
                on: {
                    'foo': function(){
                        this.set('hello', 'there');
                    }
                }
            })
