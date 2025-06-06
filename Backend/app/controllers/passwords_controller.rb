class PasswordsController < Devise::PasswordsController
  skip_before_action :authenticate_user!
  protect_from_forgery with: :null_session, only: [:forgot, :edit, :update]
  respond_to :json

  def forgot
    if params[:email].blank?
      return json_response("El email no puede estar vacío", false, {}, :unprocessable_entity)
    end

    user = User.find_by(email: params[:email])
    if user.present?
      user.send_reset_password_instructions
      json_response("Se han enviado las instrucciones a tu correo electrónico", true, {}, :ok)
    else
      json_response("El email no pertenece a ningún usuario", false, {}, :not_found)
    end
  end

  def edit
    self.resource = resource_class.new
    set_minimum_password_length
    resource.reset_password_token = params[:reset_password_token]

    # Usar el método de Devise para validar el token
    user = User.with_reset_password_token(params[:reset_password_token])

    if user.present?
      # Redirigir al frontend con el token como parámetro
      redirect_to "#{ENV['FRONTEND_URL']}/reset-password?reset_password_token=#{params[:reset_password_token]}"
    else
      redirect_to "#{ENV['FRONTEND_URL']}/reset-password?error=invalid_token"
    end
  end

  def update
    self.resource = resource_class.reset_password_by_token(reset_password_params)
    yield resource if block_given?

    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message!(:notice, :updated_not_active)
        render json: { message: "Contraseña actualizada correctamente" }, status: :ok
      else
        set_flash_message!(:warning, :updated_not_active)
        render json: { message: "Contraseña actualizada pero la cuenta está inactiva" }, status: :ok
      end
    else
      set_minimum_password_length
      render json: { error: resource.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def json_response(message, success, data = {}, status = :ok)
    render json: {
      message: message,
      success: success,
      data: data
    }, status: status
  end

  def reset_password_params
    params.require(:user).permit(:password, :password_confirmation, :reset_password_token)
  end
end