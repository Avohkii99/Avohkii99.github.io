from qgis.core import QgsProject, QgsVectorLayer
from qgis.gui import QgsMapLayerComboBox
from qgis.gui import QgsMapLayer
from PyQt5.QtWidgets import QAction, QDialog
from PyQt5.QtGui import QIcon, QColor
import random

# Load the UI file
from .random_color_layer_dialog import RandomColorLayerDialog

class RandomColorLayer:
    def __init__(self, iface):
        self.iface = iface
        self.dlg = RandomColorLayerDialog()

    def initGui(self):
        """Create the toolbar button."""
        self.action = QAction(QIcon(), "Random Color Layer", self.iface.mainWindow())
        self.action.triggered.connect(self.run)
        self.iface.addToolBarIcon(self.action)

    def unload(self):
        """Remove the toolbar button."""
        self.iface.removeToolBarIcon(self.action)

    def change_color(self):
        """Change the selected layer's color to a random RGB value."""
        layer = self.dlg.layerCombo.currentLayer()
        if isinstance(layer, QgsVectorLayer):
            # Generate random RGB values
            r = random.randint(0, 255)
            g = random.randint(0, 255)
            b = random.randint(0, 255)
            color = QColor(r, g, b)
            # Apply color to layer symbology
            renderer = layer.renderer()
            symbol = renderer.symbol()
            symbol.setColor(color)
            layer.triggerRepaint()
            self.iface.layerTreeView().refreshLayerSymbology(layer.id())

    def run(self):
        """Show the dialog and connect the button."""
        # Populate the combo box with vector layers
        self.dlg.layerCombo.setLayer(None)  # Clear current selection
        self.dlg.layerCombo.setFilters(QgsMapLayer.VectorLayer)
        # Connect the button to the color change function
        self.dlg.colorButton.clicked.connect(self.change_color)
        # Show the dialog
        self.dlg.show()

def classFactory(iface):
    return RandomColorLayer(iface)