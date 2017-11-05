# Poggit API Documentation
All Poggit API endpoints are still hosted on `https://poggit.pmmp.io`. Currently, Poggit does not contain any API endpoints that require login.

## Retrieving resources
In Poggit, a resource is a generated file. Examples include CI builds, release artifacts, release descriptions and release changelogs.

```
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
