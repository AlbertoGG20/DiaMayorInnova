require 'caxlsx'
require 'roo'

class AccountingPlansController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  def index
    if params[:name].present?
        accountingPlans = AccountingPlan.where("LOWER(name) LIKE ?", "%#{params[:name].downcase}%")
    else
        accountingPlans = AccountingPlan.all.page(params[:page]).per(params[:per_page] || 10)
    end

    render json: {
        accountingPlans: accountingPlans,
        meta: {
            current_page: accountingPlans.try(:current_page) || 1,
            total_pages: accountingPlans.try(:total_pages) || 1,
            total_count: accountingPlans.size
        }
    }
end

def show
    @accountingPlan = AccountingPlan.find(params[:id])
    if @accountingPlan
        render json: @accountingPlan
    else
        render json: @accountingPlan.errors, status: :not_found
    end
end

  def create
    @accountingPlan = AccountingPlan.new(accounting_plan_params)

    if @accountingPlan.save
      render json: @accountingPlan, status: :created
    else
      render json: @accountingPlan.errors, status: :unprocessable_entity
    end
  end

  def update 
    @accountingPlan = AccountingPlan.find(params[:id])
    if @accountingPlan.update(accounting_plan_params)
      render json: @accountingPlan
    else
      render json: @accountingPlan.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @accountingPlans = AccountingPlan.all
    @accountingPlan = AccountingPlan.find(params[:id])
    @accountingPlan.destroy
    render json: @accountingPlans
  end

  # ✅ Affiche uniquement les comptes du PGC sélectionné
  def accounts_by_PGC
    accounting_plan = AccountingPlan.find_by(id: params[:id])
    
    if accounting_plan
      accounts = Account.where(accounting_plan_id: accounting_plan.id)
      render json: accounts, status: :ok
    else
      render json: { error: "Plan comptable non trouvé" }, status: :not_found
    end
  end

  # ✅ Export XLSX uniquement des comptes du PGC sélectionné
  def export_xlsx_by_pgc
    accounting_plan = AccountingPlan.find_by(id: params[:id])

    if accounting_plan
      accounts = Account.where(accounting_plan_id: accounting_plan.id)

      p = Axlsx::Package.new
      wb = p.workbook

      wb.add_worksheet(name: "Comptes du #{accounting_plan.name}") do |sheet|
        sheet.add_row ["Nom du compte", "Numéro", "Description"]
        accounts.each do |account|
          sheet.add_row [account.name, account.account_number, account.description]
        end
      end

      send_data p.to_stream.read,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                disposition: "attachment",
                filename: "comptes_#{accounting_plan.acronym}.xlsx"
    else
      render json: { error: "Plan comptable non trouvé" }, status: :not_found
    end
  end

  def import_xlsx
    if params[:file].blank?
        return render json: { error: "Aucun fichier fourni" }, status: :bad_request
    end

    file = params[:file]
    xlsx = Roo::Spreadsheet.open(file.path)
    

    ActiveRecord::Base.transaction do
        xlsx.sheet(0).each(name: 'Nom', acronym: 'Acronyme', description: 'Description') do |row|
            next if row[:name] == 'Nom' || row[:acronym] == 'Acronyme' # Ignore l'en-tête

            # Crée un nouveau plan comptable
            AccountingPlan.create!(
                name: row[:name],
                acronym: row[:acronym],
                description: row[:description]
            )
        end
    end

    render json: { message: "Importation réussie" }, status: :ok
rescue StandardError => e
    render json: { error: "Erreur lors de l'importation : #{e.message}" }, status: :unprocessable_entity
end

  private

  def accounting_plan_params
    params.require(:accounting_plan).permit(:name, :description, :acronym)
  end
    # CSV files methods
    require 'csv'

    def export_csv
        accounting_plan = AccountingPlan.find(params[:id])

        if accounting_plan.nil?
            render json: @accountingPlan.errors, status: :not_found
        end

        begin
            temp_file = Tempfile.new(["pgc_#{accounting_plan.acronym}", ".csv"])

            CSV.open(temp_file.path, "w", col_sep: ";") do |csv|
                csv << ["ID", "Nombre", "Acronimo", "Descripcion"] # PGC headers
                csv << [accounting_plan.id, accounting_plan.name, accounting_plan.acronym, accounting_plan.description]

                csv << [] # Space

                csv << ["Numero cuenta", "Nombre", "Descripcion"] # Accounts headers
                accounting_plan.accounts.each do |account|
                    csv << [account.account_number, account.name, account.description]
                end
            end

            # Avoid redirection
            response.headers["Content-Disposition"] = "attachment; filename=pgc_#{accounting_plan.acronym}.csv"
            response.headers["Content-Type"] = "text/csv; charset=utf-8"
            response.headers["Content-Transfer-Encoding"] = "binary"
            response.headers["Cache-Control"] = "no-cache"
            response.headers["Pragma"] = "no-cache"

            send_data File.read(temp_file.path), type: "text/csv; charset=utf-8", disposition: "attachment" # Download file from browser

        ensure # Always run, no matter what
            temp_file.close
            temp_file.unlink # Delete temp file
        end
    end


    def import_csv
        if params[:file].present?
            begin
                csv_data = CSV.read(params[:file].path).map(&:to_a)
                last_id = (AccountingPlan.maximum(:id) || 0).to_i # Get last ID

                pgc_index = csv_data.index { |row| row[0] == "Nombre" } # Find PGC
                accounts_index = csv_data.index { |row| row[0] == "NombreC" } # Find Accounts

                if pgc_index.nil? || accounts_index.nil?
                    return render json: @accountingPlan.errors, status: :unprocessable_entity
                end
            
                pgc_row = csv_data[pgc_index + 1]
                return render json: @accountingPlan.errors, status: :unprocessable_entity if pgc_row.nil?

                # Create PGC
                accounting_plan = AccountingPlan.create!(
                    id: last_id + 1, # Assign Id
                    name: pgc_row[0].strip,
                    acronym: pgc_row[1].strip,
                    description: pgc_row[2].strip
                )
        
                # Create Accounts
                accounts = []
                csv_data[(accounts_index + 1)..].each do |row| # Ignore accounts headers
                    next if row[1].nil? || row[1].strip.empty? # skip empty lines

                    account = Account.create!(
                        name: row[0].strip,
                        account_number: row[1].strip,
                        description: row[2].strip,
                        accounting_plan_id: accounting_plan.id
                    )

                    accounts << account
                end

                render json: { success: true, accounting_plan: accounting_plan, accounts: accounts }, status: :ok
      
            rescue => e
                render json: @accountingPlan.errors, status: :unprocessable_entity
            end
        else
            render json: @accountingPlan.errors, status: :bad_request
        end
      end  


    # Filter accounts by Accounting Plan
    def accounts_by_PGC
        accounting_plan = AccountingPlan.find_by(id: params[:id])
      
        if accounting_plan
          render json: accounting_plan.accounts, status: :ok
        else
          render json: { error: "PGC no encontrado" }, status: :not_found
        end
    end

    private

    def accounting_plan_params
        params.require(:accounting_plan).permit(:name, :description, :acronym)
    end

end
