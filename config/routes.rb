Rails.application.routes.draw do
  get 'games/new'
  get 'games/score'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  Rails.application.config.assets.paths << Rails.root.join("node_modules")
  # Defines the root path route ("/")
  # root "articles#index"
end
