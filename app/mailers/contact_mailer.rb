class ContactMailer < ActionMailer::Base
  default to: 'Brian Mason <brian.dale.mason+bmasonio@gmail.com>'
  default from: 'contact@bmason.io'

  def contact(from, message)
    mail to: RECIPIENT,
         from: SENDER,
         subject: "Email from: #{name} <#{from}>",
         body: message
  end
end
