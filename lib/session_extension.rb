class SessionExtension
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['rack.session'].has_key?('auth_token')
      env['rack.session.options'][:expire_after] = 3.weeks
    end
    @app.call(env)
  end
end

