Official Documentation and Specification for Poggit Virions, Version 1.0
===

# Introduction
Virions are libraries for PocketMine-MP plugins. They should not be distributed directly to users, but instead, injected into plugins separately, and distributed as part of the plugins.

To maintain version compatibility of different plugins, virions are **shaded**, i.e. their namespace will be refactored, so all code references (but not references from strings, etc.) will be changed. This will allow each plugin to have its own instance of the library, where not even static fields will clash.

It is also possible to inject virions into other virions, although this may not be fully supported right now. However, only phars should be injected with virions; Neither source code of plugins nor that of virions should be injected with virion.

# Terminology
* **Virions** work like biological viruses, injecting their code into plugins. In biology, "virion" is the name for a virus when it is not in body cells. Here, to avoid confusion with computer viruses, the term "virion" is used, but sometimes virions are also referred to as **viruses** when referring to the infection process. _Both **virions** and **viruses** refer to the same thing in this context._
* Each virion is identified by its namespace in source code, called the **antigen**.
* The phar file that a virion is injected into is called the **host**.
* When injected into the **host**, virions are shaded, and the new namespace is called the **antibody**.

# Specification
## Virion development
* They MUST be versioned according to [semver](https://github.com/composer/semver).
* The antigen of a virion MUST be unique in any code that can be loaded in the server, including all plugins and virions and the PocketMine source code, as well as all libraries used by them. After the antigen of a virion is declared, **other virions or plugins MUST NOT declare any classes, namespace functions or namespace constants in the same namespace _or sub-namespaces_ of the antigen**, e.g. if a virion has the antigen `librarian\libweird`, no other plugins or virions can declare classes like `librarian\libweird\Foo` or `librarian\libweird\bar\Bar`.
* A virion, in development form (folder) or release form (phar), MUST contain the following components:
  * A `virion.yml` that declares the following attributes:
    * `name` (REQUIRED): The name of the virion. Symbols (excluding numbers) are not recommended in virion names.
    * `authors` (OPTIONAL): The list of authors developing the virion. This cacn be either a string or an array.
    * `antigen` (REQUIRED): The antigen of the virion as a namespace, without leading or trailing slashes.
    * `version` (REQUIRED): The version of the virion.
    * `api` (REQUIRED): The string array of API versions that the virion is compatible with. The host's compatible API versions will be reduced to the intersection of the virion `api` and the host's original `api`.
      * A virion MAY declare no API versions (`null`, boolean `false`, string `"*"`, empty array `[]` or empty object `{}`) only if it does not use anything from the PocketMine API, making it independent of the API version. However, it MUST then declare the `php` attribute.
      * A warning MAY BE emitted by the virion infection script if the plugin's `api` attribute is changed.
      * An error MAY BE emitted by the virion infection script if the plugin's `api` attribute is reduced to nothing.
    * `php` (OPTIONAL): The PHP versions that the virion is compatible with.
      * The virion infection script MAY remove the host's `api` versions that do not support the required virion `php` versions. For example, if the virion requires at least PHP 7.1, API versions that use PHP 7.0 and PHP 5.6 will be removed. If the virion requires only 5.6, API versions that use PHP 7.x will be removed.
    * `description` (OPTIONAL): A string description of the virion.
  * A `src` folder containing class files in PSR-0.
    <!-- * It MAY contain a `src/<namespace>/functions.php` file to declare namespace functions -->

## Virion usage
* Plugins using virions (and virions using other virions too <!-- TODO support recursive shading -->) MUST NOT expose classes declared in virions as parameters or return values to their API. This is because other plugins will not be shaded, and they will fail to work together.
