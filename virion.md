# Official Poggit Virion Documentation, Version 1.2

## Abstract
Poggit Virions ("Virions") are PHP libraries specifically used in PocketMine plugins. This documentation provides information on the workflow of virion development and usage.

## Introduction
Libraries are great in software development, but when multiple plugins use the same library, since they are executing in the same PHP runtime, the wrong version of the library may be used. The Virion framework aims to resolve this problem by shading the classes.

Virions are expected to be used by plugins, or by other virions. In this documentation, "virion user" refers to plugins/virions using a virion.

## The workflow
### Developing a virion
A virion does not need to contain a main class, but all symbols (classes, interfaces, traits, namespace functions and namespace constants) declared by the virion must be under the virion's namespace called the **antigen**, or under subnamespaces of the antigen. The antigen must be unique to the virion; no other virions or plugins can declare any symbols under the antigen namespace or its subnamespaces.

If the virion is to register other named global resources that cannot be put within namespaces, their names must either depend on the runtime namespace of a virion symbol or depend on a string provided by the virion user. For example, if the virion uses the AsyncTask thread store, the key passed to `AsyncTask::saveToThreadStore()` **must** be generated from the class's syntactic namespace reference (see the Appendix section for definition of "syntactic reference") or from a value passed from the virion user. `stream_wrapper_register()` is a similar case -- the protocol name must not be hardcoded by the virion.

The virion framework contains a PSR-0 source file `src` and a virion manifest file `virion.yml`. `virion.yml` contains these attributes:

| Name | Description | Example | Required/Optional |
| :---: | :---: | :---: | :---: |
| `name` | The name of the virion, currently unused, should match its Poggit project name | `libasynql` | Required |
| `version` | The version of the virion using semantic versioning | `0.1.0-beta` | Required |
| `antigen` | The antigen of the virion | `poggit\libasynql` | Required |
| `api` | The **only** PocketMine API versions this virion can be used with. Uses the same system as `api` in plugin.yml | `[1.4.0, 2.0.0, 3.0.0-ALPHA1]` | Either `api` or `php` |
| `php` | The **only** PHP versions this virion can be used with. Uses a similar system as `api` in plugin.yml | `[5.6, 7.0]` | Either `api` or `php` |
| `authors` | Authors of the virion, can be a list or a string | `[SOFe, PEMapModder]` | Optional |
| `description` | A short abstract of the virion | `Simple asynchronous SQL access` | Optional |

The virion developer must keep in mind that the same virion used in different plugins must not interact with each other. For example, 

### Developing a virion user (virion or plugin)
A virion user may be developed assuming that the symbols declared by the virion are loaded normally. However, all references to these symbols must be syntactic (see the Appendix section for definition of "syntactic reference").

### Testing a virion or plugin
It is advised that each virion has a basic plugin that uses the virion, serving as a tester.

Poggit provides the [DEVirion](https://poggit.pmmp.io/p/DEVirion) plugin; see its plugin description on the Poggit release page for detailed usage. It allows running a server with virions in phar form (released) or folder form (debugging), and plugins in phar form (released test subjects) or folder form (a virion user under development).

**Do not use DEVirion for non-debugging reasons**. DEVirion does not shade the virion classes, so multiple plugins using DEVirion may still cause compatibility problems, making the virion framework meaningless.

### Compiling a virion with Poggit
A Poggit virion project can be declared in the .poggit.yml of a repo similar to a Poggit plugin project, with two additional project attributes:

```yaml
type: library
model: virion
```

Example:

```yaml
projects:
  libasynql:
    path: path/to/libasynql
    type: library
    model: virion
```

### Compiling a virion without Poggit
No official tools have been created to compile a virion release directly, but build scripts compiling a virion release can be created easily.

Basically, a virion release has the same format as the plugin release, except with four differences:
- `plugin.yml` becomes the `virion.yml`
- `resources` are not supported (may be added in the future).
- A file called `virion.php` and a file called `virion_stub.php` are included into the phar. These files can be [downloaded from the Poggit Git repo](https://github.com/poggit/poggit/tree/beta/assets/php/).
  - The `virion_stub.php` provides a command-line user interface for virion injection
  - The `virion.php` contains the code that actually injects the virion.
- The phar stub should load the `virion.php` directly. This is an example valid stub:

```php
<?php require "phar://" . __FILE__ . "/virion_stub.php"; __HALT_COMPILER();
```

See the [Poggit virion builder](https://github.com/poggit/poggit/blob/d587ecf3891270bd37940bf5640fca1eb7e374ad/src/poggit/ci/builder/PoggitVirionBuilder.php?utf8=%E2%9C%93#L50-L52) for reference.

### Compiling a virion user with Poggit
A virion user (plugin or virion that uses a virion) may declare virions used in .poggit.yml so that Poggit will inject the virions when building the plugin. Virions can be listed in the `libs` attribute of a plugin project. Each list entry is a mapping containing these attributes:

| Name | Description | Format / Example | Required/Optional |
| :---: | :---: | :---: | :---: |
| `format` | The format of the library | `virion` (the only valid value right now) | Optional (default `virion`) |
| `vendor` | Import the virion from a Poggit build, or from a file? | `poggit-project` OR `raw` | Optional (default `poggit-project`) |
| `src` (`vendor: poggit-project`) | The full path of the Poggit project | `/projectName` (projects in the same repo) OR `repoOwner/repoName/projectName` | Required |
| `src` (`vendor: raw`) | The HTTP/HTTPS URL to download the file, or a path relative to the project path in the repo | `https://example.com/virion.phar` OR `libs/virion.phar` | Required |
| `version` (`vendor: poggit-project`) | The [SemVer constraint](https://getcomposer.org/doc/articles/versions.md) for the virion | `^1.0` | Required only if `vendor: poggit-project` |
| `shade` | The shading strategy | `syntax` OR `single` OR `double` | Optional (default `syntax`) |
| `branch` (`vendor: poggit-project`) | Only virion builds from this branch on the virion's repo will be used | the branch name OR `:default` for the default branch (usually `master`) OR `*`/`%` for any branches | Optional (default `:default`) |
| `epitope` | An extra namespace part to append to the antigen | `.random`, `.sha`, `.none` or literal valid namespace part(s) | Optional (default `libs`) |

> ##### Note
> For security reasons, Poggit ignores the virion.php in raw virion files and always uses the latest `virion.php` from Poggit itself.

### Compiling a virion user without Poggit
A properly-built virion contains a stub and the `virion_stub.php` and `virion.php` file. These files together provide a CLI for injection virions into virion users.

The basic uasge:

```bash
php used_virion.phar virion_user.phar ${ANTIBODY_PREFIX}
```

`${ANTIBODY_PREFIX}` should be the main namespace of the virion user (namespace of main class for plugins, antigen for virions). Remember to escape backslashes.

## Limitations
- Virion users must not expose virion classes in their API. If they have to expose such objects in their API, they should be wrapped in an interface declared by the virion user.

## Appendix
### Syntactic references
Basically, a syntactic reference is defined as:

> A `T_NAMESPACE` (`namespace`), `T_USE` (`use`) or `T_NS_SEPARATOR` (`\`) token, or `T_USE` + `T_FUNCTION` (`use function`) or `T_USE` + `T_CONST` (`use const`), followed by a consecutive series of `T_STRING` (a non-keyword set of characters, i.e. part of the namespace) and `T_NS_SEPARATOR` (`\`).

(Support for `use function` and `use const` was added in Virion Builder Version 1.1)

In simple words, you should **only** reference a virion class/function/constant's namespace using the following formats:

```php
namespace name\space;
use name\space\Clazz;
use function name\space\func;
use const name\space\CONSTANT;
\name\space\Clazz::method();
```

For example, assuming we have a virion with the antigen `poggit\libasynql`:

```php
// syntactic reference
use poggit\libasynql\SqlResult as Result; 
$result = new Result;

// syntactic reference
$result = new \poggit\libasynql\SqlResult;

// syntactic reference
use poggit\libasynql\SqlResult as Result;
$class = new \ReflectionClass(Result::class);

// syntactic reference
$class = new \ReflectionClass(\poggit\libasynql\SqlResult::class);

// syntactic references, from the scope of a class method in poggit\libasynql\SqlResult
$class = new \ReflectionClass(self::class);
$class = new \ReflectionClass(static::class);
$class = new \ReflectionClass(get_class());
$class = new \ReflectionClass(__CLASS__);
$class = new \ReflectionClass(__NAMESPACE__ . "\\SqlResult"); // a boundary case barely acceptable

// non-syntactic reference
$class = new \ReflectionClass("poggit\\libasynql\\SqlResult");
$class = new \ReflectionClass('poggit\libasynql\SqlResult');
```

Note that relative reference from the namespace will not be shaded. Therefore, **do not use relative references to virion namespaces**. However, you should avoid writing code in a namespace where the virion antigen is its sub-namespace, e.g. if the virion antigen is `namespace poggit\libasynql`, no code from the `namespace poggit` should be written.
