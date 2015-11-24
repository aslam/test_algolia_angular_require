class V3::Accounts::EventsController < ApplicationController

  before_filter :find_event
  layout "v3/accounts/event"

  def show
    puts "dsads"
  end

  private

  def find_event
    @event = Event.find(params.merge(request_headers).merge({
      :remove_auth_token => !current_user_event?, :is_owner => current_user_event?
    }))
  end

  def current_user_event?
    current_user.present? && (params[:account_id].to_i == current_user.id ||
        (params[:account_name].present? && params[:account_name].casecmp(current_user.short_name || "") == 0))
  end

end
