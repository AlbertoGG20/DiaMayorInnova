require 'caxlsx'


class MarksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_mark, only: [:show, :update]
  load_and_authorize_resource

  def index
    if params[:exercise_id].present?
      @marks = Mark.where(exercise_id: params[:exercise_id])
    else
      @marks = Mark.all
    end
  
    render json: @marks
  end
  
  def show
    render json: @mark
  end
  
  def create
    @mark = Mark.new(mark_params)
  
    if @mark.save
      render json: @mark, status: :created
    else
      render json: @mark.errors, status: :unprocessable_entity
    end
  end
  
  def update
    if @mark.update(mark_params)
      render json: @mark
    else
      render json: @mark.errors, status: :unprocessable_entity
    end
  end

  def update_multiple
    marks_params = params.require(:marks).map do |mark_param|
      mark_param.permit(:id, :mark, :comment)
    end
  
    errors = []
  
    Mark.transaction do
      marks_params.each do |mark_param|
        mark = Mark.find_by(id: mark_param[:id])
  
        if mark
          unless mark.update(mark: mark_param[:mark], comment: mark_param[:comment])
            errors << { id: mark.id, errors: mark.errors.full_messages }
            raise ActiveRecord::Rollback 
          end
        else
          errors << { id: mark_param[:id], error: "No se encontró la marca" }
          raise ActiveRecord::Rollback 
        end
      end
    end
  
    if errors.any?
      render json: { status: 'error', errors: errors }, status: :unprocessable_entity
    else
      render json: { status: 'success' }, status: :ok
    end
  end
  
  
  
  def destroy
    @marks = Mark.all
    @mark = Mark.find(params[:id])
    @mark.destroy
    render json: @marks
  end

  def export_xlsx
    exercise_id = params[:exercise_id]
    
    if exercise_id.present?
      begin
        marks = Mark.where(exercise_id: exercise_id).includes(:exercise => :user)
        
        package = Axlsx::Package.new
        workbook = package.workbook

        workbook.add_worksheet(name: "Notes des élèves") do |sheet|
          sheet.add_row ["Date", "Nom de l'élève", "Note", "Commentaire"]
          marks.each do |mark|
            user = mark.exercise.user
            user_name = user ? "#{user.name} #{user.first_lastName} #{user.second_lastName}" : "Utilisateur non trouvé"
            sheet.add_row [mark.created_at, user_name, mark.mark, mark.comment]
          end
        end

        send_data package.to_stream.read,
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          disposition: 'attachment',
          filename: "notes_eleves.xlsx"
      rescue => e
        render json: { error: "Une erreur s'est produite lors de l'exportation : #{e.message}" }, status: :internal_server_error
      end
    else
      render json: { error: "L'ID de l'exercice est manquant" }, status: :bad_request
    end
  end

  private

    def set_mark
      @mark = Mark.find(params[:id])
    end

    def mark_params
      params.require(:mark).permit(:mark, :exercise_id, :comment)
    end

end
