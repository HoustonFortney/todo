from todo_app import create_app
from config import ProductionConfig
import boto3

# Get secret config from s3 bucket
s3 = boto3.client('s3')
s3.download_file(ProductionConfig.SECRETS_BUCKET_NAME, 'secrets.py', 'secrets.py')
from secrets import SecretConfig


class ProductionConfigWithSecrets(SecretConfig, ProductionConfig):
    pass


application = create_app(ProductionConfigWithSecrets)

if __name__ == '__main__':
    application.run(host='0.0.0.0')
