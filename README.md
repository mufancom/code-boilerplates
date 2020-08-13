# Mufan Code Templates

## Usage

```bash
npm install --global magicspace makeflow/mufan-code-templates
```

After making the initial commit, create magicspace template config `.magicspace/template.json`:

```json
{
  "extends": ["@mufan/code-templates/general"],
  "options": {
    "project": {
      "name": "awesome-project"
    }
  }
}
```

```bash
magicspace init --force # force to skip clean working directory assertion
```

Review changes and commit the merge.
