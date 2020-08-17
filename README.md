# Mufan Code Boilerplates

Code boilerplates for our projects, powered by [Magicspace](https://github.com/makeflow/magicspace).

## Usage

```bash
npm install --global magicspace makeflow/mufan-code-boilerplates
```

> As this repository is updated on a daily basis, the package `@mufan/code-boilerplates` is not published to NPM registry. Instead we are installing from github `makeflow/mufan-code-boilerplates`.

### Create magicspace configuration

Create magicspace configuration file with `magicspace create` command.

```bash
magicspace create @mufan/code-boilerplates/general
```

Select an example and review/edit the configuration options.

> Options are defined by boilerplates.

### Initialize magicspace

Initialize the repository and **make initial commit** if you have not:

```bash
git init

touch README.md
git add README.md

git commit --message "Initial commit"
```

```bash
magicspace init
```

> You can use magicspace to initialize an existing project, just expect more conflicts to resolve.

Review changes, resolve conflicts (if any) and commit the merge.

### Update magicspace

Update installed boilerplates:

```bash
npm install --global makeflow/mufan-code-boilerplates
```

Update magicspace:

```bash
magicspace update
```

Review changes, resolve conflicts (if any) and commit the merge.

## License

MIT License.
