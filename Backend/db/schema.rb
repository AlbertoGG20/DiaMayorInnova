# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_27_075852) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounting_plans", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "acronym"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "accounts", force: :cascade do |t|
    t.integer "accountNumber"
    t.string "description"
    t.string "name"
    t.bigint "accounting_plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["accounting_plan_id"], name: "index_accounts_on_accounting_plan_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "annotations", force: :cascade do |t|
    t.bigint "entry_id", null: false
    t.integer "number"
    t.integer "credit"
    t.integer "debit"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entry_id"], name: "index_annotations_on_entry_id"
  end

  create_table "class_groups", force: :cascade do |t|
    t.integer "course"
    t.string "module"
    t.string "modality"
    t.integer "number_students"
    t.integer "max_students"
    t.string "location"
    t.integer "weekly_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "entries", force: :cascade do |t|
    t.bigint "solution_id", null: false
    t.integer "entry_number"
    t.date "entry_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["solution_id"], name: "index_entries_on_solution_id"
  end

  create_table "help_examples", force: :cascade do |t|
    t.text "creditMoves"
    t.text "debitMoves"
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_help_examples_on_account_id"
  end

  create_table "school_centers", force: :cascade do |t|
    t.string "school_name"
    t.string "address"
    t.string "phone"
    t.string "email"
    t.string "website"
    t.string "province"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "solutions", force: :cascade do |t|
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "statement_id", null: false
    t.index ["statement_id"], name: "index_solutions_on_statement_id"
  end

  create_table "statements", force: :cascade do |t|
    t.text "definition"
    t.text "explanation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "task_statements", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.bigint "statement_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["statement_id"], name: "index_task_statements_on_statement_id"
    t.index ["task_id"], name: "index_task_statements_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.date "opening_date"
    t.datetime "closing_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authentication_token", limit: 30
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "accounts", "accounting_plans"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "annotations", "entries"
  add_foreign_key "entries", "solutions"
  add_foreign_key "task_statements", "statements"
  add_foreign_key "task_statements", "tasks"
end
