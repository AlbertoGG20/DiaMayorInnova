class SolutionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_solution, only: [:mark_as_example, :unmark_as_example, :show, :update, :destroy]
  before_action :authorize_solution, only: [:mark_as_example, :unmark_as_example, :show, :update, :destroy]

  def index
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
      return
    end

    @solutions = Solution.all
    render json: @solutions.as_json(
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

  def show
    render json: @solution.as_json(
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

  def create
    if current_user.student?
      render json: { error: "No autorizado" }, status: :forbidden
      return
    end

    @solution = Solution.new(solution_params)

    unless process_account_ids(@solution)
      render json: @solution.errors, status: :unprocessable_entity
      return
    end

    if @solution.save
      render json: @solution.as_json(
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
      ), status: :created
    else
      render json: @solution.errors, status: :unprocessable_entity
    end
  end

  def update
    unless process_account_ids(@solution)
      render json: @solution.errors, status: :unprocessable_entity
      return
    end

    if @solution.update(solution_params)
      update_entries_and_annotations
      render json: @solution.as_json(
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
      ), status: :ok
    else
      render json: @solution.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @solution.destroy
      render json: { message: "Solución eliminada" }, status: :ok
    else
      render json: { error: "No se pudo eliminar la solución" }, status: :unprocessable_entity
    end
  end

  def mark_as_example
    @solution = Solution.find(params[:id])
  
    # Vérifier si un HelpExample existe déjà
    if @solution.help_example.present?
      render json: { success: true, message: "La solution est déjà marquée comme exemple", solution: @solution, help_example: @solution.help_example }, status: :ok
      return
    end
  
    ActiveRecord::Base.transaction do
      @help_example = HelpExample.create!(
        solution_id: @solution.id,
        creditMoves: params[:creditMoves] || "Ejemplo crédito",
        debitMoves: params[:debitMoves] || "Ejemplo débito",
        account_id: params[:account_id] || Account.first&.id || raise(ActiveRecord::RecordInvalid, "Aucun compte disponible")
      )
      
      @solution.update!(is_example: true)
    end
  
    render json: { 
      success: true,
      solution: @solution,
      help_example: @help_example
    }
  rescue ActiveRecord::RecordInvalid => e
    render json: { 
      error: e.message || e.record.errors.full_messages.join(", ")
    }, status: :unprocessable_entity
  end

  def unmark_as_example
    # Vérifier si la solution est un exemple
    unless @solution.help_example.present?
      render json: { error: "Esta solución no es un ejemplo." }, status: :unprocessable_entity
      return
    end

    # Supprimer le HelpExample et mettre à jour is_example
    @help_example = @solution.help_example
    if @help_example.destroy && @solution.update(is_example: false)
      render json: { success: true, message: "Solución desmarcada como ejemplo" }, status: :ok
    else
      errors = (@help_example&.errors&.full_messages || []) + (@solution.errors.full_messages || [])
      render json: { success: false, errors: errors }, status: :unprocessable_entity
    end
  end

  private

  def set_solution
    @solution = Solution.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Solución no encontrada." }, status: :not_found
  end

  def authorize_solution
    @statement = @solution.statement
    if current_user.student? || (@statement.user_id != current_user.id && !current_user.admin?)
      render json: { error: "No autorizado" }, status: :forbidden
    end
  end

  def solution_params
    params.require(:solution).permit(
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
    )
  end

  def process_account_ids(resource)
    solutions = [resource]
    has_errors = false

    solutions.each do |solution|
      (solution.entries || []).each do |entry|
        (entry.annotations || []).each do |annotation|
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

  def update_entries_and_annotations
    if solution_params[:entries_attributes].present?
      solution_params[:entries_attributes].each do |entry_attr|
        if entry_attr[:id].present?
          entry = @solution.entries.find_by(id: entry_attr[:id])
          if entry
            if entry_attr[:_destroy] == "1" || entry_attr[:_destroy] == true
              entry.destroy
            else
              unless entry.update(entry_attr.except(:_destroy, :annotations_attributes).permit(:entry_number, :entry_date))
                @solution.errors.add(:base, "Error en la entrada: #{entry.errors.full_messages.join(', ')}")
              end

              if entry_attr[:annotations_attributes].present?
                entry_attr[:annotations_attributes].each do |annotation_attr|
                  if annotation_attr[:id].present?
                    annotation = entry.annotations.find_by(id: annotation_attr[:id])
                    if annotation
                      if annotation_attr[:_destroy] == "1" || annotation_attr[:_destroy] == true
                        annotation.destroy
                      else
                        unless annotation.update(annotation_attr.except(:_destroy).permit(:number, :credit, :debit, :account_number))
                          @solution.errors.add(:base, "Error en la anotación: #{annotation.errors.full_messages.join(', ')}")
                        end
                      end
                    end
                  else
                    annotation = entry.annotations.build(annotation_attr.except(:_destroy).permit(:number, :credit, :debit, :account_number))
                    unless annotation.save
                      @solution.errors.add(:base, "Error al crear la anotación: #{annotation.errors.full_messages.join(', ')}")
                    end
                  end
                end
              end
            end
          end
        else
          unless entry_attr[:_destroy] == "1" || entry_attr[:_destroy] == true
            entry = @solution.entries.build(entry_attr.except(:_destroy, :annotations_attributes).permit(:entry_number, :entry_date))
            unless entry.save
              @solution.errors.add(:base, "Error al crear la entrada: #{entry.errors.full_messages.join(', ')}")
            end
          end
        end
      end
    end
  end
end