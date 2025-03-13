class SchoolCentersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    if params[:school_name].present?
      @schools = SchoolCenter.where("school_name ILIKE ?", "%#{params[:school_name]}%")
    else
      @schools = SchoolCenter.all
    end
    render json: @schools
  end

  def show
    @school = SchoolCenter.find(params[:id])
    render json: @school, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Centro escolar no encontrado" }, status: :not_found
  end

  def create
    @school = SchoolCenter.new(school_center_params)

    if @school.save
      render json: @school, status: :created
    else
      render json: @school.errors, status: :unprocessable_entity
    end
  end

  def update
    @school = SchoolCenter.find(params[:id])
    if @school.update(school_center_params)
      render json: @school
    else
      render json: @school.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @schools = SchoolCenter.all
    @school = SchoolCenter.find(params[:id])
    @school.destroy
    render json: @schools
  end

  def school_center_params
    params.require(:school_center).permit(:school_name, :address, :phone, :email, :website, :province)
  end
end
