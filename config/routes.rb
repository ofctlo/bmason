Rails.application.routes.draw do
  root 'static_pages#index'
  get '/contact', to: redirect('/')
  post '/contact' => 'static_pages#contact'
  get '/mandelbrot', to: 'static_pages#mandelbrot'
  get '/resume', to: 'static_pages#resume'

  # Dynamically generate a route for every file in public/notes. These all route
  # to the notes#show action, which renders the appropriate markdown file.
  #
  # These routes should stay at the bottom since this looping is probably slow.
  paths = Dir.glob("#{Rails.root}/public/notes/**/*").select do
    |f| File.file? f
  end

  paths.each do |path|
    path.slice! "#{Rails.root}/public"
    path_parts = path.split('.')

    # only allow Markdown HTML
    next unless path_parts[1..-1] == %w(html md)

    get path_parts.first, to: 'notes#show'
  end
end
