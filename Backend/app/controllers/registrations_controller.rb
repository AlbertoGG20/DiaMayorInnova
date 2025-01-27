class RegistrationsController < Devise::RegistrationsController
    skip_before_action :authenticate_user!, only: [:create]
    before_action :ensure_auth_header_present, only: :create
    before_action :ensure_admin_user, only: :create

  def new
    super
  end

  def create

    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])

    email = params[:email]
    password = params[:password]
    featured_image = params[:featured_image]
    role = params[:role]
    
    user = User.new(email: email, password: password, role: role)

    if featured_image.present?
      user.featured_image = featured_image
    end

    user.name = params[:name]
    user.first_lastName = params[:first_lastName]
    user.second_lastName = params[:second_lastName]

    if user.save
      user_data = user.as_json
      if user.featured_image.attached?
        user_data[:featured_image] = { url: rails_blob_url(user.featured_image, only_path: true) }
      else
        user_data[:featured_image] = nil
      end
      json_response "Signed Up Succesfully", true, { user: user_data}, :ok
    else
      json_response "Validation Error", false, { errors: user.errors.full_messages }, :unprocessable_entity
    end
=begin 
    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])

  # Usar los parámetros filtrados por `sign_up_params`
  user = User.new(sign_up_params)

  if user.save
    user_data = user.as_json
    if user.featured_image.attached?
      user_data[:featured_image] = { url: rails_blob_url(user.featured_image, only_path: true) }
    else
      user_data[:featured_image] = nil
    end
    json_response "Signed Up Successfully", true, { user: user_data }, :ok
  else
    json_response "Validation Error", false, { errors: user.errors.full_messages }, :unprocessable_entity
  end
=end
  end

  private

  def ensure_admin_user
    token = request.headers['AUTH-TOKEN']
    current_user = User.find_by(authentication_token: token)

    if current_user.respond_to?(:admin?)
      puts "Método admin? disponible"
    else
      puts "Método admin? NO disponible"
    end

    unless current_user&.admin?
      json_response "Unauthorized", false, {}, :unauthorized
    end
  end

  def ensure_auth_header_present
    unless request.headers['Authorization'].present? || request.headers['AUTH-TOKEN'].present?
      json_response "Missing Authorization header", false, {}, :bad_request
    end
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :first_lastName, :second_lastName, :featured_image, :role)
  end
end 