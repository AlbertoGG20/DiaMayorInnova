class AccountsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    accounts = Account.all
    accounts = accounts.where("name LIKE ?", "%#{params[:name]}%") if params[:name].present?
    
    paginated_accounts = accounts.page(params[:page]).per(params[:per_page] || 10)

    render json: {
      accounts: paginated_accounts,
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

   # Método de Strong Parameters
   def account_params
    params.require(:account).permit(
      :accountNumber, 
      :description, 
      :name, 
      :accounting_plan_id
    )
  end

  def update
    @account = Account.find(params[:id])
    if @account.update(account_params)
      render json: @account
    else
      render json: { error: "Error actualizando la información"}, status: :unprocessable_entity
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
    # Asegúrate de permitir los parámetros correctos
    params.require(:account).permit(:name, :account_number, :description, :accounting_plan_id)
  end
  
end