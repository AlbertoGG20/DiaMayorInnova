class HelpExamplesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    if params[:account_id].present?
      @helpExamples = HelpExample.where(account_id: params[:account_id])
    else
      @helpExamples = HelpExample.all
    end 
    render json: @helpExamples
  end

  def show
    @helpExample = HelpExample.find(params[:id])
    render json: @helpExample
  end

  def create
    @helpExample = HelpExample.create(
      creditMoves: params[:creditMoves],
      debitMoves: params[:debitMoves],
      account_id: params[:account_id],
      description: params[:description]
    )
    render json: @helpExample
  end

  # Strong params
  def help_example_params
    params.require(:help_example).permit(
      :creditMoves,
      :debitMoves,
      :account_id,
      :description
    )
  end

  def update
    @helpExample = HelpExample.find(params[:id])
    @helpExample.update(
      creditMoves: params[:creditMoves],
      debitMoves: params[:debitMoves],
      account_id: params[:account_id],
      description: params[:description]
    )
    render json: @helpExample
  end

  def destroy
    @helpExamples = HelpExample.all
    @helpExample = HelpExample.find(params[:id])
    @helpExample.destroy
    render json: @helpExamples
  end

  def find_by_account_id
    @helpExample = HelpExample.find_by(account_id: params[:account_id])
    if @helpExample
      render json: @helpExample.as_json(include: { solution: { include: { entries: { include: :annotations } } } })
    else
      render json: { error: "Cuenta no encontrada" }, status: :not_found
    end
  end
end