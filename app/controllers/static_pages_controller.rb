class StaticPagesController < ActionController::Base
  def index
  end

  def contact
    ContactMailer.contact(params[:name], params[:from], params[:message]).deliver
    redirect_to :root
  end

  def mandelbrot

  end
end
