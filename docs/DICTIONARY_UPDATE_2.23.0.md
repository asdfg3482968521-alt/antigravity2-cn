# Antigravity 2.0 v2.23.0 词典增补说明（2026-10-14）

## 对照范围

官方更新日志：https://antigravity.google/docs/changelog

从项目先前标记的 v2.14.0 对照到 v2.23.0，重点覆盖：

- v2.15–2.17：计划审核策略、WSL 设置、子智能体状态、系统文件管理器入口。
- v2.18–2.19：插件市场、归档筛选、Markdown 导出 PDF、仅撤销对话。
- v2.21.1：Scheduled Tasks 更名为 Automations，Run Now、Create with Prompt、高级对话搜索。
- v2.22.0：UI Extensions、显示选项、会话列表整理。
- v2.23.0：Use Global Settings、权限预设、全屏媒体、ZIP 与文件夹附件。

本次向简体 dicts/ 和繁体 dicts_tw/ 同步补充词条，并保留旧词条以兼容旧版。
不是所有英文候选文案都逐条经过 v2.23.0 安装包资源比对：发布日志中明确给出的术语可信度较高，
其余 UI 词条属于基于功能的候选翻译，实际大小写和措辞可能不同，应结合截图或原版资源继续核对。

## 术语与冲突注意

- Scheduled Tasks 是旧界面词条，保留；新版新增 Automations。不要将它们用于覆盖用户输入内容。
- page_settings.json 中原有 Preset = 主题预设，属于通用短词，不能直接重译为“权限预设”，
  否则会误伤主题设置；请使用 Permissions Preset、Permission Preset 等限定词。
- 汉化引擎归一化英文键后按文件加载顺序合并，历史词库中存在大小写、引号和省略号变体冲突；
  新增词条避免使用会触发冲突的键。
- 新词典更新不代表 v2.23.0 注入脚本已实测兼容，安装前请确认有备份和卸载路径。

## 校验

在仓库根目录运行：

```bash
node scripts/check_dicts.js
node --check localization_engine.js
```

校验内容包括简繁 JSON 合法性、键集合一致性及重要新版词条覆盖。规范化冲突只做提示，
以免因原有历史词条阻塞本次维护。