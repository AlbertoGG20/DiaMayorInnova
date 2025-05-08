class UserMailer < Devise::Mailer
  default from: 'noreply@diamayorinnova.com'

  def reset_password_instructions(record, token, opts={})
    @user = record
    @token = token
    @reset_password_url = "#{ENV['FRONTEND_URL']}/reset-password?reset_password_token=#{@token}"
    
    super
  end
end 