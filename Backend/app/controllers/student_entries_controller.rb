class StudentEntriesController < ApplicationController
  before_action :authenticate_user!
  before_action :convert_entry_date, only: [:create, :update]

  def index
    if params[:mark_id].present?
      @studentEntries = StudentEntry.where(mark_id: params[:mark_id])
    else
      @studentEntries = StudentEntry.all
    end
    render json: @studentEntries
  end

  def show
    @studentEntry = StudentEntry.find(params[:id])
    render json: @studentEntry
  end

  def create
    @student_entry = StudentEntry.new(student_entry_params)
    if @student_entry.save
      render json: @student_entry, status: :created
    else
      render json: @student_entry.errors, status: :unprocessable_entity
    end
  end

  def update
    @student_entry  = StudentEntry.find(params[:id])
    if @student_entry .update(student_entry_params)
      render json: @student_entry
    else
      render json: @student_entry.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @studentEntries = StudentEntry.all
    @studentEntry = StudentEntry.find(params[:id])
    @studentEntry.destroy
    render json: @studentEntries
  end

  def student_entry_params
    params.require(:student_entry).permit(
      :entry_number, :entry_date, :mark_id, :observations,
      student_annotations_attributes: [
        :id, :account_id, :account_number, :debit, :credit, :student_entry_id
      ]
    )
  end

  def convert_entry_date
    params[:student_entry][:entry_date] = params[:student_entry][:entry_date].to_date if params[:student_entry][:entry_date].present?
  end
end
