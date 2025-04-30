class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :update, :destroy, :destroy_statement]
  before_action :authorize_task_access, only: [:show, :update, :destroy, :destroy_statement]
  
  def index
    return render json: { error: "No autorizado" }, status: :unauthorized if current_user.student?
  
    tasks = current_user.admin? ? Task.ordered_by_closing_date : Task.where(created_by: current_user.id).ordered_by_closing_date
    tasks = tasks.where("title ILIKE ?", "%#{params[:title]}%") if params[:title].present?
  
    # Filter tasks based on active status
    if params[:only_active].present?
      now = Time.zone.now
      if params[:only_active] == "true"
        tasks = tasks.where("closing_date >= ?", now)
      else
        tasks = tasks.where("closing_date < ?", now)
      end
    end
  
    paginated_tasks = tasks.page(params[:page]).per(params[:per_page] || 10)
  
    render json: {
      tasks: paginated_tasks,
      meta: {
        current_page: paginated_tasks.current_page,
        total_pages: paginated_tasks.total_pages,
        total_count: paginated_tasks.total_count
      }
    }
  end
  

  # def index
  #   if current_user.student?
  #     render json: { error: "No autorizado" }, status: :unauthorized
  #   else
  #     if current_user.admin?
  #       @tasks = Task.ordered_by_closing_date
  #     else
  #       @tasks = Task.where(created_by: current_user.id).ordered_by_closing_date
  #     end
  #     if params[:title].present?
  #       @tasks = @tasks.where("title ILIKE ?", "%#{params[:title]}%")
  #     end
  #     render json: @tasks
  #   end
  # end

  def show
    @task = Task.includes(:statements).find(params[:id])
    render json: @task.to_json(include: :statements)
  end

  def create
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      task = Task.new(task_params.merge(created_by: current_user.id))

      if task.opening_date >= task.closing_date
        render json: { error: "La fecha de apertura debe ser anterior a la fecha de cierre." }, status: :unprocessable_entity
        return
      end

      if task.save
        if params[:statement_ids].present?
          statements = Statement.where(id: params[:statement_ids])
          task.statements << statements
        end
        render json: task, status: :created
      else
        render json: { error: task.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def update
    authorize! :update, @task

    if @task.update(task_params)
      if params[:statement_ids].present?
        statements = Statement.where(id: params[:statement_ids])

        if statements.count == params[:statement_ids].length
          @task.statements.clear
          @task.statements << statements
        else
          render json: { error: "Algunos enunciados no existen" }, status: :unprocessable_entity
          return
        end
      end
      render json: @task.to_json(include: :statements), status: :ok
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    render json: { message: "Tarea eliminada correctamente." }, status: :ok
  end


  def destroy_statement
    if params[:task_id].blank? || params[:statement_id].blank?
      render json: { error: "Faltan parámetros necesarios." }, status: :bad_request
      return
    end

    @task = Task.find_by(id: params[:task_id])
    @statement = Statement.find_by(id: params[:statement_id])

    if @task.nil? || @statement.nil?
      render json: { error: "Tarea o enunciado no encontrados." }, status: :not_found
      return
    end

    @task.statements.delete(@statement)
    render json: { message: "Enunciado desvinculado de la tarea correctamente." }, status: :ok 
  end

  private 

  def authorize_task_access
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      if current_user.admin? || @task.created_by == current_user.id
        authorize! :manage, @task
      else
        render json: { error: "No autorizado" }, status: :forbidden
      end
    end
  rescue CanCan::AccessDenied
    render json: { error: "No autorizado" }, status: :forbidden
  end

  def task_params
    params.require(:task).permit(:title, :opening_date, :closing_date, :additional_information, :is_exam, :help_available , statement_ids: [])
  end

  def set_task
    @task = Task.find_by(id: params[:id] || params[:task_id])
    render json: { error: "Tarea no encontrada" }, status: :not_found if @task.nil?
  end
end