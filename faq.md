# Frequently-Asked Questions

### What is Poggit CI?
Poggit CI is a tool that **creates phar builds** from your code hosted on GitHub. Poggit CI is not used for releasing plugins. Phar builds found from Poggit CI are not reviewed, and can be dangerous to use. They may be dangerous, for example, cause bugs, delete all your worlds, give op to random players, install viruses, or even lock you out of the server.

### How to build my plugin on Poggit CI?
First, make sure your plugin is on GitHub.

Go to https://poggit.pmmp.io/ci, and make sure you are logged in. See the repo list (in the left sidebar on large screens). Find the repo that hosts your plugin, and click the toggle.

Poggit will show a popup to let you edit a `.poggit.yml` file. If your plugin has the correct structure, the default `.poggit.yml` will contain the correct information. Poggit will add the `.poggit.yml` into your repo, then your plugin will be built on Poggit.

### How to release/update my plugin?
To release a plugin, you should first [build your plugin on Poggit CI](#how-to-build-my-plugin-on-poggit-ci).

Go to your plugin's project page. Find the build you want to release, then click "Release..." on the leftmost column, choose "Submit"/"Update".

### What are the plugin submission rules?
First, you should follow [PQRS](pqrs.md), which is about how you should write your plugin so that it won't have conflict with other plugins. These are good practices that you should follow even if you aren't releasing your plugin on Poggit.

Second, before you submit your plugin, see [Poggit Submission Rules](submit-rules.md).

### Poggit CI has a stolen plugin
Poggit CI does not host code; it only hosts phar built from code on GitHub. Please [contact GitHub to takedown the repos containing stolen code](https://help.github.com/articles/dmca-takedown-policy/). We will not take down Poggit CI projects unless they violate copyright.

### Poggit Release has a stolen plugin
If you believe the released plugin does not sufficiently attribute your credit, [contact us on Discord][discord].

### I found a virus plugin on Poggit CI
We do not review plugins on Poggit CI. Unless they are spam, we will do nothing about them. If you believe that their existence is so dangerous that it should not be available anywhere on the Internet, please contact GitHub to delete their repos.

### I have other questions/I want to talk to a human
[Find us on Discord][discord].

  [discord]: https://discord.gg/NgHf9jt
