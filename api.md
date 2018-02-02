# Poggit API Documentation
All Poggit API endpoints are still hosted on `https://poggit.pmmp.io`. Currently, Poggit does not support any API endpoints that require login.

## Retrieving resources
In Poggit, a resource is a generated file. Examples include CI builds, release artifacts, release descriptions and release changelogs.

```http
GET /r/{resourceId}{/...}
```

This request retrieves the resource with the ID `{resourceId}`. To make browsers and clients download the file with a desired filename, a filename can be provided behind the resource ID, e.g. to download the resource #5 with the file name `plugin.phar`, the URL `https://poggit.pmmp.io/r/5/plugin.phar` can be uesd.

### Response
For a successful retrieval, Poggit returns a 200 OK. Some useful headers include:

* `Last-Modified` is the date that the resource was created (format: RFC7231)
* `Expires` is the date that the resource will no longer be available (format: RFC7231)
* `Content-Length` is the file size in bytes.
* `Content-Type`: It is the actual MIME type of the resource:

```
phar => application/octet-stream
txt  => text/plain
md   => text/markdown
html => text/html
```

### Retrieving a resource's linked markdown
Release descriptions and changelogs are usually in .html format, converted from the user's markdown input. To retrieve the original markdown content, `.md` can be appended to the resource ID directly, e.g. `https://poggit.pmmp.io/r/5.md` will retrieve the linked markdown resource for resource #5.

Poggit will not raise any warnings or errors if the resource is not linked to any markdown resources; it will simply ignore the `.md` modifier.

### Verifying a downloaded resource
Poggit provides sha1 and md5 checksums for each visible resource. To get them, simply change the `/r/` in the URL to `/r.sha1/` or `/r.md5/`. Other modifiers (including `.md`) can still work, e.g. `/r.sha1/5.md/5-sha1.txt` still retrieves the sha1 checksum for the linked markdown of resource #5.

## Retrieving a plugin list
You may retrieve a list of voted/approved plugins using this endpoint (along with some aliases which are functionally identical):

```http
GET /releases.json
GET /releases.list
GET /plugins.json
GET /plugins.list
GET /releases.min.json # this one will generate a minimized output
GET /plugins.min.json # this one will generate a minimized output
```

There are a few special points to note:
* This will return a JSON array of objects. Each object represents one **version**, so there may be multple objects that represent the same plugin but different versions.
* Dates are expressed in Unix timestamp, i.e. number of seconds since the Unix epoch
* `downloads` represents the number of IPs that have downloaded this **version** of the plugin, from all media including using the `/get/` endpoint, through a web browser and using the resource link directly.
* Large texts (description, changelog, license files) are saved in individual resource files, so follow the link to get the file. If the resource ID is 0 or 1 (ends with `/r/0` or `/r/1`), this means the resource is null, and there is nothing to download.
* `license_url` only has a value when it is a custom license. Use [GitHub's Licenses API](https://developer.github.com/v3/licenses/#get-an-individual-license) if you want to get details about a generic license (one from SPDX specification).
* There are many IDs in each object.
  * `id` is a unique ID for this version
  * `project_id` is a unique ID for this plugin
  * `repo_id` is the ID of the repo that hosts the plugin (the repo ID is same as the one on GitHub, which you may access through `https://api.github.com/repositories/<repo_id>`
  * `build_id` is the global ID of the Poggit-CI build that this artifact is created from. Although this is normally different for all releases, do not rely on this uniqueness -- only use this number if you want to get a link to the CI build (convert the number to hexadecimal form and prepend it with `https://poggit.pmmp.io/babs/`)

As this endpoint is frequently updated, the details will not be explained in this document. It might be more useful to [read the source code](https://github.com/poggit/poggit/blob/beta/src/poggit/release/index/ReleaseListJsonModule.php) that powers the endpoint, by searching the keyword `$_REQUEST` in the linked file.
