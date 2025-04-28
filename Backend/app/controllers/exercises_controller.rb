class ExercisesController < ApplicationController
  before_action :authenticate_user!

  def index
    if params[:user_id].present?
      @exercises = Exercise.where(user_id: params[:user_id])
    else
      @exercises = Exercise.all
    end
    render json: @exercises
  end

  def show
    @exercise = Exercise.find(params[:id])
    render @exercise
  end

  def create
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      task_id = exercise_params[:task_id]
      user_ids = exercise_params[:user_id] 

      if user_ids.present?
        user_ids.each do | user_id |
          exercise= Exercise.create(task_id: task_id, user_id: user_id)
        end
      else
        render json: { error: 'El array de usuarios no puede estar vacío.' }, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      @exercises = Exercise.all
      @exercise = Exercise.find(params[:id])
      @exercise.destroy
      render json: @exercises
    end
  end

  def destroy_on_group
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      task_id = exercise_params[:task_id]
      user_ids = exercise_params[:user_id]

      if user_ids.present? 
        user_ids.each do | user_id |
          exercise= Exercise.where(user_id: user_id, task_id: task_id)
          exercise.destroy_all
        end
      else
        render json: { error: 'El array de usuarios no puede estar vacío.' }, status: :unprocessable_entity
      end
    end
  end

  def find_by_task_id
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      user_ids = Exercise.where(task_id: params[:task_id]).pluck(:user_id)
      if user_ids.any?
        render json: user_ids
      else
        render json: []
      end
    end
  end

  def find_by_exercise_id
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      exercise = Exercise.includes(:task, :user, marks: [
        { student_entries: :student_annotations },
        :statement
      ])
      .where(id: params[:exercise_id])
      
      if exercise.any?
        render json: exercise.as_json(
          include: {
            task: {only: [:title]},  
            user: {only: [:name]},
            marks: {
              include: {
                student_entries: {
                  include: {
                    student_annotations: { include: {account: {only: [:name]}}}
                  }
                },
                statement: { only: [:definition] }
              }
              }
          },
          methods: [:total_mark]
        )
      else
        render json: []
      end
    end
  end

  

  private
    def exercise_params
      params.require(:exercise).permit( :task_id, user_id: [])
    end 
end
