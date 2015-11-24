source 'http://rubygems.org'

gem 'rails', '3.2.18'
gem 'typhoeus'
gem 'json'
gem 'rake'
gem "redis"
gem 'redis-rails', '~> 3.2.3'
gem 'rails_autolink'
gem 'high_voltage', '1.2.0'
gem 'useragent'
gem 'airbrake'
gem 'newrelic_rpm', '>= 3.9.0.229', :require => false
gem 'rpm_contrib'
gem 'draper', '0.14.0'
gem 'recaptcha', :require => 'recaptcha/rails'
gem 'ri_cal'
# latest version adds RequireJS 2.1.2 (which fixes the jQuery issue with 'add')
# the ref fixes this issue: https://github.com/jwhitley/requirejs-rails/issues/95
gem 'requirejs-rails', :git => 'git@github.com:sanath/requirejs-rails'
gem 'recurly', '~> 2.4.5'
gem 'rack', '1.4.5' # CVE-2013-0262, CVE-2013-0263
gem 'statsd-instrument'
gem 'girl_friday'
gem 'indefinite_article'
gem 'rqrcode'
gem 'google-api-client'
gem 'databasedotcom', '1.3.2'
gem 'net-sftp', '~> 2.1.2'
gem 'handle_invalid_percent_encoding_requests'
gem 'algoliasearch'

group :test, :development do
  gem 'awesome_print'
  gem 'rspec-rails'
  gem 'jasmine-rails'
end

group :test do
  gem 'launchy'
  gem "pickle", "~> 0.4.7"
  gem 'bourne'
  gem "cucumber-rails", :require => false
end

group :development do
  gem 'ruby-prof'
  gem 'thin'
  gem 'sass', '~> 3.2.3'
  gem 'debugger'
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-spork'
  gem 'rails-dev-tweaks', '~> 0.6.1' # avoids loading ruby classes for an asset request in development
end

group :staging, :production, :"development-blr", :"development-nyc", :"pre-production"  do
  gem 'unicorn'
  gem 'syslogger'
end

group :assets do
  gem 'sass-rails', '~> 3.2.3'
  gem 'compass-rails'
  gem 'uglifier'
  gem 'therubyracer'
  gem "closure-compiler", "~> 1.1.10"
end
