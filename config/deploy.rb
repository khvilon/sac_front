# encoding: utf-8

default_run_options[:pty] = true
set :ssh_options, forward_agent: true

server '192.168.129.134', :web
set :user, 'scmz'
set :application, 'sac_static'

set :scm, 'git'
set :repository, 'git@github.com:bucketofkittens/sac_static.git'
set :branch, 'master'
set :deploy_via, :copy

set :use_sudo, false
set :deploy_to, "/home/#{user}/#{application}"

set :keep_releases, 2
after 'deploy:restart', 'deploy:cleanup'
