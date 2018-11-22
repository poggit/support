---
title: Plugin Submission Rules
---

## (A) About the plugin
These rules are about the idea of your plugin. Plugins with purpose violating these rules **will never be approved**.

### 1. Complete and serve a purpose
The plugin must be **complete and serve a purpose**. It is OK to have parts of the plugin not yet working, but they must be disabled by default. The other parts must serve a meaningful purpose.

For example, it is reasonable to have a world editor plugin where only cuboid selection and setting blocks work, without support of spheres, copy/paste, etc. However, it is not reasonable to have a plugin where only cuboid selection works, because a plugin that only selects cuboids but does not do anything with it is completely useless.

### 2. Serve a *specific* purpose
The plugin must **serve a *specific* purpose** and be useful to the majority of users.

"Core plugins" are not accepted, because they are only useful on specific private servers.

Plugins that contain many mutually irrelevant features are also not allowed, because they are a major source of bloatware (EssentialsPE and GrabBag are the only two exemptions due to their historical significance). Developers should strike a balance between "too bloated" and "too simple", because both are undesirable for users.

### 3. No duplicates
If there is another plugin that covers every single feature your plugin has, you must not submit yours, unless the existing one has been outdated and unmaintained for more than one month. You may want to explain why your plugin is better than the existing ones in the description.

### 4. No remote code execution
If the plugin requires an external API, it must either be from a reputable provider (e.g. Google APIs) or has high transparency. It must be clear that the plugin cannot be used as a backdoor for hacking servers. In particular, remote code execution is strictly prohibited. This includes auto-updaters from sources other than Poggit Release.

### 5. Payment must be optional
The plugin must not impose limitations such that it is unusable without paying the developer. The plugin must at least be usable by a server with about 5 players online all-time. This is to make sure users have a chance to test your plugin without paying first.

If the plugin uses an external API requires payment, it must have a reasonably usable free plan (e.g. a rate-limited free plan for ordinary small/medium-scale servers). It must also be transparent that paying will really do what is promised.

### 6. Libraries & API plugins
Libraries must be included as [virions](https://poggit.pmmp.io/virion). They must not be released as individual plugins.

The *only* exception is when the plugin manages the compatibility among other plugins (a.k.a. "API plugins"). Rule 3 ("no duplicates") is enforced more strictly regarding API plugins. API plugins must also have clear documentation for other plugin developers.

## (B) About the code
These rules are about the code in your plugin. If a plugin violates these rules, reviewers **will reject the plugin**, and you will have to change your code and submit the new build.

### 1. No unused API versions
Plugins must not support **unreleased** API versions, i.e. anything not found in https://github.com/pmmp/PocketMine-MP/releases

Plugins must not list **redundant** API versions in the plugin.yml. Only the earliest supported API in each major version needs to be listed, i.e. `3.2.0` is not necessary if `3.1.0` is already listed

### 2. No obfuscation
The source code must be **readable and not obfuscated**. All PHP code can eventually be deobfuscated, so there is really no point of close-sourcing them.

### 3. No eye-catching messages in startup/shutdown
Colored messages, ASCII art, etc., are not allowed when the plugin is enabling/disabling under normal circumstances. This is explained in https://bit.ly/pmcolors.

They are allowed if they represent actual warnings/errors or if they are responding to user input.

Plugins are discouraged from logging unnecessary "I have been enabled" status messages, unless it takes really much time (more than 1 second) such that the user may become impatient.

### 4. Default must be English
It is great if your plugin supports other languages, but since English is the most common languages that everyone knows, the default language must be set as English.

### 5. Only submit your own plugins.
**Do not submit plugins written by others** without their prior permission. If the author is inactive, it must be released through @poggit-orphanage. Create an issue at [orphanage office](https://github.com/poggit-orphanage/office/issues/new). You will be allowed to maintain the plugin as a member of @poggit-orphanage upon approval

## (C) About compatibility
These rules are here to make sure different plugins work well together. If a plugin violates these rules, reviewers **will reject the plugin**, and you will have to change your code and submit the new build.

### 1. Namespace format
> TL;DR: change your plugin namespace to `YourName\PluginName`

#### a. Naming the namespace
All plugins must choose a **unique namespace** that will not be accidentally collided by other plugins. The plugin must begin with the author name (unless it's an official plugin, because the namespace `pocketmine` is disallowed), followed by any identifier such that the author himself remembers which plugin it corresponds to. The recommended namespace format is `AuthorName\PluginName`. The author name should use one that corresponds to the GitHub username/org name to prevent collision.

The unique namespace of one plugin may be the subnamespace of another plugin *only if* they are both developed and maintained by the same author. However, this is generally not recommended.

#### b. Using the namespace
All classes, interfaces and traits declared by plugins must be under this unique namespace (or subnamespaces). This includes libraries bundled with the plugin. Consider using the [virion framework](https://poggit.pmmp.io/virion), which provides a convenient way of shading libraries (i.e. refactoring libraries into your plugin's namespace).

#### c. Changing the namespace.
Plugin namespace should not change once it has been submitted unless there is an enormous API change that requires changing the namespace. But developers are recommended to obsolete the old version and submit a new plugin instead.

### 2. Commands
#### a. Command fallback prefix
If the plugin registers commands by calling `CommandMap->register` directly, the `fallbackPrefix` parameter passed to the register function must be the plugin name. Plugins are not allowed to use its initials, acronyms, etc. for the fallback prefix.

#### b. Plugin-identifiable
All commands must implement the `PluginIdentifiableCommand` interface and return their plugin instance.

### 3. Permissions
If the plugin registers permissions, all permission names must start with the plugin name (does not need to contain the author name like the namespace). The permission name should only consist of alphabets, digits, hyphens and dots.

### 4. Events
#### a. Pay attention to `@ignoreCancelled` and `@priority`
These two tags control when and whether your event handlers are executed.

By specifying `@ignoreCancelled true`, your event handler will not be executed if another plugin cancelled it.

By specifying `@priority`, you change your event handler priority. Handlers are executed in this order:

```
LOWEST -> LOW -> NORMAL -> HIGH -> HIGHEST -> MONITOR
```

In general, use `NORMAL` if you aren't sure, use `LOW` if you only handle particular instances of an event (e.g. only handle BlockBreakEvent for shops), and use `HIGH` if you handle most instances of an event (e.g. area protection). Use `MONITOR` if you just want to know the final outcome.

#### b. Do not modify the event in `MONITOR` priority
No. Don't do that, even if you have technical difficulties and need to do so. Head out to our Discord to discuss for a better solution.

### 5. Filesystem
#### a. Stay in your data folder
Except for plugin managers and plugins that affect how the server starts, do not create any files outside the designated `$this->getDataFolder()` directory. Do not assume that `chdir()` will only be used by your plugin. (Ideally, don't use `chdir` at all)

#### b. Identify injected data by plugin namespace
If the plugin injects data to locations not managed by itself, the data must always be placed in a group identified by the plugin **namespace** (not just the plugin name). For example, if the plugin with namespace `SOFe\SomePlugin` injects a custom NBT tag into an entity or an item, it must store its data under a compound tag called `SOFe\SomePlugin`. (Aliases e.g. `SOFe.SomePlugin` are allowed as long as they can translate into the plugin namespace and be unique)

## (D) About the submit form
These rules are about the plugin submission form on Poggit. If a plugin violates these rules, reviewers **will reset the plugin to draft**, and the developer can edit the submission form and **submit the same build again**.

### 1. Detailed description
The description should give an idea what the plugin is about, why it is useful, etc. Do not assume everyone knows the terminology; explain them.

### 2. The description must be available in English.
Translations are allowed, but English must be available first. We assume English as the language that most users know.

### 3. Clean description
Do not provide irrelevant information in the description. See [description guide](description-format.md) for details. Do not advertise in the description. (Leaving a reasonable number of contacts is allowed)

### 4. Beautiful description
Format your description properly. The [description formatting documentation](description-formatting.md) helps formatting according to Poggit's special mechanisms like pagination.

### 5. Informative changelog
The changelog should be informative, in case the commit messages are not informative enough. The changelog should not contain meaningless lines like `Updated README.md`.

### 6. Pick a license carefully.
If you want to use a custom license, make sure it is formal enough. Examples of bad licenses include `Everyone can use this plugin except leet.cc and @someone-I-hate`.
