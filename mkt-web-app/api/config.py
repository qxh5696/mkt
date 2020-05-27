import os
basedir = os.path.abspath(os.path.dirname(__file__))

# Flask db init file location: /Users/qh/Documents/python_projects/ind-study/mkt/mkt-web-app/api/migrations/alembic.ini
# "Unable to open database file" error: https://github.com/miguelgrinberg/flasky/issues/334
class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + os.path.join(basedir, 'app.db')
