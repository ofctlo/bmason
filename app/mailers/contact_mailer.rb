class ContactMailer < ActionMailer::Base
  RECIPIENT = 'brian.dale.mason+bmasonio@gmail.com'
  SENDER    = 'contact@bmason.io'

  def contact(from, message)
    mail to: RECIPIENT,
         from: SENDER,
         subject: "Email from #{from}",
         body: message
  end
end
