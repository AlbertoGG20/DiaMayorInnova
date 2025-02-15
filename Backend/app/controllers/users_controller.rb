class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]
  before_action :authenticate_admin, except: [:index, :show]
  before_action :set_user, only: [:show, :update, :destroy]
  
  def index
    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])

    unless current_user && (current_user.admin? || current_user.role == "teacher")
      return json_response "Unauthorized", false, {}, :unauthorized
    end

    if params[:name].present?
      users = User.where("name ILIKE ?", "%#{params[:name]}%")
    else
      if params[:class_groups_id].present?
        users = User.where(role: "student", class_groups_id: params[:class_groups_id])
      else
        users = User.all
      end
    end

    users_data = users.map do |user|
      user_data = user.as_json
      if user.featured_image.attached?
        user_data[:featured_image] = { url: rails_blob_url(user.featured_image, only_path: true) }
      else
        user_data[:featured_image] = nil
      end
      user_data
    end
    json_response "Users retrieved successfully", true, { users: users_data }, :ok
  end

  def show
    user_data = @user.as_json
    if @user.featured_image.attached?
      user_data[:featured_image] = { url: rails_blob_url(@user.featured_image, only_path: true) }
    else
      user_data[:featured_image] = nil
    end
    json_response "User retrieved successfully", true, { user: user_data }, :ok
  end

  def create

    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])

    user = User.new(user_params)

    if user.save
      user_data = user.as_json
      if user.featured_image.attached?
        user_data[:featured_image] = { url: rails_blob_url(user.featured_image, only_path: true) }
      else
        user_data[:featured_image] = nil
      end
      json_response "User created successfully", true, { user: user_data }, :ok
    else
      json_response "Validation Error", false, { errors: user.errors.full_messages }, :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      user_data = @user.as_json
      if @user.featured_image.attached?
        user_data[:featured_image] = { url: rails_blob_url(@user.featured_image, only_path: true) }
      else
        user_data[:featured_image] = nil
      end
      json_response "User updated successfully", true, { user: user_data }, :ok
    else
      json_response "Validation Error", false, { errors: @user.errors.full_messages }, :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    json_response "User deleted successfully", true, {}, :ok
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    json_response("User not found", false, {}, :not_found)
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :first_lastName, :second_lastName, :featured_image, :role)
  end

  def authenticate_admin
    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])
    unless current_user && current_user.admin?
      json_response "Unauthorized", false, {}, :unauthorized
    end
  end

end
