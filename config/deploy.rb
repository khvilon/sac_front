# encoding: utf-8

default_run_options[:pty] = true
set :ssh_options, forward_agent: true

server '192.168.129.134', :web
set :user, 'scmz'
set :application, 'sac_static'

set :scm, 'git'
set :repository, 'git@github.com:bucketofkittens/sac_static.git'
set :branch, 'master'
set :deploy_via, :remote_cache

set :use_sudo, false
set :deploy_to, "/home/#{user}/#{application}"

set :keep_releases, 2
after 'deploy:restart', 'deploy:cleanup'

#namespace :deploy do
#  task :cope_with_git_repo_relocation do
#    run "if [ -d #{shared_path}/cached-copy ]; then cd #{shared_path}/cached-copy && git remote set-url origin #{repository}; else true; fi"
#  end
#end
#before "deploy:update_code", "deploy:cope_with_git_repo_relocation"
