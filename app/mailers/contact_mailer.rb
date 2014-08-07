class ContactMailer < ActionMailer::Base
  RECIPIENT = 'Brian Mason <brian.dale.mason+bmasonio@gmail.com>'
  SENDER = 'contact@bmason.io'

  default to: RECIPIENT
  default from: SENDER

  def contact(name, from, message)
    mail subject: "Email from: #{name} <#{from}>",
         body: message
  end
end
