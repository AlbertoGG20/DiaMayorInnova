class ExercisesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_excersise, only: [ :show, :update ]

  def index
    if params[:user_id].present?
      @exercises = Exercise.where(user_id: params[:user_id])
    else
      @exercises = Exercise.all
    end
    render json: @exercises
  end

  def show
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
        render json: { error: "El array de usuarios no puede estar vacío." }, status: :unprocessable_entity
      end
    end
  end

  def update
    if @exercise.update(exercise_params)
      render json: @exercise
    else
      render json: @exercise.errors, status: :unprocessable_entity
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
        render json: { error: "El array de usuarios no puede estar vacío." }, status: :unprocessable_entity
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
            task: { only: [ :title ] },
            user: { only: [ :name ] },
            marks: {
              include: {
                student_entries: {
                  include: {
                    student_annotations: { include: { account: { only: [ :name ] } } }
                  }
                },
                statement: { only: [ :definition ] }
              }
              }
          },
          methods: [ :total_mark ]
        )
      else
        render json: []
      end
    end
  end

  def update_visibility
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
      return
    end

    exercise_ids = params[:exercise_ids]
    is_public = params[:is_public]

    if exercise_ids.blank?
      render json: { error: "Se requieren IDs de ejercicios" }, status: :unprocessable_entity
      return
    end

    begin
      Exercise.where(id: exercise_ids).update_all(is_public: is_public)
      render json: { message: "Visibilidad actualizada correctamente" }, status: :ok
    rescue => e
      render json: { error: "Error al actualizar la visibilidad: #{e.message}" }, status: :unprocessable_entity
    end
  end

  private

    def set_excersise
      @exercise = Exercise.find(params[:id])
    end

    def exercise_params
      params.require(:exercise).permit(:task_id, :is_public, user_id: [])
    end
end
