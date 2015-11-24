# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Firestorm::Application.initialize!

ActionView::Base.field_error_proc = proc { |input, instance| input }

# This would enable us to call a url helper from a decorator/lib
# Otherwise, it would cry saying 'Missing host to link to! Please provide :host parameter or set default_url_options[:host]'
# http://stackoverflow.com/questions/9297446/how-to-use-a-route-helper-method-from-a-file-in-the-lib-directory
Rails.application.routes.default_url_options[:host] = WEB_HOST
