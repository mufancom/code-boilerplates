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
`,
  );
};
export default composable;
