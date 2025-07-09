import {app} from '../../scripts/app.js'

console.log("🧪 ComfyUI Extension Test: JavaScript loading is working!");

app.registerExtension({
    name: "Comfy.TestExtension",
    
    async beforeRegisterNodeDef(nodeType, nodeDef, app) {
        console.log("🔍 Extension Test: Node detected -", nodeDef.name);
        
        if (nodeDef.name === "CR Text Replace") {
            console.log("✅ Found CR Text Replace node! Compatibility extension should work.");
        }
    }
}); 