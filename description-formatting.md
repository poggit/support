Poggit allows plugin description and changelog to be written in formats "gfm" and "sm", both of which are markdown formats powered by GitHub. Documentation for markdown can be found [here](https://guides.github.com/features/mastering-markdown/).

To adapt to Poggit's web interface, several addition changes are made before displaying the markdown. This article introduces these changes.

## Renaming anchors
An anchor is the part behind `#` in a link, and the browser will scroll to the anchor if it is in the link. The same markdown results in  different anchor names on Poggit and on GitHub.

You may skip this "Renaming anchors" section, since Poggit does most of it automatically, and you just have to copy the link on the Poggit webpage after the plugin has been submitted.

### Anchor definition in section headers
When you add a header in markdown, anchors are created along with it. For example:

```markdown
# Lorem ipsum
```

This will create an `<h1>` header with the text "Lorem ipsum", along with the anchor `#lorem-ipsum`.

In the plugin page on Poggit, there may be two markdown sections, namely the description and the changelog. To prevent duplicated anchors, the anchors are instead prepended with `rdesc-section-` (description) or `rchlog-section-` (changelog). So the anchor for the above markdown becomes `#rdesc-section-lorem-ipsum` (or `#rchlog-section-lorem-ipsum` for changelogs).

### Anchor definition in literal HTML
Markdown also allows you to add certain HTML elements (see [this link][html_whitelist]), which you can use the `id` attribute (or `name` in `<a>`) to define an anchor. Poggit will process these anchors differently -- since these are normal anchors not sections, the prefixes are `rdesc-anchor-` and `rchlog-anchor-` respectively. For example, this markdown in description is equivalent to the HTML below:

```markdown
<a name="dolor-sit-amet">consectetur adipiscing elit</a>

<div id="integer-nec">odio</div>
```

```html
<a name="rdesc-anchor-dolor-sit-amet">consectetur adipiscing elit</a>

<div id="rdesc-anchor-integer-nec">odio</div>
```

### Anchor reference in links
You may have internal anchor links in your markdown page, e.g. if you want to create a table of contents. Poggit will update these anchor references for you automatically if they are not dead links (i.e. there is really an anchor with that name; Poggit will decide whether it is a section anchor or a custom anchor).

You may optionally prepend `user-content-` to the anchor reference. Poggit will delete it automatically, if there is really an anchor with that name.

If you want to link to anchors in the Poggit page, you can link as-is. For example, if you want to scroll to the license box, you can write `[link text here](#license)`. However, if you have a section/custom anchor also named `license`, the section/custom anchor will be linked. If you really want to link the Poggit one, you can prepend `poggit-` to it, e.g. `[link text here](#poggit-license)`.

## Hyperlink context
As described in the plugin submission form, hyperlinks are relative to your project path. This also applies to image references.

For example:

* your plugin is from the repo https://github.com/poggit/support
* your project is in the `plugin/` directory in the repo
* the build you submitted is created from the commit `a1b2c3d`

Then:
* Links that only contain an anchor (start with `#`) will, of course, be relative to the plugin page on Poggit.
* Links that contain a relative path (e.g. `src/poggit/Main.php`, `../icon.png`) will be relative to `https://github.com/poggit/support/blob/a1b2c3d/plugin/`
* Links that contain a domain-absolute path (start with a single `/`) will be relative to `https://github.com` (not Poggit!)
* Other links will not be processed.

## Tab conversion

  [html_whitelist]: https://github.com/jch/html-pipeline/blob/cdb943678efc905ec542487f33413e0ba0d322f3/lib/html/pipeline/sanitization_filter.rb#L42-L44
