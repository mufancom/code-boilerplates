import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({
  name,
  packages,
  digshareScript,
}) => {
  return text(
    'README.md',
    () => `# ${name}

### 频道列表
${packages?.map(
  packageOptions =>
    `- [ ] ${packageOptions.name} (${packageOptions.displayName}) \`${
      packageOptions.runtime ?? digshareScript.runtime
    }\``,
).join(`
`)}

### API 信息
- Host \`${digshareScript.openAPI.host}\`
- Version \`${digshareScript.openAPI.version}\`
`,
  );
};
export default composable;
