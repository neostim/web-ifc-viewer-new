import { Color, MeshLambertMaterial } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import {
    IFCWALL,
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCWINDOW,
    IFCMEMBER,
    IFCMEMBERTYPE,
    IFCMECHANICALFASTENER,
    IFCPLATE,
    IFCMATERIAL,
    IFCELEMENTASSEMBLY,
    IFCBEAM,
    IFCCOLUMN,
    IFCCOLUMNTYPE,
    IFCCOLUMNSTANDARDCASE,    
    IFCCURTAINWALL,
    IFCDOOR
} from 'web-ifc';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.IFC.setWasmPath("../../../");

const input = document.getElementById('file-input');
input.onchange = loadIfc;

// 🎨 Function to colorize elements
async function applyColorToIFCElements(modelID, type, color) {
    const elements = await viewer.IFC.getAllItemsOfType(modelID, type, false);
    const material = new MeshLambertMaterial({ color });

    elements.forEach(id => {
        const mesh = viewer.IFC.loader.ifcManager.getMesh(modelID, id);
        if (mesh) mesh.material = material;
    });

    console.log(`Applied color to ${type}:`, elements.length, "elements");
}

async function loadIfc(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    // Export to glTF and JSON
    const result = await viewer.GLTF.exportIfcFileAsGltf({
        ifcFileUrl: url,
        splitByFloors: false,
        categories: {
            walls: [IFCWALL, IFCWALLSTANDARDCASE],
            slabs: [IFCSLAB],
            windows: [IFCWINDOW],
            curtainwalls: [IFCBEAM, IFCMEMBER, IFCCOLUMN, IFCMECHANICALFASTENER, IFCMEMBERTYPE, IFCCOLUMNTYPE, IFCPLATE, IFCCURTAINWALL, IFCMATERIAL],
            doors: [IFCDOOR]
        },
        getProperties: false
    });

    // ✅ Apply colors after the IFC model loads
    const modelID = viewer.IFC.loader.ifcManager.state.models[0].modelID;

    await applyColorToIFCElements(modelID, IFCBEAM, 0xff69b4); // Pink for Beams
    await applyColorToIFCElements(modelID, IFCCOLUMN, 0xff69b4); // Pink for Columns

    console.log("Applied pink color to IFCBEAM & IFCCOLUMN");

    // ✅ Download result
    const link = document.createElement('a');
    document.body.appendChild(link);
    for (const categoryName in result.gltf) {
        const category = result.gltf[categoryName];
        for (const levelName in category) {
            const file = category[levelName].file;
            if (file) {
                link.download = `${file.name}_${categoryName}_${levelName}.gltf`;
                link.href = URL.createObjectURL(file);
                link.click();
            }
        }
    }

    for (let jsonFile of result.json) {
        link.download = `${jsonFile.name}.json`;
        link.href = URL.createObjectURL(jsonFile);
        link.click();
    }

    link.remove();
}

// ✅ Add interaction
window.ondblclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
