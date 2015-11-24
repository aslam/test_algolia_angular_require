Firestorm::Application.routes.draw do

  SHORT_NAME_REG_EX = /[a-zA-Z0-9\-_]+/.freeze

  scope "__breeze__", module: "v3", as: "v3" do
    get ":account_name" => "accounts#show", :constraints => { :account_name => SHORT_NAME_REG_EX, :format => /(html|json)/ }
    resources :accounts, only: :show do
      scope :module => "accounts" do
        resources :events
      end
    end
  end
end
