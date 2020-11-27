from secrets import SecretConfig


class BaseConfig:
    APP_NAME = 'TODO App'
    VERSION_STRING = '1.0.0'

    RESTX_MASK_SWAGGER = False

    CONTACT_EMAIL = 'contact@houstonfortney.com'


class DebugConfig(BaseConfig):
    DEBUG = True
    SECRET_KEY = 'dev_key_not_the_real_key'

    SERVER_NAME = 'todoapp.local:5000'
    STATIC_PATH = '//static.' + SERVER_NAME

    MONGODB_SETTINGS = {
        'host': 'mongodb://localhost:27017/todoapp?ssl=false'
    }

    DEBUG_TB_PROFILER_ENABLED = True
    DEBUG_TB_PANELS = [
        'flask_debugtoolbar.panels.versions.VersionDebugPanel',
        'flask_debugtoolbar.panels.headers.HeaderDebugPanel',
        'flask_debugtoolbar.panels.request_vars.RequestVarsDebugPanel',
        'flask_debugtoolbar.panels.config_vars.ConfigVarsDebugPanel',
        'flask_debugtoolbar.panels.template.TemplateDebugPanel',
        'flask_debugtoolbar.panels.route_list.RouteListDebugPanel',
        'flask_debugtoolbar.panels.profiler.ProfilerDebugPanel',
        'flask_debugtoolbar.panels.logger.LoggingPanel',
    ]


class TestConfig(BaseConfig):
    TESTING = True

    STATIC_PATH = '/static'

    SECRET_KEY = 'test_key_not_the_real_key'

    MONGODB_SETTINGS = {
        'host': 'mongomock://localhost'
    }

    TEST_SERVER_PORT = 8943


class ProductionConfig(SecretConfig, BaseConfig):
    SERVER_NAME = 'tododemo.houstonfortney.com'
    STATIC_PATH = '//static.' + SERVER_NAME + '/' + BaseConfig.VERSION_STRING
