from flask import Flask


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
    def hello_api():
        return "Hello, starbug API!"

    return app


# Export for WSGI servers
app = create_app()
