load 'deploy'
load 'deploy/assets'
load 'config/deploy' # remove this line to skip loading any of the default tasks

Dir['vendor/gems/*/recipes/*.rb', 'vendor/plugins/*/recipes/*.rb'].each do |plugin|
  load(plugin)
end
