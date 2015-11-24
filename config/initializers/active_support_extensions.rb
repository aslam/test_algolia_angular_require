module ActiveSupport
  class TimeWithZone
    def zone=(new_zone = ::Time.zone)
      initialize(nil, ::Time.__send__(:get_zone, new_zone), time)
    end
  end
end