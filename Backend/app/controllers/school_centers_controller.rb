class SchoolCentersController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    schools = SchoolCenter.all
    schools = schools.where("school_name LIKE ?", "%#{params[:school_name]}%")

    # Si no se especifican parámetros de paginación, devolver todos los centros
    if params[:page].blank? && params[:per_page].blank?
      render json: schools
    else
      paginated_schools = schools.page(params[:page]).per(params[:per_page] || 10)

      render json: {
        schools: paginated_schools,
        meta: {
          current_page: paginated_schools.current_page,
          total_pages: paginated_schools.total_pages,
          total_count: paginated_schools.total_count
        }
      }
    end
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