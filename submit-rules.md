# Plugin Submission Rules

## (A) About the plugin
These rules are about the idea of your plugin. Plugins with purpose violating these rules **will never be approved**.

1. The plugin must be **complete and serve a purpose**. It is OK to have parts of the plugin not yet working, but they must be disabled by default. The other parts must serve a meaningful purpose. For example, it is reasonable to have a world editor plugin where only cuboid selection and setting blocks work, without support of spheres, copy/paste, etc. However, it is not reasonable to have a plugin where only cuboid selection works, because a plugin that only selects cuboids but does not do anything with it is completely useless.
2. The plugin must **serve a *specific* purpose** and be useful to the majority of users. "Core plugins" are not accepted, because they are only useful on specific private servers. Plugins that contain many mutually irrelevant features are also not allowed, because they are a major source of bloatware (EssentialsPE and GrabBag are the only two exemptions due to their historical significance). Developers should strike a balance between "too bloated" and "too simple", because both are undesirable for users.
3. **No duplicates**. If there is another plugin that covers every single feature your plugin has, you must not submit yours, unless the existing one has been outdated and unmaintained for more than one month.
4. Libraries must be included as [virions](https://poggit.pmmp.io/virion). They must not be released as individual plugins, *unless* it manages the compatibility among multiple plugins (a.k.a. "API plugins"). Rule 3 ("no duplicates") is enforced more strictly regarding API plugins.
5. Plugins must not **require payment**. If the plugin requires an external API, it must either be from a reputable provider (e.g. Google APIs) or has high transparency. It must be clear that the plugin cannot be used as a backdoor for hacking servers. If the external API requires payment, it must have a reasonably usable free plan (e.g. a rate-limited free plan for ordinary small/medium-scale servers). (Otherwise, Poggit reviewers will not be able to test it)

## (B) About the code
These rules are about the code in your plugin. If a plugin violates these rules, reviewers **will reject the plugin**, and you will have to change your code and submit the new build.

1. Plugins must **follow [PQRS](pqrs.md)**.
2. The source code must be **readable and not obfuscated**. (All PHP code can eventually be deobfuscated, so there is really no point of close-sourcing them)
3. **Eye-catching messages**, such as colored messages, ASCII art, etc., are not allowed when the plugin is enabling/disabling under normal circumstances. This is explained in https://bit.ly/pmcolors. (They are allowed if they represent actual warnings/errors or if they are responding to user input)
4. **Do not submit plugins written by others** without their prior permission. If the author is inactive, it must be released through @poggit-orphanage. Create an issue at [orphanage office](https://github.com/poggit-orphanage/office/issues/new). (You will be allowed to maintain the plugin as a member of @poggit-orphanage upon approval)
5. Plugins must not support **unnecessary or unreleased API versions**. In particular,
  - Only the earliest supported API in each major version needs to be listed, i.e. `3.2.0` is not necessary if `3.1.0` is already listed
  - Only API that have been [tagged on PocketMine](https://github.com/pmmp/PocketMine-MP/releases) are allowed. Unreleased versions are subject to change, so plugins must not declare to support them.

## (C) About the submit form
These rules are about the plugin submission form on Poggit. If a plugin violates these rules, reviewers **will reset the plugin to draft**, and the developer can edit the submission form and **submit the same build again**.

1. The description should give an idea what the plugin is about, why it is useful, etc. Do not assume everyone knows the terminology; explain them.
2. The description must be available in English. Translations are allowed, but English must be available first. We assume English as the language that most users know.
3. Do not provide irrelevant information in the description. See [description guide](description-format.md) for details. Do not advertise in the description. (Leaving a reasonable number of contacts is allowed)
4. Format the description properly. The [description formatting documentation](description-formatting.md) helps formatting according to Poggit's special mechanisms like pagination.
5. The change log should be informative, in case the commit messages are not informative enough. The change log should not consist of meaningless lines like `Updated README.md`.
6. Pick a license carefully. If you want to use a custom license, make sure it is formal enough. Examples of bad licenses include `Everyone can use this plugin except leet.cc and @someone-I-hate`.
