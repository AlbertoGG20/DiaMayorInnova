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
            temp_file = Tempfile.new([ "pgc_#{accounting_plan.acronym}", ".csv" ])

            CSV.open(temp_file.path, "w", col_sep: ";") do |csv|
                csv << [ "Nombre", "Acronimo", "Descripcion" ] # PGC headers
                csv << [ accounting_plan.name, accounting_plan.acronym, accounting_plan.description ]

                csv << [] # Space

                csv << [ "Numero cuenta", "Nombre", "Descripcion", "Cargo", "Abono" ]
                accounting_plan.accounts.each do |account|
                  csv << [ account.account_number, account.name, account.description, account.charge, account.credit ]
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
          csv_data = CSV.read(params[:file].path, col_sep: ";")

          pgc_index = csv_data.index { |row| row.compact.map(&:strip) == [ "Nombre", "Acronimo", "Descripcion" ] }
          accounts_index = csv_data.index { |row| row.compact.map(&:strip) == [ "Numero cuenta", "Nombre", "Descripcion", "Cargo", "Abono" ] }

          if pgc_index.nil? || accounts_index.nil?
            return render json: { error: "Formato de archivo inválido" }, status: :unprocessable_entity
          end

          pgc_row = csv_data[pgc_index + 1]
          if pgc_row.nil? || pgc_row.compact.empty?
            return render json: { error: "Datos del plan contable no encontrados" }, status: :unprocessable_entity
          end

          # Create PGC
          accounting_plan = AccountingPlan.create!(
            name: pgc_row[0].strip,
            acronym: pgc_row[1].strip,
            description: pgc_row[2].strip
          )

          # Create accounts
          accounts = []
          csv_data[(accounts_index + 1)..].each do |row|
            next if row.compact.empty?

            accounts << Account.create!(
              account_number: row[0]&.strip,
              name: row[1]&.strip,
              description: row[2]&.strip,
              charge: row[3]&.strip,
              credit: row[4]&.strip,
              accounting_plan_id: accounting_plan.id
            )
          end

          render json: { success: true, accounting_plan: accounting_plan, accounts: accounts }, status: :ok

        rescue => e
          Rails.logger.error "CSV import failed: #{e.message}"
          render json: { error: "Error al importar el CSV: #{e.message}" }, status: :unprocessable_entity
        end
      else
        render json: { error: "Archivo no proporcionado" }, status: :bad_request
      end
    end



    # xlsx files methods
    require 'caxlsx'
    require 'roo'

    def export_xlsx_by_pgc
      accounting_plan = AccountingPlan.find_by(id: params[:id])
      if accounting_plan
        p = Axlsx::Package.new
        wb = p.workbook

        wb.add_worksheet(name: "PGC - #{accounting_plan.acronym}") do |sheet|
          # PGC data
          sheet.add_row [ "Nombre", "Acronimo", "Descripcion" ]
          sheet.add_row [ accounting_plan.name, accounting_plan.acronym, accounting_plan.description ]

          sheet.add_row [] # space

          # Accounts data
          sheet.add_row [ "Numero cuenta", "Nombre", "Descripcion", "Cargo", "Abono" ]
          accounting_plan.accounts.each do |account|
            sheet.add_row [
              account.account_number,
              account.name,
              account.description,
              account.charge,
              account.credit
            ]
          end
        end

        send_data p.to_stream.read,
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  disposition: "attachment",
                  filename: "PGC_#{accounting_plan.acronym}.xlsx"
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
      xlsx = Roo::Spreadsheet.open(file.tempfile.path)

      begin
        sheet = xlsx.sheet(0)

        # Buscar fila del encabezado de PGC
        pgc_header_index = sheet.first_row
        while pgc_header_index <= sheet.last_row
          row = sheet.row(pgc_header_index).map(&:to_s).map(&:strip)
          normalized_row = row.map { |cell| cell.to_s.downcase.strip }
          if normalized_row.take(3) == [ 'nombre', 'acronimo', 'descripcion' ]
            break
          end
          pgc_header_index += 1
        end

        raise "Encabezado del PGC no encontrado" if pgc_header_index > sheet.last_row

        pgc_data_row = sheet.row(pgc_header_index + 1).map(&:to_s).map(&:strip)
        raise "Datos del PGC incompletos" if pgc_data_row.size < 3

        accounting_plan = AccountingPlan.create!(
          name: pgc_data_row[0],
          acronym: pgc_data_row[1],
          description: pgc_data_row[2]
        )

        # Buscar fila del encabezado de cuentas
        accounts_header_index = pgc_header_index + 3
        while accounts_header_index <= sheet.last_row
          row = sheet.row(accounts_header_index).map(&:to_s).map(&:strip)
          normalized_row = row.map(&:downcase)
          if normalized_row.take(5) == [ 'numero cuenta', 'nombre', 'descripcion', 'cargo', 'abono' ]
            break
          end
          accounts_header_index += 1
        end


        raise "Encabezado de cuentas no encontrado" if accounts_header_index > sheet.last_row

        # Leer cuentas
        (accounts_header_index + 1).upto(sheet.last_row) do |i|
          row = sheet.row(i).map(&:to_s)
          next if row.compact.empty? || row[0].strip == ""

          Account.create!(
            account_number: row[0]&.strip,
            name: row[1]&.strip,
            description: row[2]&.strip,
            charge: row[3]&.strip,
            credit: row[4]&.strip,
            accounting_plan_id: accounting_plan.id
          )
        end

        render json: { success: true, accounting_plan: accounting_plan }, status: :ok

      rescue => e
        Rails.logger.error "Error al importar XLSX: #{e.message}"
        render json: { error: "Error al importar el Excel: #{e.message}" }, status: :unprocessable_entity
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

    def download_template_xlsx
      p = Axlsx::Package.new
      wb = p.workbook

      sheet_name = "Plantilla PGC"[0, 31]
      wb.add_worksheet(name: sheet_name) do |sheet|
        # Encabezado del plan contable
        sheet.add_row [ "Nombre", "Acronimo", "Descripcion" ]
        # Fila de ejemplo vacía para el plan
        sheet.add_row [ "", "", "" ]

        sheet.add_row [] # Espacio

        # Encabezado de cuentas
        sheet.add_row [ "Numero cuenta", "Nombre", "Descripcion", "Cargo", "Abono" ]
        # Fila de ejemplo vacía para cuentas
        sheet.add_row [ "", "", "", "", "" ]
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
