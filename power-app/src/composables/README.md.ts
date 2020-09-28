import {ComposableModuleFunction, text} from '@magicspace/core';

const composable: ComposableModuleFunction = ({name, powerApp: {port}}) => {
  return text(
    'README.md',
    () => `# ${name}

### 项目结构
    
\`\`\`
  ├── README.md                   // 说明
  ├── .env.*                      // 配置文件
  ├── power-app.*.json            // 应用定义
  ├── src
  │   ├── client                  // 应用页面（page）
  │   │   |── pages               //
  |   |   |  |── @xxx             // 单个 page 的代码
  |   |   |  └── index.ts         // 将 page 汇总的文件
  │   │   └── app.tsx             // page 注册 route 处
  |   |
  │   ├── server
  |   |   |—— helper              // 工具函数
  │   │   |── version             // 应用版本文件夹
  |   |   |  |── 0.1.0.ts         // 单个 version 的代码
  |   |   |  └── index.ts         // 将 version 汇总的文件
  │   │   └── config.ts           // 配置文件
  │   │   └── main.tsx            // 主入口
  └─
\`\`\`

### 开发
    
\`\`\`bash
# server
yarn serve
    
# client
yarn start
    
# http://localhost:${port}
\`\`\`
    
### 部署
    
1. 首次部署
    - 增加数据卷
    \`\`\`bash
    docker volume create --name=makeflow-${name}_mongo_data
    \`\`\`
    - 配置 nginx 映射
    
2. 执行命令
    
\`\`\`bash
docker-compose up -d --build
\`\`\`

`,
  );
};
export default composable;
