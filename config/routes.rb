Rails.application.routes.draw do
  root 'static_pages#index'
  get '/contact', to: redirect('/')
  post '/contact' => 'static_pages#contact'
  get '/mandelbrot', to: 'static_pages#mandelbrot'
  get '/resume', to: 'static_pages#resume'
end
