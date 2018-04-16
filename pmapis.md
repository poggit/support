Endpoint format:

```http
GET /pmapis[.full][.min][.xml|.yml|.json]
```

The `pmapis` endpoint returns data in several types: JSON, YAML and XML. The type can be specified by `[.xml|.yml|.json]`. The default is JSON. 

`.full` adds the following additional data entries:
- `promoted`: the latest non-development API (ALPHA versions are development)
- `promotedCompat`: the earliest API compatible with the latest non-development  API
- `latest`: the latest API
- `latestCompat`: the earliest API compatible with the latest API

`.min` minifies the output for XML and JSON. YAML cannot be minified.

The versions are listed in chronological order. Each version is an object containing the following data (an `<api>` element in XML):
- `description`: A string array, each string listing one important API change. (Each change is a `<summary>` element in XML)
- `php`: A string array, each string listing the supported PHP versions. (Each version is a `<version>` element in XML)
- `incompatible`: Whether the API is incompatible with the previous one. This compatibility is transitive, i.e. if A is compatible with B and B is compatible with C, then A is compatible with C too. (An attribute of `<api>` in XML)
- `indev`: Whether the API is still under development. False if it has been tagged. (An attribute of `<api>` in XML)
- `phar`: An object listing some phar links. (In XML, `<phar>` containing elements for each link whose name is the link type)
  - `default`: The default link to download a phar for this version. Only available since `3.0.0-ALPHA7`.
