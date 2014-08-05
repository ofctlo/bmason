require 'bundler/capistrano'

# config valid only for Capistrano 3.1
lock '3.2.1'

server '107.170.228.150', :web, :app, :db, primary: true

set :user, 'deployer'
set :application, 'bmason'
set :deploy_to, "home/#{user}/apps/#{application}"
set :deploy_via, :remote_cache

set :scm, 'git'
set :repo_url, "git@github.com:ofctlo/#{application}.git"
set :branch, 'master'

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end
end
