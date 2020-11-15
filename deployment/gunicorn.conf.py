import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = 'unix:app.sock'
umask = 7
loglevel = 'warning'
