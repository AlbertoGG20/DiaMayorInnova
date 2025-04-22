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

  private

    def set_mark
      @mark = Mark.find(params[:id])
    end

    def mark_params
      params.require(:mark).permit(:mark, :exercise_id, :comment)
    end

end
