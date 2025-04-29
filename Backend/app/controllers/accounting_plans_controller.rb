require 'caxlsx'
require 'roo'
require 'csv'

class AccountingPlansController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource except: [:import_csv, :import_xlsx] # Skip for collection actions

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
    @accountingPlan = AccountingPlan.find(params[:id])
    @accountingPlan.destroy
    render json: AccountingPlan.all
  end

  def accounts_by_PGC
    accounting_plan = AccountingPlan.find_by(id: params[:id])
    if accounting_plan
      render json: accounting_plan.accounts, status: :ok
    else
      render json: { error: "PGC no encontrado" }, status: :not_found
    end
  end

  def export_xlsx_by_pgc
    accounting_plan = AccountingPlan.find_by(id: params[:id])
    if accounting_plan
      accounts = Account.where(accounting_plan_id: accounting_plan.id)
      p = Axlsx::Package.new
      wb = p.workbook

      wb.add_worksheet(name: "Cuentas de #{accounting_plan.name}") do |sheet|
        sheet.add_row ["Número de cuenta", "Nombre de cuenta", "Descripción"]
        accounts.each do |account|
          sheet.add_row [account.account_number, account.name, account.description]
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

  def export_csv
    accounting_plan = AccountingPlan.find(params[:id])
    if accounting_plan.nil?
      render json: { error: "PGC no encontrado" }, status: :not_found
    end

    begin
      temp_file = Tempfile.new(["pgc_#{accounting_plan.acronym}", ".csv"])
      CSV.open(temp_file.path, "w", col_sep: ";") do |csv|
        csv << ["ID", "Nombre", "Acronimo", "Descripcion"]
        csv << [accounting_plan.id, accounting_plan.name, accounting_plan.acronym, accounting_plan.description]
        csv << []
        csv << ["Numero cuenta", "Nombre", "Descripcion"]
        accounting_plan.accounts.each do |account|
          csv << [account.account_number, account.name, account.description]
        end
      end

      response.headers["Content-Disposition"] = "attachment; filename=pgc_#{accounting_plan.acronym}.csv"
      response.headers["Content-Type"] = "text/csv; charset=utf-8"
      response.headers["Content-Transfer-Encoding"] = "binary"
      response.headers["Cache-Control"] = "no-cache"
      response.headers["Pragma"] = "no-cache"

      send_data File.read(temp_file.path), type: "text/csv; charset=utf-8", disposition: "attachment"
    ensure
      temp_file.close
      temp_file.unlink
    end
  end

  def import_xlsx
    authorize! :import_xlsx, AccountingPlan # Manually authorize
    if params[:file].blank?
      return render json: { error: "No se proporcionó ningún archivo" }, status: :bad_request
    end

    file = params[:file]
    xlsx = Roo::Spreadsheet.open(file.path)

    ActiveRecord::Base.transaction do
      pgc_data = nil
      xlsx.sheet(0).each(name: 'Nombre', acronym: 'Acronimo', description: 'Descripcion') do |row|
        next if row[:name] == 'Nombre'
        pgc_data = {
          name: row[:name],
          acronym: row[:acronym],
          description: row[:description]
        }
        break
      end

      unless pgc_data
        raise "No se encontraron datos válidos para el PGC en la primera hoja"
      end

      accounting_plan = AccountingPlan.create!(pgc_data)

      if xlsx.sheets.length > 1
        xlsx.sheet(1).each(name: 'NombreC', account_number: 'NumeroC', description: 'DescripcionC') do |row|
          next if row[:name] == 'NombreC'
          Account.create!(
            name: row[:name],
            account_number: row[:account_number],
            description: row[:description],
            accounting_plan_id: accounting_plan.id
          )
        end
      end
    end

    render json: { message: "Importación exitosa" }, status: :ok
  rescue StandardError => e
    render json: { error: "Error durante la importación: #{e.message}" }, status: :unprocessable_entity
  end

  def import_csv
    authorize! :import_csv, AccountingPlan # Manually authorize
    if params[:file].present?
      begin
        csv_data = CSV.read(params[:file].path).map(&:to_a)
        last_id = (AccountingPlan.maximum(:id) || 0).to_i

        pgc_index = csv_data.index { |row| row[0] == "Nombre" }
        accounts_index = csv_data.index { |row| row[0] == "NombreC" }

        if pgc_index.nil? || accounts_index.nil?
          return render json: { error: "Formato de archivo inválido" }, status: :unprocessable_entity
        end

        pgc_row = csv_data[pgc_index + 1]
        return render json: { error: "Datos del PGC no encontrados" }, status: :unprocessable_entity if pgc_row.nil?

        accounting_plan = AccountingPlan.create!(
          id: last_id + 1,
          name: pgc_row[0].strip,
          acronym: pgc_row[1].strip,
          description: pgc_row[2].strip
        )

        accounts = []
        csv_data[(accounts_index + 1)..].each do |row|
          next if row[1].nil? || row[1].strip.empty?
          account = Account.create!(
            name: row[0].strip,
            account_number: row[1].strip,
            description: row[2].strip,
            accounting_plan_id: accounting_plan.id
          )
          accounts << account
        end

        render json: { success: true, accounting_plan: accounting_plan, accounts: accounts }, status: :ok
      rescue StandardError => e
        render json: { error: "Error durante la importación: #{e.message}" }, status: :unprocessable_entity
      end
    else
      render json: { error: "No se proporcionó ningún archivo" }, status: :bad_request
    end
  end

  private

  def accounting_plan_params
    params.require(:accounting_plan).permit(:name, :description, :acronym)
  end
end