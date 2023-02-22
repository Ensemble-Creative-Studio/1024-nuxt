import CONSTANTS from '../config/constants'

export let GUI = {}

if (typeof window !== 'undefined' && CONSTANTS.DEBUG) {
    const dat = require('dat.gui')

    GUI = new dat.GUI({
        autoPlace: false,
        scrollable: true,
        width: 400
    })

    document.body.appendChild(GUI.domElement)
}

export class Folder {
    constructor ({ name = '', parentFolder = GUI }) {
        this.name = name
        this.parentFolder = parentFolder

        if (GUI.__folders[this.name]) {
            this.remove(GUI.__folders[this.name])
        }

        this.folder = this.parentFolder.addFolder(this.name)
    }

    remove (folder = this.folder) {
        this.parentFolder.removeFolder(folder)
    }

    removeController (controller) {
        this.folder.remove(controller)
    }
}

export default GUI
