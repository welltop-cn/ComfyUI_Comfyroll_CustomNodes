import { app } from "../scripts/app.js";

/**
 * CR Text Replace 兼容性扩展
 * 智能处理新旧两种 widget_values 格式：
 * - 旧格式(8个值): ["", "[BACKGROUND]", "", "[ROLE]", "", "[ACTIONS]", "", true]
 * - 新格式(6个值): ["[BACKGROUND]", "", "[ROLE]", "", "[ACTIONS]", ""]
 */
app.registerExtension({
    name: "Comfy.CRTextReplaceCompat",
    
    async beforeRegisterNodeDef(nodeType, nodeDef, app) {
        if (nodeDef.name === "CR Text Replace") {
            const origPrototype = nodeType.prototype;
            const origConfigure = origPrototype.configure;
            
            origPrototype.configure = function(data) {
                if (data.widgets_values && Array.isArray(data.widgets_values)) {
                    const valuesLength = data.widgets_values.length;
                    
                    // 检测旧格式：8个值
                    if (valuesLength === 8) {
                        console.log("[CR Text Replace] 检测到旧版本格式 (8个值)，正在转换...");
                        console.log("[CR Text Replace] 原始值:", JSON.stringify(data.widgets_values));
                        
                        // 验证旧格式的特征：最后一个值通常是布尔值
                        const lastValue = data.widgets_values[7];
                        const isLegacyFormat = typeof lastValue === 'boolean' || lastValue === 'true' || lastValue === 'false';
                        
                        if (isLegacyFormat) {
                            // 旧格式映射：
                            // [0] text (在新版本中有 forceInput，不需要 widget)
                            // [1] find1 -> 新格式[0]
                            // [2] replace1 -> 新格式[1]
                            // [3] find2 -> 新格式[2]
                            // [4] replace2 -> 新格式[3]
                            // [5] find3 -> 新格式[4]
                            // [6] replace3 -> 新格式[5]
                            // [7] control_after_generate (布尔值，新版本不需要)
                            
                            const newValues = [
                                data.widgets_values[1] || "", // find1
                                data.widgets_values[2] || "", // replace1
                                data.widgets_values[3] || "", // find2
                                data.widgets_values[4] || "", // replace2
                                data.widgets_values[5] || "", // find3
                                data.widgets_values[6] || ""  // replace3
                            ];
                            
                            data.widgets_values = newValues;
                            console.log("[CR Text Replace] 成功转换为新格式:", JSON.stringify(newValues));
                        } else {
                            console.warn("[CR Text Replace] 8个值但不符合旧格式特征，可能是其他变体，保持原样");
                        }
                    }
                    // 新格式：6个值，保持不变
                    else if (valuesLength === 6) {
                        console.log("[CR Text Replace] 检测到新版本格式 (6个值)，无需转换");
                    }
                    // 空值或更少的值，可能是新创建的节点
                    else if (valuesLength === 0 || valuesLength < 6) {
                        console.log(`[CR Text Replace] 检测到值数量较少 (${valuesLength}个)，可能是新创建的节点`);
                    }
                    // 其他长度，记录但不处理
                    else {
                        console.warn(`[CR Text Replace] 未知的 widget_values 长度: ${valuesLength}，保持原样`);
                        console.warn(`[CR Text Replace] 值内容:`, JSON.stringify(data.widgets_values));
                    }
                }
                
                // 调用原始的 configure 方法
                return origConfigure?.call(this, data);
            };
            
            // 可选：也可以在节点创建后进行处理
            const origOnNodeCreated = origPrototype.onNodeCreated;
            origPrototype.onNodeCreated = function() {
                if (origOnNodeCreated) {
                    origOnNodeCreated.call(this);
                }
                
                // 为新创建的节点设置默认值
                if (!this.widgets_values || this.widgets_values.length === 0) {
                    console.log("[CR Text Replace] 为新节点设置默认 widget 值");
                }
            };
            
            console.log("[CR Text Replace] 兼容性扩展已成功加载");
        }
    }
}); 