
import { IfcViewerAPI } from "https://cdn.jsdelivr.net/npm/web-ifc-viewer@latest";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js";
import { GLTFExporter } from "https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/exporters/GLTFExporter.js";

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({ container });

// ✅ Load an externally hosted IFC file
viewer.IFC.loadIfcUrl("https://03587f8.netsolhost.com/B201.ifc");

// 🎨 Define colors for different types
const colors = {
    "IFCBEAM": 0xff0000,   // Red
    "IFCPLATE": 0x00ff00,  // Green
    "IFCBOLT": 0x0000ff    // Blue
};

// Function to colorize IFC elements
async function colorizeIfcElements(type, color) {
    const modelID = viewer.IFC.loader.ifcManager.state.models[0].modelID;
    const elements = await viewer.IFC.getAllItemsOfType(modelID, viewer.IFC.types[type], false);

    const material = new THREE.MeshLambertMaterial({ color });

    elements.forEach(id => {
        const mesh = viewer.IFC.loader.ifcManager.getMesh(modelID, id);
        if (mesh) mesh.material = material;
    });
}

// 🎨 Apply colors
await colorizeIfcElements("IFCBEAM", colors["IFCBEAM"]);
await colorizeIfcElements("IFCPLATE", colors["IFCPLATE"]);
await colorizeIfcElements("IFCBOLT", colors["IFCBOLT"]);

// ✅ Export to GLTF
const exporter = new GLTFExporter();
exporter.parse(viewer.scene, function (gltf) {
    const blob = new Blob([JSON.stringify(gltf)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_model.gltf";
    link.click();
});
