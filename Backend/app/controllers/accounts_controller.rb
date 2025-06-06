class AccountsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    accounts = Account.all

    if params[:name].present?
      name = params[:name].to_s.downcase
      accounts = accounts.where("LOWER(name) LIKE ?", "%#{name}%")
    end

    if params[:account_number].present?
      number = params[:account_number].to_s
      accounts = accounts.where("CAST(account_number AS TEXT) LIKE ?", "%#{number}%")
    end

    if params[:search].present?
      search = params[:search].to_s.downcase
      accounts = accounts.where(
        "LOWER(name) LIKE :q OR CAST(account_number AS TEXT) LIKE :q",
        q: "%#{search}%"
      )
    end

    paginated_accounts = accounts.page(params[:page]).per(params[:per_page] || 10)

    render json: {
      accounts: paginated_accounts.as_json(include: { accounting_plan: { only: [:id, :acronym] } }),
      meta: {
        current_page: paginated_accounts.current_page,
        total_pages: paginated_accounts.total_pages,
        total_count: paginated_accounts.total_count
      }
    }
  end

  def show
    @account = Account.find(params[:id])
    render json: @account
  end

  def create
    @account = Account.new(account_params)

    if @account.save
      render json: @account, status: :created
    else
      render json: { error: "Error en la creación" }, status: :unprocessable_entity
    end
  end

  def update
    @account = Account.find(params[:id])
    if @account.update(account_params)
      render json: @account
    else
      render json: { error: "Error actualizando la información" }, status: :unprocessable_entity
    end
  end

  def destroy
    @accounts = Account.all
    @account = Account.find(params[:id])
    @account.destroy
    render json: @accounts
  end

  def find_by_account_number
    @account = Account.find_by(account_number: params[:account_number])
    if @account
      render json: @account
    else
      render json: { error: "Cuenta no encontrada" }, status: :not_found
    end
  end

  private

  def account_params
    params.require(:account).permit(
      :account_number,
      :description,
      :name,
      :search,
      :accounting_plan_id,
      :charge,
      :credit
    )
  end
end
