FROM python:3.14-slim

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Configure Poetry to not create a virtualenv
ENV POETRY_VIRTUALENVS_CREATE=false

# Copy all files first
COPY . .

# Install dependencies (including dev and the local package)
RUN poetry install --no-interaction --no-ansi && pip install -e .

# sort imports
RUN poetry run isort .

# Lint the code
RUN poetry run flake8 .

# Format the code
RUN poetry run black .

# Run tests
RUN poetry run pytest

# Expose the internal port for Nginx to reach
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "www:app"]
