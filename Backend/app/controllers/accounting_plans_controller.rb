class AccountingPlansController < ApplicationController
    before_action :authenticate_user!
    load_and_authorize_resource
    
    def index
        accountingPlans = AccountingPlan.all
      
        if params[:name].present?
          accountingPlans = accountingPlans.where("LOWER(name) LIKE ?", "%#{params[:name].downcase}%")
        end
      
        accountingPlans = accountingPlans.page(params[:page]).per(params[:per_page] || 10)
      
        render json: {
          accountingPlans: ActiveModelSerializers::SerializableResource.new(accountingPlans, each_serializer: AccountingPlanSerializer),
          meta: {
            current_page: accountingPlans.current_page,
            total_pages: accountingPlans.total_pages,
            total_count: accountingPlans.total_count
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


    # xlsx files methods
    require 'caxlsx'
    require 'roo'

    def export_xlsx_by_pgc
        accounting_plan = AccountingPlan.find_by(id: params[:id])
        if accounting_plan
          accounts = Account.where(accounting_plan_id: accounting_plan.id).order(:account_number)
          p = Axlsx::Package.new
          wb = p.workbook
    
          sheet_name = "Cuentas de #{accounting_plan.name}"[0, 31]
    
          wb.add_worksheet(name: sheet_name) do |sheet|

            sheet.add_row ['Nombre', 'Acronimo', 'Descripcion']

            sheet.add_row [
              accounting_plan.name,
              accounting_plan.acronym,
              accounting_plan.description
            ]

            sheet.add_row []

            sheet.add_row ['Numero cuenta', 'Nombre', 'Descripcion']

            accounts.each do |account|
              sheet.add_row [
                account.account_number,
                account.name,
                account.description
              ]
            end
          end
    
          send_data p.to_stream.read,
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    disposition: "attachment",
                    filename: "Cuentas_#{accounting_plan.acronym}.xlsx"
        else
          render json: { error: "PGC no encontrado" }, status: :not_found
        end
    end

    def import_xlsx
        authorize! :import_xlsx, AccountingPlan
        if params[:file].blank?
          return render json: { error: "No se proporcionó ningún archivo" }, status: :bad_request
        end
      
        file = params[:file]
        xlsx = Roo::Spreadsheet.open(file.path)
        sheet = xlsx.sheet(0)

        plan_headers = sheet.row(1).map(&:to_s).map(&:strip)
        plan_data = sheet.row(2)
      
        unless plan_headers[0..2] == ['Nombre', 'Acronimo', 'Descripcion']
          return render json: { error: "La primera fila debe tener los encabezados: Nombre, Acronimo, Descripcion" }, status: :unprocessable_entity
        end
      
        accounting_plan = AccountingPlan.create!(
          name: plan_data[0].to_s.strip,
          acronym: plan_data[1].to_s.strip,
          description: plan_data[2].to_s.strip
        )

        account_headers = sheet.row(3).map(&:to_s).map(&:strip)
        unless account_headers[0..2] == ['NombreC', 'NumeroC', 'DescripcionC']
          return render json: { error: "La tercera fila debe tener los encabezados: NombreC, NumeroC, DescripcionC" }, status: :unprocessable_entity
        end
      
        ((4)..sheet.last_row).each do |i|
          row = sheet.row(i)
          next if row[0].blank? && row[1].blank?
      
          Account.create!(
            name: row[0].to_s.strip,
            account_number: row[1].to_s.strip,
            description: row[2].to_s.strip,
            accounting_plan_id: accounting_plan.id
          )
        end
      
        render json: { success: true }, status: :ok
    rescue => e
        render json: { error: "Error al importar: #{e.message}" }, status: :unprocessable_entity
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

    def download_template_xlsx
      p = Axlsx::Package.new
      wb = p.workbook

      sheet_name = "Plantilla PGC"[0, 31]
      wb.add_worksheet(name: sheet_name) do |sheet|
        # Encabezado del plan
        sheet.add_row ['Nombre', 'Acronimo', 'Descripcion']
        # Fila de ejemplo vacía para el plan
        sheet.add_row ['', '', '']
        # Encabezado de cuentas (debe coincidir con el importador)
        sheet.add_row ['NombreC', 'NumeroC', 'DescripcionC']
        # Fila de ejemplo vacía para cuentas
        sheet.add_row ['', '', '']
      end

      send_data p.to_stream.read,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                disposition: "attachment",
                filename: "Plantilla_PGC.xlsx"
    end

    private

    def accounting_plan_params
        params.require(:accounting_plan).permit(:name, :description, :acronym)
    end
end