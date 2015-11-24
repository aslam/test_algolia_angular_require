module Javascript
  class Railtie < Rails::Railtie
  
	  initializer "my_railtie.configure_rails_initialization" do
	  
	    Rails.configuration.javascript = {
	    	"mixpanelToken" => MIXPANEL_TOKEN,
	    	"searchOptions" => SEARCH_OPTIONS
	    }
	    
	  end
	  
  end
end