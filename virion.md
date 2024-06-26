# Virion Documentation, Version 3.1

> The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
> NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and
> "OPTIONAL" in this document are to be interpreted as described in
> [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## Abstract

Virions are PHP libraries shipped within PocketMine plugins
with version collision prevention implemented through shading.
This document specifies the standards for both virion development and usage.

Virion v3 integrates with the Composer ecosystem for more vendor-agnostic tooling
and decouples virion usage and distribution from Poggit.

## Introduction

In PHP, classes are autoloaded and linked at runtime.
If multiple versions of the same class are added to the class path,
it is undefined which version would be loaded,
risking loading two classes of the same library from two different versions.

The Virion standard aims to solve this problem from a static linking approach
by "shading" the classes, i.e. refactoring the classes in libraries
to a unique namespace owned by the plugin to avoid duplication.

## Library specification

Virions are distributed as a normal composer library.
It MUST also declare a `virion` extra attribute in the composer.json:

```json
{
  "other": "normal fields...",
  "extra": {
    "virion": {
      "spec": "3.1",
      "namespace-root": "Name\\Space",
      "shared-namespace-root": "Shared\\Name\\Space" # optional
    }
  }
}
```

`spec` is the version of the virion specification (i.e. this document).
Do not change this field unless
the library requires features in newer versions of the virion specification.

### Namespace root

`namespace-root` is a unique namespace root owned by the virion.
All items declared by the virion MUST reside in this namespace
or its subnamespaces, e.g. `Name\Space\Child` but not `Name\SpaceSuffix`.
All items *not* declared by the virion MUST NOT be under this namespace root,
and SHOULD avoid using it as a substring in their fully-qualified paths
(the latter is only a foolproof requirement to reduce misbehavior of shading tools).
To avoid ambiguation, the virion namespace root
MUST have at least two parts separated by a `\`.

A virion MUST only export the following items under the namespace root:

- Classes
- Enums
- Interfaces
- Traits

Namespace functions, namespace constants and global variables MUST NOT be used.

### Shared namespace root

`shared-namespace-root` is similar to `namespace-root`,
but items declared under the shared namespace root are not shaded.
This is to allow (potentially different versions of) the same virion
to be used in multiple plugins as separate shaded instances
but still communicate correctly through the shared namespace.

The shared namespace root MUST NOT intersect with the namespace root.
Conventionally, developers CAN use the form `Shared\{NamespaceRoot}` as the shared namespace root.

A virion MUST only export the following items under the shared namespace root:

- Enums
- Interfaces
  - Constant definitions must be resolvable at compile time.
- Classes with only public fields and public constants.
  - Abstract and final classes are allowed
  - Public static fields are allowed.
  - Constant definitions must be resolvable at compile time.

Items in the shared namespace MUST NOT reference any shaded items,
including shaded items declared by transitive dependencies.
The term "reference" here includes parameter types, return types,
`extends`/`implements` target and attributes.

Once a virion has been published,
the definition of all items under the shared namespace root MUST NOT ever be changed.
In particular:

- Semantics-sensitive attributes and doc comments MUST NOT be changed.
- For enums, cases MUST NOT be added, removed, renamed or rearranged.
  (Reordering breaks the stability of `UnitEnum::cases()`).
- For interfaces, methods and constants MUST NOT be added, removed or renamed,
  but MAY be rearranged.
  The values of constants and default values of method parameters
  MUST remain the same when resolved under the same circumstances.
  Parameters MAY be renamed,
  but the parameter types and return types MUST NOT change
  (subtypes/supertypes are not allowed).
- For classes, all fields MUST NOT be added, removed or renamed or change in staticness,
  but MAY be rearranged.
  The values of constants and default values of the fields
  MUST remain the same when resolved under the same circumstances.
  Field types MUST NOT change (subtypes/supertypes are not allowed).

### Declaring dependencies

A virion or a plugin MAY also declare `require` dependencies.
However, only dependencies that declare the `extra.virion` field are included.
Transitive dependencies are included if and only if
all steps between the plugin and the transitive dependency also have the `extra.virion` field.
Multiple instances of the same dependency are only shaded once,
so multiple libraries using the same dependency may accept the dependency type directly.
However, library types must not appear directly on cross-plugin API boundaries
as they would be incompatible due to shading.

When a virion references its own classes from a global scope,
the virion namespace root MUST be a contiguous, intact prefix of the reference,
parsed in the form of `T_NAME_QUALIFIED` or `T_NAME_FULLY_QUALIFIED`.
In other words, for a virion with namespace root `Foo\Bar`:

| Corollary | Good examples | Bad examples |
| :---: | :---: | :---: |
| Nested use statements MUST NOT split the namespace root. | `use Foo\Bar\Qux;` <br/> `use Foo\Bar\{Qux}` | `use Foo\{Bar\Qux}` |
| Aliases MUST NOT split the namespace root. | `use Foo\Bar as Qux; Qux\Xxx::yyy();` | `use Foo as Qux; Qux\Bar\Xxx::yyy();` |
| String class paths are not allowed | `\Foo\Bar\Qux::class;`/`Relative::class` <br/>`self::class`/`get_class()` <br/> `__CLASS__`/`__NAMESPACE__` <br/> `"Foo\\Bar\\Qux"` |

It is valid to test whether the virion has been shaded using `__NAMESPACE__ !== "anti\\gen"`.

If a virion declares any global resources (such as `stream_wrapper_register`),
they MUST include the namespace as a source of generating the identifier,
e.g. by appending `crc32(__NAMESPACE__)`.

## Virion developer guide

To develop a virion, create a composer library by creating the composer.json:

```yaml
{
  "name": "sof3/await-generator",
  "require": {
    "pocketmine/pocketmine-mp": "^5.0.0", # RECOMMENDED unless virion does not use PM API
    "php": "^8.1" # OPTIONAL but RECOMMENDED if pmmp/pocketmine-mp is omitted
  },
  "autoload": {
    "classmap": ["src"]
  },
  "extra": {
    "virion": {
      "spec": "3.1",
      "namespace-root": "SOFe\\AwaitGenerator",
      "shared-namespace-root": "Shared\\SOFe\\AwaitGenerator" # optional
    }
  }
}
```

Then release this virion as with a normal composer library &mdash;
push to GitHub, [submit on Packagist](https://packagist.org/packages/submit),
then [release on GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

A significant difference from Version 1.0 is that
virions depended by other virions are not double-shaded.
Shading only takes place once for each virion,
so different libraries from the same plugin can interact with the same interface
but cannot interact with libraries included from other plugins.

## Virion user guide

To use a virion, first create a composer.json for your project:

```yaml
{
  "name": "author/project",
  "require": {
    "pocketmine/pocketmine-mp": "^5.0.0"
  },
  "autoload": {
    "classmap": ["src"]
  }
}
```

For each virion, add an entry to the `require` attribute
just like normal composer libraries:

```diff
  {
    "name": "author/project",
    "require": {
+     "sof3/await-generator": "^3.0.0",
      "pocketmine/pocketmine-mp": "^5.0.0"
    },
    "autoload": {
      "classmap": ["src"]
    }
  }
```

To run this plugin, compile it with a virion compiler tool
such as [pharynx](https://github.com/SOF3/pharynx).
The tool shall scan virions from the composer.json automatically
and install them.

## Previous versions

A virion that uses spec version `x.y`
also conforms to spec versions `x.z` where `z >= y`.
The converse may not be true as new minor versions may introduce
new features that require newer versions of virion-related tools.

Tools that treat virions specially MUST abort with an error
if the specification version is newer than what the tool supports.

### Version 3.0 -\> 3.1

Version 3.1 introduces the notion of "shared namespaces"
to allow cross-instance communication using shared data classes, interfaces and constants.

### Version 1.x -\> 3.0

Version 1 was largely coupled with Poggit, resulting in vendor lock-in and poor tooling.
Its dependency declaration was coupled with Poggit
and was not supported by most external tools,
causing a lot of inconvenience for developers
when trying to integrate third-party PHP tools such as editors and static analysis.

### Version 2.x -\> 3.0

Version 2 was never implemented as its specification was too sophisticated,
attempting to solve many problems such as
shared paths, resource reference and init functions.
These are omitted in Version 3.0 as they do not necessarily require a major version.

Version 3 is based on Version 1 and does not borrow any concepts from Version 2.
