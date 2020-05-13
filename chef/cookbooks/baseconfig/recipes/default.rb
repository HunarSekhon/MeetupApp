# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
package "sudo"
package "npm"
package 'nginx' do
  action :install
end
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
cookbook_file "nginx-default" do
  path "/etc/nginx/sites-available/default"
end
cookbook_file "nginx-default" do
  path "/etc/nginx/sites-available/app"
end
cookbook_file "nginx-default" do
  path "/etc/nginx/sites-available/enabled"
end
execute 'meteor' do
  command 'curl https://install.meteor.com/ | sh'
end

execute 'make-newDir' do
  command 'mkdir astro'
end

execute 'copy-files' do
  command 'cp -a /home/ubuntu/project/astro/ /home/ubuntu/astro/'
end

execute 'make meteor local folder' do
  command 'mkdir /home/ubuntu/astro/.meteor/local'
end

execute 'get meteor local permission' do
  command 'sudo chown -Rh ubuntu .meteor/local'
  cwd '/home/ubuntu/astro'
end

execute 'meteor babel install' do
  command 'meteor npm install --save babel-runtime'
  cwd '/home/ubuntu/astro/'
end

service 'nginx' do
  action :restart
end

execute 'ntp_restart' do
  command 'service ntp restart'
end

# 1. cd astro
# 2. Have to run this command twice: sudo meteor --allow-superuser
# 3. Go to http://localhost:8080
# Fails the first time, but works the second time
# 

# command 'exit-root-user' do
#   command 'exit'
# end

# execute 'run-meteor' do
#   command 'cd /home/ubuntu/test/ && touch workpls.txt && meteor run --port 3000;'
# end
