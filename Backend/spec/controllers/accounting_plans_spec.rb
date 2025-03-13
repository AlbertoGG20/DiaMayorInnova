require 'rails_helper'

describe AccountingPlansController do

    #Factories
    let(:admin_user) { create(:admin_user) } # Crear el usuario
    let(:accounting_plan) { create(:accounting_plan) } # Crear PGC

    #Autenticación
    before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
    end

    #Tests
    describe "GET /index" do
        context "cuando hay múltiples PGCs" do
          let!(:accounting_plans) { create_list(:accounting_plan, 3) }
      
          before { get :index }
      
          it "devuelve estado 200 OK" do
            expect(response).to have_http_status(:ok)
          end
      
          it "devuelve la cantidad correcta de PGCs" do
            expect(JSON.parse(response.body).size).to eq(3)
          end
        end
      
        context "cuando se filtra por nombre" do
          let!(:plan) { create(:accounting_plan, name: "Plan A") }
      
          before { get :index, params: { name: "Plan A" } }
      
          it { expect(response).to have_http_status(:ok) }
      
          it "devuelve solo los resultados filtrados" do
            body = JSON.parse(response.body)
            expect(body.size).to eq(1)
            expect(body.first["name"]).to eq("Plan A")
          end
        end
      end
      


    describe "GET show" do
        describe "devolver un PGC existente" do
            before do
                get :show, params: { id: accounting_plan.id }
            end

            it { expect(response).to have_http_status(:ok) }
        end
    end


    describe "POST create" do
        describe "crear nuevo  PGC" do
            before do
                newPGC = { accounting_plan: {name: "Nuevo PGC", description: "Desc nueva", acronym: "NP"} }
                post :create, params: newPGC
            end

            it { expect(response).to have_http_status(:created) }
        end

        describe "error 422, datos no válidos" do
            before do
                newPGC = { accounting_plan: { name: ""} }
                post :create, params: newPGC
            end

            it { expect(response).to have_http_status(:unprocessable_entity) }
        end
    end


    describe "PUT update" do
        describe "actualizar PGC existente" do
            before do
                newInfo = { id: accounting_plan.id, accounting_plan: { name: "Actualizadooo"} }
                put :update, params: newInfo
            end

            it { expect(response).to have_http_status(:success) }
        end

        describe "error 422, datos no válidos" do
            before do
                newInfo = { id: accounting_plan.id, accounting_plan: { name: ""} }
                put :update, params: newInfo
            end

            it { expect(response).to have_http_status(:unprocessable_entity) }   
        end          
    end


    describe "DELETE destroy" do
        describe "eliminar PGC" do
            before do
                accounting_plan # Crear PGC para el test
                delete :destroy, params: {id: accounting_plan.id}
            end

            it { expect(response).to have_http_status(:success) }
        end
    end

    describe "GET /export_csv" do
        before { get :export_csv, params: { id: accounting_plan.id } }
      
        it { expect(response).to have_http_status(:ok) }
      
        it "devuelve un archivo CSV" do
          expect(response.header["Content-Type"]).to include("text/csv")
        end
    end

    describe "POST /import_csv" do
        let(:csv_file) { fixture_file_upload(Rails.root.join("spec/fixtures/files/valid_accounting_plan.csv"), "text/csv") }

      
        context "cuando el archivo CSV es válido" do
          before { post :import_csv, params: { file: csv_file } }
      
          it { expect(response).to have_http_status(:ok) }
      
          it "crea registros en la base de datos" do
            expect(AccountingPlan.count).to be > 0
          end
        end
    end
      
      
end
