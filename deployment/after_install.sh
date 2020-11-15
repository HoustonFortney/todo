#!/bin/bash

cd /var/www/app
sudo chmod 744 .

# Enable gunicorn service
sudo systemctl enable app

# Setup virtual environment
python3 -m virtualenv app_venv
source ./app_venv/bin/activate
pip install -r ../requirements.txt
deactivate

# Get secrets from S3
sudo aws s3 cp s3://todoapp-secrets/secrets.py . --region=us-east-2

# Disable the default site
sudo rm /etc/nginx/sites-enabled/default

# Enable this site
sudo ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled
