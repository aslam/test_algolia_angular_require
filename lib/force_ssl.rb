class ForceSSL
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['HTTPS'] == 'on' || env['HTTP_X_FORWARDED_PROTO'] == 'https'
      puts "I am enforcing HTTPS since the equest is HTTPS*********"
      @app.call(env)
    else
      if env['rack.session'].has_key?('auth_token')
        puts "I am enforcing HTTPS since there is a logged in user**********"
        req = Rack::Request.new(env)
        [301, { "Location" => req.url.gsub(/^http:/, "https:"), "Content-Type" => "text/html" }, []]
      else
        puts "I won't enforce HTTPS"
        @app.call(env)
      end
    end
  end
end