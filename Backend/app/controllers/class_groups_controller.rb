class ClassGroupsController < ApplicationController
    before_action :authenticate_user!
    # Esto protege las rutas de 'show', 'index', 'create', 'update', 'destroy'
    load_and_authorize_resource

  def index
    Rails.logger.debug "Current User: #{current_user.inspect}"

    if current_user.admin?
        @classGroups = ClassGroup.all
    else

      if current_user.teacher? || current_user.center_admin?
        @classGroups = ClassGroup.where(school_center_id: current_user.school_center_id)
      else
        return json_response "Unauthorized", false, {}, :unauthorized
      end
    end

    @classGroups = @classGroups.where("course_module LIKE ?", "%#{params[:course_module]}%") if params[:course_module].present?

    if params[:user_id].present?
      @classGroups = @classGroups.joins(:teacher_class_groups).where(teacher_class_groups: { user_id: params[:user_id] })
    end

    render json: @classGroups
  end
    
  def show
      @classGroup = ClassGroup.find(params[:id])
      render json: @classGroup
  end

  def users
    @class_group = ClassGroup.find(params[:id])
    students = @class_group.students
    teachers = @class_group.teachers
    
    render json: {
      data: {
        users: (students + teachers).map { |u| UserSerializer.new(u) }
      }
    }
  end

  def create
    if current_user.admin?
      @classGroup = ClassGroup.new(class_group_params)

    elsif current_user.center_admin?
      @classGroup = ClassGroup.new(class_group_params.merge(school_center_id: current_user.school_center_id))
  
    else
      return render json: { error: "No autorizado para crear grupos de clase" }, status: :unauthorized
    end
  
    if @classGroup.save
      render json: @classGroup, status: :created
    else
      render json: @classGroup.errors, status: :unprocessable_entity
    end
  end

  def update
    @classGroup = ClassGroup.find(params[:id])
    if current_user.admin?
    elsif current_user.center_admin? && @classGroup.school_center_id == current_user.school_center_id
    elsif current_user.teacher? && @classGroup.teacher_class_groups.exists?(user_id: current_user.id)
    else
      return render json: { error: "No autorizado para modificar este grupo" }, status: :unauthorized
    end
    
    if @classGroup.update(class_group_params)
      render json: @classGroup
    else
      render json: @classGroup.errors, status: :unprocessable_entity
    end
  end

  def update_users
    @class_group = ClassGroup.find(params[:id])
    authorize! :manage_users, @class_group

    student_ids = User.where(id: params[:users], role: 'student').pluck(:id)
    teacher_ids = User.where(id: params[:users], role: 'teacher').pluck(:id)

    @class_group.student_class_groups.where.not(user_id: student_ids).destroy_all
    existing_student_ids = @class_group.students.pluck(:id)
    new_students = student_ids - existing_student_ids
    new_students.each do |user_id|
      @class_group.student_class_groups.create!(user_id: user_id)
    end

    @class_group.update!(number_students: student_ids.size)

    @class_group.teacher_class_groups.where.not(user_id: teacher_ids).destroy_all
    existing_teacher_ids = @class_group.teachers.pluck(:id)
    new_teachers = teacher_ids - existing_teacher_ids
    new_teachers.each do |user_id|
      @class_group.teacher_class_groups.create!(user_id: user_id)
    end
    
    render json: { message: 'Usuarios actualizados exitosamente' }
  end

  def destroy
    @classGroup = ClassGroup.find(params[:id])

    if current_user.admin?

    elsif current_user.center_admin?
      unless @classGroup.school_center_id == current_user.school_center_id
        return render json: { error: "No autorizado para eliminar este grupo" }, status: :unauthorized
      end
    elsif current_user.teacher?
      unless @classGroup.teacher_class_groups.exists?(user_id: current_user.id)
        return render json: { error: "No autorizado para eliminar este grupo" }, status: :unauthorized
      end
    else
      return render json: { error: "No autorizado para eliminar este grupo" }, status: :unauthorized
    end
    
    begin
      @classGroup.destroy
      render json: { message: 'Grupo de clase eliminado con éxito' }, status: :ok
    rescue ActiveRecord::InvalidForeignKey => e
      render json: { error: 'No se puede eliminar el grupo porque aún tiene asociaciones activas.' }, status: :unprocessable_entity
    end
  end
  end

    private

    # Método para manejar los parámetros permitidos usando strong parameters
    def class_group_params
        params.require(:class_group).permit(:course, :course_module, :modality, :number_students, :max_students, :location, :weekly_hours, :school_center_id)
    end

