root = 'home/bmason/apps/bmason/current'
working_directory root
pid "#{root}/tmp/pids/unicorn.pid"
stderr_path "#{root}/log/unicorn.error"
stdout_path "#{root}/log/unicorn.log"

listen 'tmp/unicorn.bmason.sock'
worker_processes 2
timeout 30
