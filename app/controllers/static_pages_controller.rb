# This controller handles static content, loosely defined. This pretty much just
# means whatever existed on the site previously.
class StaticPagesController < ApplicationController
  def index
  end

  def contact
    ContactMailer.contact(params[:name], params[:from], params[:message]).deliver
    redirect_to :root
  end

  def mandelbrot

  end
end
