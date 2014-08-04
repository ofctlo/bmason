class ContactMailer < ActionMailer::Base
  RECIPIENT = 'brian.dale.mason+bmasonio@gmail.com'

  def contact(from, subject, message)
    mail to: RECIPIENT, from: from, subject: subject, body: message
  end
end
