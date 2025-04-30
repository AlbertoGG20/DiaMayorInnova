class StudentExercisesController < ApplicationController
  before_action :authenticate_user!

  def index
    return render json: { error: "No autorizado" }, status: :unauthorized unless current_user.student?
  
    exercises = Exercise.includes(:task, marks: { student_entries: :student_annotations })
                        .where(user_id: current_user.id)
  
    if params[:only_active].present? && params[:only_active] == "true"
      now = Time.zone.now
      exercises = exercises.joins(:task).where("tasks.opening_date <= ? AND tasks.closing_date >= ?", now, now)
    end
  
    paginated_exercises = exercises.page(params[:page]).per(params[:per_page] || 5)
  
    render json: {
      exercises: paginated_exercises.as_json(
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
      meta: {
        current_page: paginated_exercises.current_page,
        total_pages: paginated_exercises.total_pages,
        total_count: paginated_exercises.total_count
      }
    }
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
          task: { 
            only: [:id, :title, :opening_date, :closing_date, :is_exam, :help_available],
            include: :statements
          },
          marks: {
            include: {
              student_entries: {
                include: {
                  student_annotations: { include: {account: {only: [:name]}}}
                }
              }
            }
          }
        }
      ),
      time_remaining: time_remaining
    }
  end

  def create
    @exercise = current_user.exercises.build(exercise_params)
  
    if @exercise.save
      render json: @exercise, status: :created
    else
      render json: @exercise.errors, status: :unprocessable_entity
    end
  end


  def students_mark_list
    task_id = params[:task_id] # Get ID by param
    per_page = params[:per_page] || 10
    page = params[:page] || 1

    @students_marks = Exercise
      .includes(:marks, :task, :user)     # Get relations
      .where(task_id: task_id)            # Filter all exercises from a specific task
      .where(users: { role: "student" })  # Only students
      .joins(:user)                       # Join all student users
      .distinct                           # Avoid dupes
      .page(page).per(per_page)
    
    result = @students_marks.map do |exercise|
      {
        exercise_id: exercise.id, 
        task_tittle: exercise.task.title,  
        student: exercise.user.name,
        mark: exercise.total_mark.round(1),
        date: exercise.updated_at.strftime("%d/%m/%Y, %H:%M:%S")
      }
    end

    render json: {
      students: result,
      meta: {
        current_page: @students_marks.current_page,
        total_pages: @students_marks.total_pages,
        total_count: @students_marks.total_count
      }
    }
  end


  def find_mark_exercise_by_user
    @exercises = Exercise.includes(:task, marks: { student_entries: :student_annotations })
                         .where(user_id: current_user.id)
                         .page(params[:page])
                         .per(params[:per_page] || 5)
  
    render json: {
      exercises: @exercises.as_json(
        include: {
          task: { only: [:title] },
          marks: {
            include: {
              student_entries: {
                include: :student_annotations
              }
            }
          }
        },
        methods: [:total_mark]
      ),
      meta: {
        current_page: @exercises.current_page,
        total_pages: @exercises.total_pages,
        total_count: @exercises.total_count
      }
    }
  end
  

  def start
    @exercise = Exercise.find(params[:id])
    task = @exercise.task

    if task.is_exam?
      return render json: { error: "Examen no encontrado." }, status: :not_found unless @exercise
      return render json: { error: "El examen no está disponible aún." }, status: :unprocessable_entity if Time.current < task.opening_date
      return render json: { error: "El examen ya ha finalizado." }, status: :unprocessable_entity if Time.current > task.closing_date
      return render json: { error: "El examen ya ha comenzado." }, status: :unprocessable_entity if @exercise.started
    else
      return render json: { error: "Tarea no disponible aún." }, status: :unprocessable_entity if Time.current < task.opening_date
      return render json: { error: "Tarea ya cerrada." }, status: :unprocessable_entity if Time.current > task.closing_date
    end
  
    if @exercise.update(started: true)
      render json: {
        exercise: @exercise,
        time_remaining: task.is_exam? ? (task.closing_date - Time.current).to_i : nil
      }, status: :ok
    else
      render json: { error: "Error al iniciar." }, status: :unprocessable_entity
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

  def finish
    @exercise = Exercise.find(params[:id])
    
    if @exercise.update(finished: true)
      render json: { success: true }
    else
      render json: { error: @exercise.errors.full_messages }, 
             status: :unprocessable_entity
    end
  end

  def update_student_exercise
    @exercise = Exercise.find(params[:id])

    if @exercise.finished
      render json: { error: "El examen ya ha sido enviado y no puede ser modificado" }, 
             status: :unprocessable_entity
      return
    end
    
    if @exercise.update(exercise_params)
      # Obtener todos los enunciados del ejercicio
      all_statements = @exercise.task.statements
      marks_params = exercise_params[:marks_attributes] || []
      
      # Para cada enunciado del ejercicio
      all_statements.each do |statement|
        # Buscar si hay una marca para este enunciado
        mark_param = marks_params.find { |mp| mp[:statement_id].to_i == statement.id }
        
        if mark_param
          # Si hay una marca, procesarla normalmente
          @exercise.marks.where(statement_id: statement.id).destroy_all
          mark = @exercise.marks.create!(mark_param.except(:student_entries_attributes).merge(mark: 0, statement_id: statement.id))
          
          param_entries = mark_param[:student_entries_attributes] || []
          mark_value = compute_grade(statement, param_entries)
          mark.update!(mark: mark_value)
          
          student_entries_params = mark_param[:student_entries_attributes] || []
          student_entries_params.each do |entry_param|
            entry = mark.student_entries.create!(entry_param.except(:student_annotations_attributes))
    
            student_annotations_params = entry_param[:student_annotations_attributes] || []
            student_annotations_params.each do |annotation_param|
              entry.student_annotations.create!(annotation_param)
            end
          end
        else
          # Si no hay una marca para este enunciado, crear una con nota 0
          @exercise.marks.where(statement_id: statement.id).destroy_all
          mark = @exercise.marks.create!(
            statement_id: statement.id,
            mark: 0
          )
        end
      end
      
      render json: @exercise, status: :ok
    else
      render json: { errors: @exercise.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_student_task
    @exercise = Exercise.find(params[:id])

    params[:exercise][:marks_attributes].each do |mark|
      mark[:student_entries_attributes].each do |entry|
        entry[:student_annotations_attributes] ||= []
        entry[:student_annotations_attributes].each do |anno|
          anno[:_destroy] = true if anno[:deleted]
        end
      end
    end

    if @exercise.update(exercise_params)
      # Limpiar registros marcados para destrucción
      @exercise.reload
      marks = @exercise.marks.reject(&:marked_for_destruction?)
      marks.each do |mark|
        mark.student_entries = mark.student_entries.reject(&:marked_for_destruction?)
        mark.student_entries.each do |entry|
          entry.student_annotations = entry.student_annotations.reject(&:marked_for_destruction?)
        end
      end
      render json: @exercise.as_json(
      include: {
        marks: {
          methods: [:filtered_student_entries]
        }
      }
    ), status: :ok
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

  def compute_grade(statement, param_entries)
    # Si no hay entradas para este enunciado, la nota es 0
    return 0 if param_entries.empty?

    grade = 1
    statement.solutions.each do |solution|
      solution.entries.each do |solution_entry|
        # Busca una entrada del estudiante que coincida con la fecha de la solución
        matching_entry = param_entries.find do |entry|
          entry[:entry_date].to_s == solution_entry.entry_date.to_s
        end

        if matching_entry
          param_annotations = matching_entry[:student_annotations_attributes] || []
          solution_entry.annotations.each do |annotation|
            # Busca una anotación que coincida exactamente con la solución
            matching_annotation = param_annotations.find do |param_annotation|
              param_annotation[:account_id].to_i == annotation.account_id &&
              param_annotation[:credit].to_f == annotation.credit.to_f &&
              param_annotation[:debit].to_f == annotation.debit.to_f
            end
            if matching_annotation.nil?
              grade = 0  # Si no encuentra una anotación correcta, nota 0
              return grade
            end
          end

          # Verifica si hay anotaciones adicionales
          if param_annotations.size > solution_entry.annotations.size
            grade = 0.5  # Si hay anotaciones adicionales pero todas las correctas están, nota 0.5
          end
        else
          grade = 0  # Si no encuentra entrada coincidente, nota 0
          return grade
        end
      end
    end
    grade
  end

end