import datetime

from flask import Flask, request, jsonify

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

    @app.route("/api/julian_date", methods=["POST"])
    def api_julian_date():
        """Convert a Julian day to a datetime in ISO 8601 format.
        Expects a JSON payload with a 'julian_day' key.
        Returns a JSON response with the converted datetime or an error message.
        """
        data = request.get_json()

        if not data or "julian_day" not in data:
            return jsonify({"error": "Missing 'julian_day' in request body"}), 400

        julian_day = data["julian_day"]
        try:
            julian_date = time.AstronomicalAlgorithms.Julian_date(julian_day)
            return jsonify({"julian_date": julian_date.isoformat()})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/julian_day", methods=["POST"])
    def api_julian_day():
        """Convert a datetime to a Julian day.
        Expects a JSON payload with a 'datetime' key.
        Returns a JSON response with the converted Julian day or an error message.
        """
        data = request.get_json()

        if not data or "datetime" not in data:
            return jsonify({"error": "Missing 'datetime' in request body"}), 400

        datetime_str = data["datetime"]
        try:
            api_julian_date = datetime.datetime.fromisoformat(datetime_str)
            julian_day = time.AstronomicalAlgorithms.Julian_day(api_julian_date)
            return jsonify({"julian_day": julian_day})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app


# Export for WSGI servers
app = create_app()
