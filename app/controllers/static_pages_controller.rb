class StaticPagesController < ActionController::Base
  def index
  end

  def contact
    ContactMailer.contact(params[:from], params[:subject], params[:message]).deliver
    redirect_to :root
  end
end
