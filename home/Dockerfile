FROM python:3.11-slim

WORKDIR /www_starbug_com

# Upgrade pip and install build dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools

# Copy configuration first to leverage Docker cache
COPY pyproject.toml .
# Create a dummy README to prevent installation errors if referenced in toml
RUN touch README.md

# Install production and development dependencies
RUN pip install --no-cache-dir ".[dev]"

# copy the rest of the application code
COPY . .

RUN PYTHONPATH=/www_starbug_com/src pytest

# TODO: Consider separating test dependencies and running tests in a separate stage or command to avoid bloating the final image with test-related packages.
# Run tests, then start the application
# CMD ["sh", "-c", "pytest && flask --app app run --host=0.0.0.0"]

# Expose the internal port for Nginx to reach
WORKDIR /www_starbug_com/src
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "www_starbug_com.main:app"]
