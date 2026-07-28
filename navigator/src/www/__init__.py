from flask import Flask

from navicomp import time


def create_app(config_class=None):
    # Create the Flask instance
    app = Flask(__name__)

    # Apply configuration (e.g., from an object or file)
    if config_class:
        app.config.from_object(config_class)

    @app.route("/")
    def hello():
        return "Hello, starbug navigator!"

    @app.route("/api/")
    def api_hello():
        return "Hello, starbug API!"

    @app.route("/api/timezones")
    def api_timezones():
        return time.timezones()

    return app


# Export for WSGI servers
app = create_app()
