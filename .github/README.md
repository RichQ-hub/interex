# GitHub Workflows

## `github-ci.yml`

### Caching Behaviour

#### 1. Resolving yarn cache directory path

```yml
- name: Get yarn cache directory path.
  id: yarn-cache-dir-path
  run: echo "dir=$(yarn cache dir)" >> $GITHUB_OUTPUT
```

| Property | Details                                                                    |
| -------- | -------------------------------------------------------------------------- |
| `id`       | Gives a name to the current step which can be referred to in future steps. |
| `run`      | Allows us to add secrets to the environment variable $GITHUB_OUTPUT. In this case we add the variable `dir`. |


#### 2. Caching Action

```yml
- name: Cache node_module dependencies.
  uses: actions/cache@v4
  id: yarn-cache
  with:
	path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
	key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
	restore-keys: |
		${{ runner.os }}-yarn-
```

| Property    | Details                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| path        | We access the yarn cache path obtained from the previous step, inside `dir`. |
| key         | A string that uniquely identifies a cache.                                   |
| restor-keys | Fallback prefixes identifying old caches that we use if the main key doesn't match any cache. |

**Why we hash `yarn.lock`**

We hash the `yarn.lock` file because if our dependencies would change, the `yarn.lock` contents would change, in turn the hash generated from it would be different. Hence, the key for this cache would change, signaling this step to generate a new cache (to yarn install again) with the updated node_modules.

**What happens to the old cache when the key changes?**

The old cache (with the old hash in its name) would still exist with the key it was defined with. The restore keys are prefixes that match any of the old caches if the primary key doesn't match.

*Example*

| Commit | yarn.lock hash | Cache key         | Outcome                                                                                                                    |
| ------ | -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1      | `abc123`         | `yarn-Linux-abc123` | Initial cache created and saved.                                                                                           |
| 2      | `def456`         | `yarn-Linux-def456` | `yarn.lock` updated its cache, so we create a new cache.                                                                     |
| 3      | `def456`         | `yarn-Linux-def456` | Cache key remains the same from the previous commit. So we don't have to reinstall/update the cache. Improving build time. |
|        |                |                   |                                                                                                                            |

The cache from A (`abc123`) is still available in GitHub’s cache storage.

If you include this restore key:

```yaml
restore-keys: yarn-Linux-
```

GitHub can fall back to the `abc123` cache if `def456` doesn’t exist yet.

**Why do we use `runner.os`**

We use runner.os since caches are OS-specific and the cache paths can differ between OS's.

> [!NOTE] What is **/yarn.lock syntax mean?
> A glob meaning we match all yarn.lock files in any subfolder in the entire project.

#### 3. Cache miss

```yml
- if: ${{ steps.yarn-cache.outputs.cache-hit != 'true' }}
  name: List the state of node modules.
  continue-on-error: true
  run: yarn list
```

If we didn't find a cache matching the `key` property for the `cache` step, it means that the dependencies have changed and thus we simply run `yarn list` to display the updated dependencies BEFORE we update the cache with `yarn install` in the next step.
