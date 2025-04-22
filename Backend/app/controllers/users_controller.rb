class UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]
  before_action :authenticate_admin, except: [:current, :index, :show]
  before_action :set_user, only: [:show, :update, :destroy]
  
  def index
    unless current_user&.admin? || current_user&.teacher? || current_user&.school_admin?
      return json_response "Unauthorized", false, {}, :unauthorized
    end

    users = User.all

    if current_user.school_admin?
      users = users.where(school_center_id: current_user.school_center_id)
    elsif current_user.teacher?
      users = users.where(role: 'student', school_center_id: current_user.school_center_id)
    elsif current_user.admin?
      if params[:school_center_id].present?
        users = users.where(school_center_id: params[:school_center_id]).where.not(role: ['admin', 'center_admin'])
      end
    end

    if params[:name].present?
      users = users.where("name ILIKE ?", "%#{params[:name]}%")
    elsif params[:class_groups_id].present?
      users = users.joins(:student_class_groups).where(student_class_groups: { class_group_id: params[:class_groups_id] })
    end

    paginated_users  = users.page(params[:page]).per(params[:per_page] || 10)

    users_data = paginated_users.map do |user|
      user_data = user.as_json
      user_data[:featured_image] = user.featured_image.attached? ? { url: rails_blob_url(user.featured_image, only_path: true) } : nil
      user_data
    end

    json_response "Users retrieved successfully", true, {
      data: {
        users: users_data,
        meta: {
          current_page: paginated_users.current_page,
          total_pages: paginated_users.total_pages,
          total_count: paginated_users.total_count
        }
      }
    }, :ok
  end

  def show
    if current_user.school_admin? && @user.school_center_id != current_user.school_center_id
      return json_response "Unauthorized", false, {}, :unauthorized
    end
    
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

    if current_user.center_admin?
      user.school_center_id = current_user.school_center_id
    end

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

    if current_user.school_admin? && @user.school_center_id != current_user.school_center_id
      return json_response "Unauthorized", false, {}, :unauthorized
    end
    
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
    if current_user.school_admin? && @user.school_center_id != current_user.school_center_id
      return json_response "Unauthorized", false, {}, :unauthorized
    end

    @user.destroy
    json_response "User deleted successfully", true, {}, :ok
  end

  def current
    user_data = current_user.as_json(only: [:id, :email, :name, :role, :school_center_id])
    if current_user.featured_image.attached?
      user_data[:featured_image] = { url: rails_blob_url(current_user.featured_image, only_path: true) }
    else
      user_data[:featured_image] = nil
    end
    render json: { user: user_data }, status: :ok
  end

  def by_class
    class_group = ClassGroup.find(params[:id])
    users = class_group.students
    render json: {
      data: {
        users: users.map { |u| UserSerializer.new(u) }
      }
    }
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    json_response("User not found", false, {}, :not_found)
  end

  def user_params
    permitted = params.require(:user).permit(:email, :password, :password_confirmation, :name, :first_lastName, :second_lastName, :featured_image, :role, :school_center_id)
    permitted.delete(:featured_image) if permitted[:featured_image].is_a?(String)
    permitted  end

  def authenticate_admin
    current_user = User.find_by(authentication_token: request.headers['AUTH-TOKEN'])
    unless current_user&.admin? || current_user&.center_admin?
      json_response "Unauthorized", false, {}, :unauthorized
    end
  end

end
