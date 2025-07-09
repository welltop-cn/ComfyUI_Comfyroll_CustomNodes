# CR Text Replace 兼容性扩展

这个扩展解决了 ComfyUI 前端版本 1.16+ 中 `CR Text Replace` 节点的向后兼容性问题。

## 问题背景

在 ComfyUI 前端版本 1.16 之前，`forceInput` 输入仍会创建 widget，导致旧版本的工作流包含更多的 `widget_values`。
版本 1.16+ 中，`forceInput` 输入不再创建 widget，导致 widget 数量减少，造成旧工作流加载时出现值错位。

## 支持的格式

### 旧格式 (8个值)
```json
"widgets_values": ["", "[BACKGROUND]", "", "[ROLE]", "", "[ACTIONS]", "", true]
```
映射关系：
- `[0]` text (旧版本的 widget，新版本自动忽略)
- `[1]` find1 → 新格式 `[0]`
- `[2]` replace1 → 新格式 `[1]`
- `[3]` find2 → 新格式 `[2]`
- `[4]` replace2 → 新格式 `[3]`
- `[5]` find3 → 新格式 `[4]`
- `[6]` replace3 → 新格式 `[5]`
- `[7]` control_after_generate (布尔值，新版本自动忽略)

### 新格式 (6个值)
```json
"widgets_values": ["[BACKGROUND]", "", "[ROLE]", "", "[ACTIONS]", ""]
```
映射关系：
- `[0]` find1
- `[1]` replace1
- `[2]` find2
- `[3]` replace2
- `[4]` find3
- `[5]` replace3

## 安装方法

1. 将 `cr-text-replace-compat.js` 文件放置到 `ComfyUI/web/extensions/` 目录下
2. 重启 ComfyUI
3. 扩展将自动加载并在控制台显示加载确认信息

## 工作原理

扩展会在节点配置时智能检测 `widget_values` 的格式：

1. **8个值且最后一个是布尔值** → 识别为旧格式，自动转换为新格式
2. **6个值** → 识别为新格式，保持不变
3. **其他情况** → 记录警告但保持原样

## 控制台输出示例

### 加载旧格式工作流
```
[CR Text Replace] 兼容性扩展已成功加载
[CR Text Replace] 检测到旧版本格式 (8个值)，正在转换...
[CR Text Replace] 原始值: ["","[BACKGROUND]","","[ROLE]","","[ACTIONS]","",true]
[CR Text Replace] 成功转换为新格式: ["[BACKGROUND]","","[ROLE]","","[ACTIONS]",""]
```

### 加载新格式工作流
```
[CR Text Replace] 检测到新版本格式 (6个值)，无需转换
```

## 兼容性

- ✅ 支持旧版本工作流 (widget_values 长度为 8)
- ✅ 支持新版本工作流 (widget_values 长度为 6)
- ✅ 支持新创建的节点
- ✅ 不影响其他节点的正常工作

## 故障排除

如果遇到问题，请检查浏览器控制台的日志信息：

1. **扩展未加载**：确认文件路径正确，重启 ComfyUI
2. **转换失败**：检查控制台警告信息，可能是特殊的 widget_values 格式
3. **值仍然错位**：可能需要调整映射关系，请提供具体的 widget_values 内容

## 注意事项

- 此扩展仅影响 `CR Text Replace` 节点
- 扩展在节点加载时进行转换，不会修改原始工作流文件
- 转换过程是安全的，不会影响工作流的功能 