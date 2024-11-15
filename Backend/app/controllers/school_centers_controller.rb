class SchoolCentersController < ApplicationController
  def index
    @schools = SchoolCenter.all
    render json: @schools
  end

  def show
    @school = SchoolCenter.find(params[:id])
    render @school
  end

  def create
    @school = SchoolCenter.create(
      school_name: params[:school_name],
      address: params[:address],
      phone: params[:phone],
      email: params[:email],
      website: params[:website],
      province: params[:province],
    )
  render json: @school
  end

  def update
    @school = SchoolCenter.find(params[:id])
    @school.update(
      school_name: params[:school_name],
      address: params[:address],
      phone: params[:phone],
      email: params[:email],
      website: params[:website],
      province: params[:province]
    )
    render json: @school
    end

  def destroy
    @schools = SchoolCenter.all
    @school = SchoolCenter.find(params[:id])
    @school.destroy
    render json: @schools
  end
end
