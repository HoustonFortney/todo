#!/bin/bash

# Start gunicorn service
sudo systemctl restart app

# Restart nginx
sudo systemctl restart nginx
