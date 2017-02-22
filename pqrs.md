# Plugin Quality Requirement Standards (PQRS) Version 1.1

## 0. Definition of terms
* Keywords of requirement levels used in this document are specified in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) and [RFC 6919](https://www.ietf.org/rfc/rfc6919.txt).
* "Author" refers to the developer, or the team of developers, the GitHub user accounts behind them, or the GitHub organization of developers, who **initially** wrote the plugin.
* "PocketMine" and "Server" refer to the edition of PocketMine-MP as developed at https://github.com/pmmp/PocketMine-MP, referring to the latest commit on the master branch at the time the plugin is released, unless otherwise specified.
* "THREAD-BLOCKING OPERATIONS" refers to operations (usually a function, or a series of direct/indirect function calls) that are expected to take a long time to complete, usually taking more than 50% of a tick (25 milliseconds).
  * For operations that vary in execution time, consider the lower quartile time on an average VPS server.

## 1. Namespaces
* Each plugin MUST have its unique base namespace. A base namespace is the namespace that the main class belongs to, and (grand)parent namespace of other namespaces in a plugin.
  * Some plugin lists/managers may identify plugins by their base namespace, just like what Google Play Store does. Even though this kind of management is not encouraged, plugins should still have their unique base namespaces.
* All classes SHOULD be directly or indirectly be under the base namespace, UNLESS for special technical reasons where the cost of putting the class under the base namespace is very high, e.g. if it affects user experience (which REALLY SHOULD NOT happen).
* Namespace functions and namespace constants SHOULD also be directly or indirectly under the base namespace of the plugin, UNLESS as stated above. However, developers of plugins using namespace functions and namespace constants SHOULD CONSIDER using class constants and static functions in an utility class/main class instead.
* The base namespace MUST contain the plugin name that sufficiently identifies the plugin. It SHOULD also contain the author name, UNLESS:
  * the plugin is an API that is going to be widely and conveniently used (debatable);
  * the plugin's author is an organization that is dedicated for the plugin; OR
  * it is an official plugin developed by the PocketMine Team (a.k.a. PMMP Team)
* **By convention, developers COULD use the format `AuthorName\PluginName`**, where both `AuthorName` and `PluginName` are clear enough to specify the actual author/plugin referred (but not abbreviations).
* Plugins MAY use a base namespace under the base namespace of another plugin. However, they REALLY SHOULD NOT do so if the plugin is irrelevant to the other plugin. This is RECOMMENDED ONLY IF the plugin is an extension plugin of the former plugin, _AND is written by the same author_.
* Changing a plugin's base namespace due to version change or author change SHOULD NOT be done. NOR SHOULD a plugin change its base namespace UNLESS it is _fully rewritten_ (and remarkably distinctive), which then, a new base namespace SHOULD BE CONSIDERED.

This specification _does not have_ any namespace naming case conventions RECOMMENDED, but developers COULD use the `PascalCase` convention as it is used in various popular plugins, for example: `SOFe\Basin\Basin`. However, this is **not a requirement**.

Poggit hosts a W.I.P. (as of 2017-02-22) fully-qualified class name list at https://poggit.pmmp.io/fqn.txt. Developers SHOULD consult this list when inventing a new base namespace.

## 2. Commands
### A) Registering commands
* While PocketMine has a command prefix mechanism, where commands from different plugins can be distinguished through /pluginname:commandname, for users' convenience, developers REALLY SHOULD NOT name commands anything that is likely to duplicate with other plugins. Developers COULD (and WE KNOW YOU WON'T, because it is too inconvenient and duplication is likely although acceptable) check if the command names duplicate with other plugins before releasing them.
  * Duplication of command names that are reasonably specfic, or merely aliases, are acceptable. However, command names (but not aliases) SHOULD NOT duplicate those from PocketMine, unless 

### B) Overriding existing commands
* Plugins SHOULD CONSIDER use this method recommended by @shoghicp: https://gist.github.com/a540360b7323f7cc656f

## 3. Permissions
* By convention, permission nodes MUST be named with one or more alphanumeric words/phrases joined by dots, all in lowercase. (In regex: `/^[a-z0-9]+(\.[a-z0-9]+)*$/`) Whether hyphens can be used is disputed.
* Plugins MUST have all permission nodes named under a root permission node named with the plugin name, just like all default permissions are named under the pocketmine permission node (named pocketmine.***). While many existing plugins do not follow this standard, new plugins MUST follow it.
* According to @shoghicp, all permissions SHOULD inherit in the inheritance as its name. For example, the permission node named foo.bar should be the child permission of the permission node named foo. BUT WE KNOW YOU WON'T, because it is usually pointless and impractical to have such inheritance relationship. Nevertheless this is still encouraged.

## 4. Tasks and Concurrency
* All synchronous tasks initiated by plugins MUST extend `pocketmine\scheduler\PluginTask` and pass the owner context as the plugin that _initially_ triggered this task, or any relevant plugins that depend on that plugin (but not the other way round).
* Asynchronous tasks MUST check whether their owner plugin is still enabled when running `onCompletion`. They SHOULD also CONSIDER checking it in onRun regularly to cancel the task if it is considerably long (there is a planned enhancement in the PocketMine API for this).
* Asynchronous tasks queued in the `ServerScheduler` async workers MUST NOT execute indefinitely (i.e. MUST NOT have something like a while loop that only breaks waiting for user action or undesired interruptions). On average, each MUST NOT take more then 30 seconds to execute (`onRun` only). For long AsyncTasks, consider starting your own async workers. For indefinitely long operations, e.g. a server, start a thread instead of using async workers.
* Plugins MUST stop all custom threads (including workers) started by them when disabled; if inappropriate to wait for thread joining, they MUST at least notify the threads to stop.
* Plugins should avoid carrying out THREAD-BLOCKING OPERATIONS on the main thread, and CONSIDER using asynchronous tasks instead, except during `onLoad()`, `onEnable()` and `onDisable()`. This includes those initiated by rarely-used commands and low-frequency synchronous tasks. Specifically:
  * Plugins MUST NOT execute _any_ cURL calls.
  * Plugins REALLY SHOULD NOT use MySQL queries.
  * Plugins COULD use asynchronous tasks for file I/O on the local harddisk, but it is usually unnecessary.
* As for operations during `onLoad()`, `onEnable()` and `onDisable()`, they should operate for 

## 5. Event handling
* Event handlers MUST NOT modify or cancel or uncancel events at the ``MONITOR` priority.
* Plugins OUGHT TO appropriately ignore cancelled events.
* Keep in mind that event handlers at LOWEST priority are executed before HIGHEST:
```
LOWEST -> LOW -> NORMAL -> HIGH -> HIGHEST -> MONITOR
```

Therefore, it is RECOMMENDED that plugins that plugins modifying events in a specific manner (e.g. handling specific block interaction in a sign-clicking plugin) use LOW priority, while plugins modifying events in a large scale (e.g. area protection plugins cancelling all block interaction in an area) use HIGH priority.

## 6. Custom events
Custom events SHOULD extend pocketmine\event\plugin\PluginEvent, preferrably with a superclass for all events from the same plugin.
