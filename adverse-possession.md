# Adverse possession policy

## Summary
Developers can use this procedure to adopt unmaintained plugins when the original author is no longer active.

## Procedure
Consider the scenario where user `alice` created a plugin called `Foo` (in the repository `alice/Foo`), and `bob` wants to adverse-possess it.

### 1. Eligibility
Adverse possession is only eligible when at least one of the following conditions are met:

- For at least 14 days, the latest released PocketMine version
  (excluding pre-releases like 4.0.0-BETA1)
  is incompatible with the plugin because of API version changes.
- For at least 28 days, the latest released PocketMine version 
  (excluding pre-releases like 4.0.0-BETA1)
  (is incompatible with the plugin because of `mcpe-protocol` changes.
- The plugin has one or more outstanding issue opened for at least 28 days,
  reporting a bug that significantly affects the usability of the plugin.

If eligibility conditions are not met, do NOT open an adverse possession request.
Consider creating a new plugin instead.

### 2. Pull request
`bob` forks `alice/Foo` to his own account (`bob/Foo`).
`bob` updates the code in `bob/Foo` such that all of the eligibility conditions in section 1 are resolved,
i.e. the plugin is now up-to-date and has no significant usability issues.
`bob` creates a pull request to merge his fix to `alice/Foo`.

### 3. Declaration
`bob` declares adverse possession of `alice/Foo` by creating an issue at https://githbu.com/poggit/support/issues,
linking to the pull request created in section 2,
and explaining the evidence for the eligibility conditions and that it is fixed in `bob/Foo`.

### 4. Objection
Poggit staff verifies the evidence provided in section 2,
and notifies `alice` about this adverse possession declaration by commenting in the pull request.

`alice` can file objection to the adverse possession declaration
within 7 days of confirmation using one of the following methods:

- Merge the pull request and update the plugin on Poggit
  before the 7-day objection period ends.
  Since it is no longer eligible for adverse possession,
  the procedure terminates immediately.
- Write their own fix to resolve the eligibility conditions
- and update the plugin on Poggit before the 7-day objection period ends.
- Since it is no longer eligible for adverse possession,
- the procedure terminates immediately.
- Claim a license violation.
  If `bob/Foo` violates the license in `alice/Foo`,
  the adverse possession procedure terminates immediately.
- Disprove the fix in `bob/Foo`.
  If the eligibility conditions are not completely resolved in `bob/Foo`
  after the end of the 7-day objection period,
  the adverse possession procedure cannot complete.

`alice` can also choose to voluntarily transfer the repository to `bob`,
in which case `bob` terminates the procedure.

### 5. Submission
If no effective objection is filed within the 7-day objection period,
Poggit administrators will proceed to reset the `releases.projectId` field of the plugin
to the project ID of `bob/Foo`.
After that, `bob` is required to submit their update for review.
If the update is not submitted within 7 days after the end of the objection period,
the project ID shall be reset to `alice/Foo`.

## Conditions
- While the new maintainer can add new features to the original plugin,
  they are not allowed to do this in the initial version of possession.
  The first version released must only update the plugin without any unnecessary behavioural changes.
  For non-outdated plugins, if the original author refuses to merge feature updates, 
  he new contributor must release the plugin under a different name (which is the current policy).
- The whole process must not violate any license requirements.
- Once the procedure completes, the original author can only regain ownership through another process of adverse possession.
  `alice` does not enjoy any privilege regarding the management of `bob/Foo`,
  except in the case of license violation,
  where `alice` is considered an ordinary collaborator instead of the code owner.
