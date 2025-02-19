class StudentExercisesController < ApplicationController
  before_action :authenticate_user!

  def index
    @exercises = Exercise.includes(:task, marks: { student_entries: :student_annotations }).where(user_id: current_user.id)
    render json: @exercises.as_json(
      include: {
        task: { only: [:id, :title, :opening_date, :closing_date] },
        marks: {
            include: {
              student_entries: {
                include: :student_annotations
              }
            }
          }
      }
    )
  end

  def show
    @exercise = Exercise.includes(:task, marks: { student_entries: :student_annotations }).find(params[:id])

    time_remaining = if @exercise.task.is_exam
                       current_time = Time.current
                       if current_time < @exercise.task.opening_date
                         0
                       elsif current_time > @exercise.task.closing_date
                         0
                       else
                         (@exercise.task.closing_date - current_time).to_i
                       end
                     else
                       nil
                     end
  
    render json: {
      exercise: @exercise.as_json(
        include: {
          task: { only: [:id, :title, :opening_date, :closing_date, :is_exam] },
          marks: {
            include: {
              student_entries: {
                include: :student_annotations
              }
            }
          }
        }
      ),
      statements: @exercise.task.statements,
      time_remaining: time_remaining
    }
  end

  def create
    @exercise = current_user.exercises.build(exercise_params)
  
    if @exercise.save
      @mark = Mark.new(exercise_id: @exercise.id, mark: 5, statement_id: 9)
      
      if @mark.save
        render json: { exercise: @exercise, mark: @mark }, status: :created
      else
        render json: @mark.errors, status: :unprocessable_entity
      end
    else
      render json: @exercise.errors, status: :unprocessable_entity
    end
  end

  def find_mark_exercise_by_user

    @exercises = Exercise.includes(:task, marks: { student_entries: :student_annotations }).where(user_id: current_user.id)
  
    render json: @exercises.as_json(
      include: {
        task: {only: [:title]},  
        marks: {
            include: {
              student_entries: {
                include: :student_annotations
              }
            }
          }
      },
      methods: [:total_mark]
    )
  end

  def start
    @exercise = Exercise.find(params[:id])

    # Verificar si el examen existe
    unless @exercise
      render json: { error: "Examen no encontrado." }, status: :not_found
      return
    end

    current_time = Time.current
    if current_time < @exercise.task.opening_date
      render json: { error: "El examen no está disponible aún." }, status: :unprocessable_entity
      return
    elsif current_time > @exercise.task.closing_date
      render json: { error: "El examen ya ha finalizado." }, status: :unprocessable_entity
      return
    elsif @exercise.started
      render json: { error: "El examen ya ha comenzado." }, status: :unprocessable_entity
      return
    else
      if @exercise.update(started: true)
        render json: @exercise, status: :ok
      else
        render json: { error: "Error al iniciar el examen." }, status: :unprocessable_entity
      end
    end
  end

  def update
    @exercise = Exercise.find(params[:id])

    if @exercise.update(exercise_params)
      render json: @exercise, status: :ok
    else
      render json: { errors: @exercise.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def exercise_params
    params.require(:exercise).permit(
      :task_id,
      marks_attributes: [
        :id,
        :statement_id,
        :mark,
        :_destroy,
        student_entries_attributes: [
          :id,
          :entry_number,
          :entry_date,
          :_destroy,
          student_annotations_attributes: [
            :id,
            :account_id,
            :number,
            :account_number,
            :credit,
            :debit,
            :_destroy,
          ]
        ]
      ]
    )
  end
end