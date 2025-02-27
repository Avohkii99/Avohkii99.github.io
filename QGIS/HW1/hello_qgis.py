from PyQt5.QtWidgets import QMessageBox, QAction
from PyQt5.QtGui import QIcon
import os

class HelloQgis:
    def __init__(self, iface):
        self.iface = iface  # QGIS interface object
        self.action = None

    def initGui(self):
        """Get the path to the icon for the toolbar"""
        plugin_dir = os.path.dirname(os.path.realpath(__file__))
        icon_path = os.path.join(plugin_dir, "power.png")
        """Creates the toolbar button and connects it to the run method."""
        self.action = QAction(QIcon(icon_path), "Hello QGIS", self.iface.mainWindow())
        self.action.triggered.connect(self.run)
        self.iface.addToolBarIcon(self.action)  # Add to toolbar
        self.iface.addPluginToMenu("Hello QGIS Menu", self.action)  # Add to menu

    def unload(self):
        """Removes the toolbar button when the plugin is unloaded."""
        self.iface.removeToolBarIcon(self.action)
        # self.iface.removePluginMenu("Hello QGIS Menu", self.action)

    def run(self):
        """Displays the "Hello QGIS" message box."""
        QMessageBox.information(self.iface.mainWindow(), "Hello QGIS", "Hello QGIS!")