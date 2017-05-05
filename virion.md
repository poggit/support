Official Documentation and Specification for Poggit Virions
===

# Introduction
Virions are libraries for PocketMine-MP plugins. They should not be distributed directly to users, but instead, injected into plugins separately, and distributed as part of the plugins.

To maintain version compatibility of different plugins, virions are **shaded**, i.e. their namespace will be refactored, so all code references (but not references from strings, etc.) will be changed. This will allow each plugin to have its own instance of the library, where not even static fields will clash.

It is also possible to inject virions into other virions, although this may not be fully supported right now. However, only phars should be injected with virions; Neither source code of plugins nor that of virions should be injected with virion.

# Terminology
* Virions work like biological viruses, injecting their code into plugins.
* Each virion is identified by its namespace in source code, called the **antigen**.
* When injected, virions are shaded, and the new namespace is called the **antibody**.

# Specification
## Virion development

* They must be versioned according to [semver](https://github.com/composer/semver).
* The antigen of a virion must be unique in any code that can be loaded in the server, including all plugins and virions and the PocketMine source code, as well as all libraries used by them. After the antigen of a virion is declared, **other virions or plugins must not declare any classes, namespace functions or namespace constants in the same namespace _or sub-namespaces_ of the antigen**, e.g. if a virion has the antigen `librarian\libweird`, no other plugins or virions can declare classes like `librarian\libweird\Foo` or `librarian\libweird\bar\Bar`.
* A virion, in development form or release form, should contain the following components:
  * A `virion.yml` that declares the following attributes:
    * `name` (REQUIRED): The name of the virion. Symbols (excluding numbers) are not recommended in virion names.
    * `authors` (OPTIONAL): The list of authors developing the virion. This cacn be either a string or an array.
    * `antigen` (REQUIRED): The namespace unique to the 
