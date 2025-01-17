import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import {IFCWALL,
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
    IFCDOOR} from 'web-ifc';
const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.IFC.setWasmPath("../../../");
const input = document.getElementById('file-input');
input.onchange = loadIfc;
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
            curtainwalls: [IFCBEAM, IFCMEMBER, IFCCOLUMN, IFCMECHANICALFASTENER, IFCMEMBERTYPE, IFCCOLUMNTYPE, IFCCOLUMNSTANDARDCASE, IFCPLATE, IFCCURTAINWALL, IFCMATERIAL],
            doors: [IFCDOOR]
        },
        getProperties: false
    });
    // Download result
    const link = document.createElement('a');
    document.body.appendChild(link);
    for(const categoryName in result.gltf) {
        const category = result.gltf[categoryName];
        for(const levelName in category) {
            const file = category[levelName].file;
            if(file) {
                link.download = `${file.name}_${categoryName}_${levelName}.gltf`;
                link.href = URL.createObjectURL(file);
                link.click();
            }
        }
    }
    for(let jsonFile of result.json) {
        link.download = `${jsonFile.name}.json`;
        link.href = URL.createObjectURL(jsonFile);
        link.click();
    }
    link.remove();
}
window.ondblclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
