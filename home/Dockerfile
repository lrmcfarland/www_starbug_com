FROM python:3.9-slim
WORKDIR /home
COPY . /home
RUN pip install flask gunicorn
# Expose the internal port for Nginx to reach
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "home:home"]
