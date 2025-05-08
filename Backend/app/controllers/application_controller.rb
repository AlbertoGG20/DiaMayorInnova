class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  respond_to :json

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!, unless: :devise_controller?

  # Este método valida el token en cada solicitud
  def authenticate_user!
    token = request.headers['AUTH-TOKEN']
    @current_user = User.find_by(authentication_token: token)
    
    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  # Método auxiliar para obtener el usuario actual
  def current_user
    @current_user
  end

  # Método para verificar si el usuario tiene un rol específico
  def authenticate_role!(role)
    unless current_user && current_user.role == role.to_s
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  # Método específico para verificar si el usuario es admin
  def authenticate_admin!
    authenticate_role!(:admin)
  end

  include Response

   # Este código se asegura de manejar las excepciones de CanCanCan
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, alert: exception.message
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :email, :password, :password_confirmation, :current_password])
  end
end
