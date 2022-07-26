Rails.application.routes.draw do
  get '/new', to: 'games#new'
  post '/score', to: 'games#score'

  root to: 'games#new'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  Rails.application.config.assets.paths << Rails.root.join("node_modules")
  # Defines the root path route ("/")
  # root "articles#index"
end
