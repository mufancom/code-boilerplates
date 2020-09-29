# Power App TypeScript Project Boilerplate

> 使用步骤（仅供参考）

0. `npm install --global magicspace makeflow/mufan-code-boilerplates`
1. `mkdir awesome-power-app`
2. `cd awesome-power-app`
3. `magicspace create @mufan/code-boilerplates/power-app`
4. 编辑 `awesome-power-app/.magicspace/boilerplate.json`

```json
{
  "extends": "@mufan/code-boilerplates/power-app",
  "options": {
    "name": "awesome-power-app",
    "powerApp": {
      "port": 9966, // 设置一个你喜欢的端口号
      "images": [] // 可选, 如: ["redis"]
    }
  }
}
```

5. `git init`
6. `git add .`
7. `git commit -m "init"`
8. `magicspace init`
9. 开发和部署请查看 `awesome-power-app/README.md`

**相关链接**

- https://makeflow.github.io/app-builder —— PowerApp 定义编辑器
