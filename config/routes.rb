Rails.application.routes.draw do
  root 'static_pages#index'
  post '/contact' => 'static_pages#contact'
  get '/contact', to: redirect('/')
end
