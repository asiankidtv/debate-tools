FROM python:3.13-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE = 1
ENV PYTHONUNBUFFERED = 1

WORKDIR /app

# Installing any Debian Dependencies
RUN apt-get update && apt-get install -y curl
RUN apt-get install -y build-essential 
RUN apt-get install -y libpq-dev python3-dev

# Better version of pip
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Installing Dependencies
COPY debate-tools/requirements.txt .
RUN uv pip install -r requirements.txt --system

# Copying Source Code
COPY debate-tools/ .

EXPOSE 8000

# Starts Server - CHANGE FOR PRODUCTION PLS PLS DONT FORGET OR YOULL LOOK STUPID :<
CMD ["./entrypoint.sh"]