class StatementsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_statement, only: [:show, :update, :destroy, :get_solutions, :add_solution]
  before_action :authorize_statement, only: [:show, :update, :destroy, :get_solutions, :add_solution]

  def index
    return render json: { error: "No autorizado" }, status: :forbidden if current_user.student?
  
    begin
      statements = Statement.includes(solutions: { entries: :annotations })
  
      unless current_user.admin?
        statements = statements.where("is_public = ? OR user_id = ?", true, current_user.id)
      end
  
      paginated_statements = statements.page(params[:page]).per(params[:per_page] || 10)
  
      render json: {
        statements: paginated_statements.as_json(
          include: {
            solutions: {
              include: {
                entries: {
                  include: {
                    annotations: {
                      order: :number
                    }
                  }
                }
              }
            }
          }
        ),
        meta: {
          current_page: paginated_statements.current_page,
          total_pages: paginated_statements.total_pages,
          total_count: paginated_statements.total_count
        }
      }
    rescue => e
      render json: @statement.errors, status: :internal_server_error
    end
  end
  

  def show
    render json: @statement.as_json(
      include: {
        solutions: {
          include: {
            entries: {
              include: {
                annotations: {
                  order: :number
                }
              }
            }
          }
        } 
      }
    )
  end

  def create
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    else
      @statement = current_user.statements.build(statement_params)
      
      unless process_account_ids(@statement)
        @statement.solutions.each do |solution|
          solution.entries.each do |entry|
            entry.annotations.each do |annotation|
              annotation.errors.full_messages.each do |message|
                @statement.errors.add(:base, "Anotación #{annotation.number}: #{message}")
              end
            end
          end
        end
        render json: @statement.errors, status: :unprocessable_entity
        return
      end

      if @statement.save
        render json: @statement, status: :created
      else
        render json: @statement.errors, status: :unprocessable_entity
      end
    end
  end

  def get_solutions
    solutions = @statement.solutions.includes(entries: { annotations: :account })
    render json: solutions.as_json(
      include: {
        entries: {
          include: {
            annotations: {
              include: { account: { only: [:account_number, :name] } },
              methods: [:account_name],
              order: :number
            }
          }
        }
      }
    )
  end

  def add_solution
    @solution = @statement.solutions.build(solution_params)

    unless process_account_ids(@solution)
      render json: @solution.errors, status: :unprocessable_entity
      return
    end
    
    if @solution.save
      if params[:entries]
        params[:entries].each do |entry_params|
          entry = @solution.entries.build(entry_params)
          if entry.save && entry_params[:annotations]
            entry_params[:annotations].each do |annotation_params|
              entry.annotations.build(annotation_params)
            end
          end
        end
      end
      render json: @solution, status: :created
    else
      render json: @solution.errors, status: :unprocessable_entity
    end
  end

  def update
    Rails.logger.debug "Params received in update: #{params[:statement].inspect}"
    if @statement.user_id == current_user.id || current_user.admin?
      if @statement.update(statement_params)
        unless process_account_ids(@statement)
          render json: @statement.errors, status: :unprocessable_entity
          return
        end

        update_solutions_and_entries
        render json: @statement, status: :ok
      else
        render json: @statement.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "No autorizado" }, status: :forbidden
    end
  end

=begin   
def update
    Rails.logger.debug "Params received in update: #{params[:statement].inspect}"
  
    if @statement.user_id == current_user.id || current_user.admin?
      unless process_account_ids(@statement)  # Validamos cuentas antes de actualizar
        render json: @statement.errors, status: :unprocessable_entity
        return
      end
  
      if @statement.update(statement_params)
        render json: @statement, status: :ok
      else
        render json: @statement.errors, status: :unprocessable_entity
      end
    else
      render json: { error: "No autorizado" }, status: :forbidden
    end
  end
=end

  def destroy
    if @statement.user_id == current_user.id || current_user.admin?
      @statement.solutions.destroy_all
      if @statement.destroy
        render json: { message: "Enunciado eliminado"}, status: :ok
      else
        render json: { error: "No se pudo eliminar el enunciado" }, status: :unprocessable_entity
      end
    else
      render json: { error: "No autorizado" }, status: :forbidden
    end
  end

  private

  def authorize_statement
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
    elsif current_user.admin? || (current_user.teacher? && (@statement.user_id == current_user.id || @statement.is_public))

    else
      render json: { error: "No autorizado" }, status: :forbidden
    end
  end

  def statement_params
    Rails.logger.debug "Params received: #{params[:statement].inspect}"
    params.require(:statement).permit(
      :definition, 
      :explanation, 
      :is_public,
      solutions_attributes: [
        :id,
        :description,
        :_destroy,
        entries_attributes: [
          :id,
          :entry_number,
          :entry_date,
          :_destroy,
          annotations_attributes: [
            :id,
            :number,
            :credit,
            :debit,
            :account_number,
            :_destroy
          ]
        ]
      ]
    )
  end

  def solution_params
    params.require(:solution).permit(
    :description, :_destroy, # Debes permitir el atributo _destroy aquí también
    entries_attributes: [
      :id,
      :entry_number,
      :entry_date,
      :_destroy,
      annotations_attributes: [
        :id,
        :number,
        :credit,
        :debit,
        :account_number,
        :_destroy
      ]
    ]
  )
  end

  def set_statement
    @statement = Statement.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Statement not found' }, status: :not_found
  end

  def process_account_ids(resource)
    solutions = resource.is_a?(Statement) ? resource.solutions : [resource]
    has_errors = false

    solutions.each do |solution|
      solution.entries.each do |entry|
        entry.annotations.each do |annotation|
          Rails.logger.debug "Account number: #{annotation.account_number}"
          
          if annotation.account_number.present?
            account = Account.find_by(account_number: annotation.account_number)
            
            if account
              if annotation.account_id.nil? || annotation.account_id != account.id
                annotation.account_id = account.id 
                unless annotation.valid?
                  Rails.logger.debug "Error en la anotación: #{annotation.errors.full_messages}"
                  has_errors = true
                end
              end
            else
              annotation.errors.add(:account_number, "no válido o no encontrado")
              has_errors = true
            end
          else
            annotation.errors.add(:account_number, "es obligatorio")
            has_errors = true
          end
        end
      end
    end

    if has_errors
      resource.errors.add(:base, "Una o más anotaciones tienen errores y no se pueden guardar.")
      false
    else
      true
    end
  end

  def update_solutions_and_entries
    if statement_params[:solutions_attributes].present?
      statement_params[:solutions_attributes].each do |solution_attr|
        if solution_attr[:id].present?
          solution = @statement.solutions.find_by(id: solution_attr[:id])
          if solution
            if solution_attr[:_destroy] == "1" || solution_attr[:_destroy] == true
              solution.destroy
            else
              # Actualiza la solución
              unless solution.update(solution_attr.except(:_destroy, :entries_attributes).permit(:description))
                Rails.logger.error "Error al actualizar la solución: #{solution.errors.full_messages}"
                @statement.errors.add(:base, "Error en la solución: #{solution.errors.full_messages.join(', ')}")
                next
              end
  
              # Procesa las entradas de la solución
              if solution_attr[:entries_attributes].present?
                solution_attr[:entries_attributes].each do |entry_attr|
                  if entry_attr[:id].present?
                    entry = solution.entries.find_by(id: entry_attr[:id])
                    if entry
                      if entry_attr[:_destroy] == "1" || entry_attr[:_destroy] == true
                        entry.destroy
                      else
                        # Actualiza la entrada
                        unless entry.update(entry_attr.except(:_destroy, :annotations_attributes).permit(:entry_number, :entry_date))
                          Rails.logger.error "Error al actualizar la entrada: #{entry.errors.full_messages}"
                          @statement.errors.add(:base, "Error en la entrada: #{entry.errors.full_messages.join(', ')}")
                          next
                        end
  
                        # Procesa las anotaciones de la entrada
                        if entry_attr[:annotations_attributes].present?
                          entry_attr[:annotations_attributes].each do |annotation_attr|
                            if annotation_attr[:id].present?
                              annotation = entry.annotations.find_by(id: annotation_attr[:id])
                              if annotation
                                if annotation_attr[:_destroy] == "1" || annotation_attr[:_destroy] == true
                                  annotation.destroy
                                else
                                  # Actualiza la anotación
                                  unless annotation.update(annotation_attr.except(:_destroy, :account_name).permit(:number, :credit, :debit, :account_number))
                                    Rails.logger.error "Error al actualizar la anotación: #{annotation.errors.full_messages}"
                                    @statement.errors.add(:base, "Error en la anotación: #{annotation.errors.full_messages.join(', ')}")
                                  end
                                end
                              end
                            else
                              # Crea una nueva anotación
                              annotation = entry.annotations.build(annotation_attr.except(:_destroy, :account_name).permit(:number, :credit, :debit, :account_number))
                              unless annotation.save
                                Rails.logger.error "Error al crear la anotación: #{annotation.errors.full_messages}"
                                @statement.errors.add(:base, "Error al crear la anotación: #{annotation.errors.full_messages.join(', ')}")
                              end
                            end
                          end
                        end
                      end
                    end
                  else
                    # Crea una nueva entrada
                    entry = solution.entries.build(entry_attr.except(:_destroy, :annotations_attributes).permit(:entry_number, :entry_date))
                    unless entry.save
                      Rails.logger.error "Error al crear la entrada: #{entry.errors.full_messages}"
                      @statement.errors.add(:base, "Error al crear la entrada: #{entry.errors.full_messages.join(', ')}")
                    end
                  end
                end
              end
            end
          end
        else
          # Crea una nueva solución
          unless solution_attr[:_destroy] == "1" || solution_attr[:_destroy] == true
            solution = @statement.solutions.build(solution_attr.except(:_destroy, :entries_attributes).permit(:description))
            unless solution.save
              Rails.logger.error "Error al crear la solución: #{solution.errors.full_messages}"
              @statement.errors.add(:base, "Error al crear la solución: #{solution.errors.full_messages.join(', ')}")
            end
          end
        end
      end
    end
  end
end