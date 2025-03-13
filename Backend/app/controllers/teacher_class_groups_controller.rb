class TeacherClassGroupsController < ApplicationController
  before_action :authenticate_user!

  def index
    if current_user.teacher?
      @teacherClassGroups = TeacherClassGroup.where(user_id: current_user.id)
    elsif current_user.admin? || current_user.center_admin?
      @teacherClassGroups = TeacherClassGroup.all
    else
      render json: { error: "No autorizado" }, status: :forbidden
      return
    end
    render json: @teacherClassGroups
  end

  def create
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      @teacher_class_group = TeacherClassGroup.new(teacherClassGroup_params)
  
      if @teacher_class_group.save
        render json: { message: "Grupo creado exitosamente", data: @teacher_class_group }, status: :created
      else
        render json: { message: "Error al crear el grupo", errors: @teacher_class_group.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  private

  def teacherClassGroup_params
    params.require(:teacher_class_group).permit(:user_id, :class_group_id)
  end

end
