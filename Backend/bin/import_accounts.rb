#!/usr/bin/env ruby
require File.expand_path('../config/environment', __dir__)
require 'csv'

# Import accounts from cuentas.csv
def import_accounts
  accounting_plan = AccountingPlan.first_or_create(name: "PGC para PYMES")

  file = File.expand_path('../CUENTAS CONTABLES - PGC PYMES.csv', __dir__)
  CSV.foreach(file, col_sep: ';') do |row|
    account_number = row[2].strip
    name = (row[3] || '<sin nombre>').strip
    description = row[4]&.strip
    charge = row[5]&.strip
    credit = row[6]&.strip

    Account.find_or_initialize_by(account_number: account_number).tap do |account|
      account.name = name
      account.description = description
      account.charge = charge
      account.credit = credit
      account.accounting_plan = accounting_plan
      account.save!
    end
    puts "account_number: #{account_number}"
  end

  puts "Imported #{Account.count} accounts"
end

def import_base_accounts
  # Assuming a default accounting plan or you might want to specify one
  accounting_plan = AccountingPlan.first_or_create(name: "PGC para PYMES")

  file = File.expand_path('../CUENTAS CONTABLES BASE - PGC PYMES.csv', __dir__)
  CSV.foreach(file, col_sep: ';') do |row|
    account_number = row[0].strip
    name = row[1].strip

    Account.find_or_create_by!(
      account_number: account_number,
      name: name,
      accounting_plan: accounting_plan
    )
  end

  puts "Imported #{Account.count} accounts"
end

# Run the import
import_base_accounts
import_accounts

