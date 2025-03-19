# spec/controllers/statements_controller_spec.rb

require 'rails_helper'

RSpec.describe StatementsController, type: :controller do
  let(:admin_user) { create(:admin_user) }
  let(:teacher_user) { create(:teacher_user) }
  let(:student_user) { create(:student_user) }
  let(:other_teacher) { create(:teacher_user) }
  let(:statement) { create(:statement, user: teacher_user) }
  let(:public_statement) { create(:statement, is_public: true) }
  let(:private_statement) { create(:statement, is_public: false, user: other_teacher) }
  let(:solution) { create(:solution, statement: statement) }
  let(:entry) { create(:entry, solution: solution) }
  let(:annotation) { create(:annotation, entry: entry) }

describe "GET #index" do
# INDEX ADMIN
  context "cuando el usuario es admin" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "devuelve todos los enunciados" do
      get :index
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(Statement.count)
    end
  end

# INDEX TEACHER
  context "cuando el usuario es un profesor" do
    before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

    it "devuelve la lista enunciados públicos y propios" do
      get :index
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(Statement.where("is_public = ? OR user_id = ?", true, teacher_user.id).count)
    end

    it "devuelve solo los enunciados públicos" do
      get :index
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(Statement.where(is_public: true).count)
    end
  end

# INDEX STUDENT
  context "cuando el usuario es un estudiante" do
    before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

    it "devuelve status forbidden" do
      get :index
      expect(response).to have_http_status(:forbidden)
    end
  end
end

describe "GET #show" do
# GET ADMIN
  context "cuando el usuario es autorizado" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "devuelve el enunciado" do
      get :show, params: { id: statement.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(statement.id)
    end
  end

# GET TEACHER
  context "cuando el enunciado es público, y el usuario es profesor" do
    before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }
    
    it "devuelve el enunciado público" do
      get :show, params: { id: public_statement.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(public_statement.id)
    end
  end

  context "cuando el usuario es un profesor y no el propietario del enunciado" do
    it "devuelve status unauthorized" do
      get :show, params: { id: private_statement.id }
      expect(response).to have_http_status(:unauthorized)
    end
  end

# GET STUDENT
  context "cuando el usuario es un estudiante" do
    before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

    it "devuelve el status forbidden" do
      get :show, params: { id: statement.id }
      expect(response).to have_http_status(:forbidden)
    end
  end
end

describe "POST #create" do
# POST STUDENT
  context "cuando el usuario es un estudiante" do
    before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve el status forbidden" do
        post :create, params: { statement: { definition: "Test", explanation: "Test", is_public: true } }
        expect(response).to have_http_status(:forbidden)
      end
    end

# POST TEACHER
    context "cuando el usuario es profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "crea un nuevo enunciado" do
        expect {
          post :create, params: { statement: { definition: "Test", explanation: "Test", is_public: true } }
        }.to change(Statement, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      context "y los parámetros son inválidos" do
        it "devuelve el status unprocessable entity" do
          post :create, params: { statement: { definition: nil, explanation: "Test", is_public: true } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

describe "PUT #update" do
# PUT ADMIN
  context "cuando el usuario es autorizado" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "actualiza el enunciado" do
      put :update, params: { id: statement.id, statement: { definition: "Updated Definition" } }
      expect(response).to have_http_status(:ok)
      expect(statement.reload.definition).to eq("Updated Definition")
    end

    context "y el enunciado no existe" do
      it "devuelve el status not found" do
        put :update, params: { id: 0, statement: { definition: "Updated Definition" } }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

# PUT TEACHER
    context "cuando el usuario es profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }
    
      context "y los parámetros son válidos" do
        it "devuelve el status unprocessable entity" do
          put :update, params: { id: statement.id, statement: { definition: nil } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "al eliminar soluciones, asientos y apuntes" do
        it "elimina los atributos anidados marcados para su destrucción" do
          put :update, params: {
            id: statement.id,
            statement: {
              solutions_attributes: [
                {
                  id: solution.id,
                  _destroy: "1",
                  entries_attributes: [
                    {
                      id: entry.id,
                      _destroy: "1",
                      annotations_attributes: [
                        {
                          id: annotation.id,
                          _destroy: "1"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
  
          expect(response).to have_http_status(:ok)
          expect(Solution.exists?(solution.id)).to be_falsey
          expect(Entry.exists?(entry.id)).to be_falsey
          expect(Annotation.exists?(annotation.id)).to be_falsey
        end
      end
    end

# PUT STUDENT
    context "cuando el usuario no está autorizado" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve el status forbidden" do
        put :update, params: { id: statement.id, statement: { definition: "Updated Definition" } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end


describe "DELETE #destroy" do
# DELETE ADMIN
    context "cuando el usuario es un admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }
  
      context "y el enunciado no existe" do
        it "devuelve el status not found" do
          delete :destroy, params: { id: 0 }
          expect(response).to have_http_status(:not_found)
        end
      end
    end

# DELETE TEACHER
    context "cuando el usuario es profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "elimina el enunciado" do
        delete :destroy, params: { id: statement.id }
        expect(response).to have_http_status(:ok)
        expect(Statement.exists?(statement.id)).to be_falsey
      end
    end

# DELETE STUDENT
    context "cuando el usuario no es autorizado" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve el status forbidden" do
        delete :destroy, params: { id: statement.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

# METODO PERSONALIZADO GET_SOLUTION
  describe "GET #get_solutions" do

    context "cuando el usuario es un profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }
    
      context "y el enunciado no tiene soluciones" do
        it "devuelve un array vacío" do
          statement.solutions.destroy_all
          get :get_solutions, params: { id: statement.id }
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body).size).to eq(0)
        end
      end
      
      context "cuando el enunciado tiene soluciones" do
        it "devuelve las soluciones para el enunciado" do
          get :get_solutions, params: { id: statement.id }
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body).size).to eq(statement.solutions.count)
        end
      end
    end
  end

# MÉTODO PERSONALIZADO ADD_SOLUTION
  describe "POST #add_solution" do

  # ADD_SOLUTION TEACHER
    context "cuando el usuario es profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      context "y los parámetros son válidos" do
        it "añade una solución al enunciado" do
          expect {
            post :add_solution, params: { id: statement.id, solution: { description: "Test Solution" } }
          }.to change(Solution, :count).by(1)
          expect(response).to have_http_status(:created)
        end
      end

      context "y los parámetros son inválidos" do
        it "devuelve el status unprocessable entity" do
          post :add_solution, params: { id: statement.id, solution: { description: nil } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "y el enunciado no existe" do
        it "devuelve el status not found" do
          post :add_solution, params: { id: 0, solution: { description: "Test Solution" } }
          expect(response).to have_http_status(:not_found)
        end
      end

      context "y el número de cuenta no es válido" do
        it "devuelve el status unprocessable entity" do
          post :create, params: { statement: { definition: "Test", explanation: "Test", is_public: true, solutions_attributes: [{ description: "Test Solution", entries_attributes: [{ entry_number: 1, entry_date: Date.today, annotations_attributes: [{ number: 1, credit: 100, debit: 0, account_number: "invalid" }] }] }] } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "al actualizar soluciones y asientos con parámetros no válidos" do
        it "devuelve el status unprocessable entity" do
          put :update, params: { id: statement.id, statement: { solutions_attributes: [{ id: solution.id, description: nil }] } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "y el id de la cuenta no es válido" do
        it "devuelve el status unprocessable entity con errores" do
          invalid_account_number = "invalid_account_number"
          post :add_solution, params: {
            id: statement.id,
            solution: {
              description: "Test Solution",
              entries_attributes: [
                {
                  entry_number: 1,
                  entry_date: Date.today,
                  annotations_attributes: [
                    {
                      number: 1,
                      credit: 100,
                      debit: 0,
                      account_number: invalid_account_number
                    }
                  ]
                }
              ]
            }
          }
      
          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)).to have_key("base")
          expect(JSON.parse(response.body)["base"]).to include("Una o más anotaciones tienen errores y no se pueden guardar.")
        end
      end

      context "y la solución se guarda con anotaciones no válidas" do
        it "no crea la solución o asientos" do
          invalid_account_number = "invalid_account_number"
          expect {
            post :add_solution, params: {
              id: statement.id,
              solution: {
                description: "Test Solution",
                entries_attributes: [
                  {
                    entry_number: 1,
                    entry_date: Date.today,
                    annotations_attributes: [
                      {
                        number: 1,
                        credit: 100,
                        debit: 0,
                        account_number: invalid_account_number
                      }
                    ]
                  }
                ]
              }
            }
          }.to change { Solution.count }.by(0)
            .and change { Entry.count }.by(0)
            .and change { Annotation.count }.by(0)
      
          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)).to have_key("base")
          expect(JSON.parse(response.body)["base"]).to include("Una o más anotaciones tienen errores y no se pueden guardar.")
        end
      end

      context "y la solución se guarda sin asientos" do
        it "crea la solución sin asiento" do
          expect {
            post :add_solution, params: {
              id: statement.id,
              solution: {
                description: "Test Solution"
              }
            }
          }.to change { Solution.count }.by(1)
            .and change { Entry.count }.by(0)
            .and change { Annotation.count }.by(0)
      
          expect(response).to have_http_status(:created)
          expect(JSON.parse(response.body)).to have_key("id")
          expect(JSON.parse(response.body)["entries"]).to eq([])
        end
      end
    end
  end
end