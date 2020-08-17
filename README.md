# Mufan Code Templates

Code templates for our projects, powered by [Magicspace](https://github.com/makeflow/magicspace).

## Usage

```bash
npm install --global magicspace makeflow/mufan-code-templates
```

> As this repository is updated on a daily basis, the package `@mufan/code-templates` is not published to NPM registry. Instead we are installing from github `makeflow/mufan-code-templates`.

### Create magicspace configuration

After making the initial commit:

```bash
magicspace create @mufan/code-templates-general
```

Select an example and review/edit the configuration options.

> Options are defined by templates.

### Initialize magicspace

```bash
magicspace init
```

Review changes, resolve conflicts (if any) and commit the merge.

### Update magicspace

Update installed templates:

```bash
npm install --global makeflow/mufan-code-templates
```

Update magicspace:

```bash
magicspace update
```

Review changes, resolve conflicts (if any) and commit the merge.

## License

MIT License.
