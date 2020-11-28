from todo_app import create_app
from config import ProductionConfig

application = create_app(ProductionConfig)

if __name__ == '__main__':
    application.run(host='0.0.0.0')
