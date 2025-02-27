def classFactory(iface):
    """Load hello_qgis class from file hello_qgis.py"""
    from .hello_qgis import HelloQgis
    return HelloQgis(iface)