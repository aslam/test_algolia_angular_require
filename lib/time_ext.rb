class Time
	def difference
		return (self - Time.now).to_i
	end

	def long_date
		return self.strftime("%A %B #{self.day.ordinalize} - %l:%M%p #{self.zone}") #=> "Thursday February 3rd -  6PM IST"
	end

	def past_duration
		currentTime = Time.now.utc
		timeDiff = (currentTime - self)
		if timeDiff.to_i < 3600
			duration = (timeDiff.to_i/60)
			status = (duration.to_s + (duration == 1 ? " min ago" : " mins ago"))
		elsif timeDiff.to_i < (24 * 3600)
			duration = (timeDiff.to_i/3600)
			status = (duration.to_s + (duration == 1 ? " hour ago" : " hours ago"))
		else
			duration = timeDiff.to_i/(3600 * 24)
			status = (duration.to_s + (duration == 1 ? "day ago" : " days ago"))
		end
		return status
	end
end
