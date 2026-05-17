from flask import Flask

def create_app(config_class=None):
    # Create the Flask instance
    app = Flask(__name__)

    # Apply configuration (e.g., from an object or file)
    if config_class:
        app.config.from_object(config_class)

    @app.route("/")
    def hello():
        return "Hello, World with tests!"

    return app
