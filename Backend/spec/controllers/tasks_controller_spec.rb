require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  let(:admin_user) { create(:admin_user) }
  let(:teacher_user) { create(:teacher_user) }
  let(:student_user) { create(:student_user) }
  let(:task) { create(:task, created_by: teacher_user.id) }
  let(:statements) { create_list(:statement, 3) }
  let(:valid_attributes) do { title: "Tarea de ejemplo", opening_date: Date.today, closing_date: Date.today + 1.week, additional_information: "Información adicional", is_exam: false } end
  let(:invalid_attributes_title) do { title: "", opening_date: Date.today, closing_date: Date.today + 1.week, additional_information: "", is_exam: false } end
  let(:invalid_attributes_date) do { title: "", opening_date: Date.today, closing_date: Date.today - 1.week, additional_information: "", is_exam: false } end

  describe "GET #index" do
    context "cuando el usuario es un estudiante" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve un error de no autorizado" do
        get :index
        expect(response).to have_http_status(:unauthorized) 
      end
    end

    context "cuando el usuario es un administrador" do
      before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
        create_list(:task, 3, created_by: admin_user.id)
      end

      it "devuelve todas las tareas" do
        get :index
        expect(response).to have_http_status(:ok)
        # puts response.body
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(3)
      end
    end

    context "cuando el usuario es un profesor" do
      before do
        request.headers['AUTH-TOKEN'] = teacher_user.authentication_token
        @own_task = create(:task, created_by: teacher_user.id)
        @other_task = create(:task, created_by: admin_user.id)
      end
  
      it "devuelve solo las tareas creadas por el profesor" do
        get :index
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(1)
        expect(json_response.first["id"]).to eq(@own_task.id)
      end
    end
  
    context "cuando se filtra por título" do
      before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
        create(:task, title: "Matemáticas", created_by: admin_user.id)
        create(:task, title: "Lengua", created_by: admin_user.id)
      end
  
      it "devuelve solo las tareas que coinciden con el título" do
        get :index, params: { title: "Matemáticas" }
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(1)
        expect(json_response.first["title"]).to eq("Matemáticas")
      end
    end
  end

  describe "GET #show" do
  context "cuando el usuario es un administrador" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "devuelve la tarea solicitada" do
      get :show, params: { id: task.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["id"]).to eq(task.id)
    end
  end

  context "cuando el usuario no tiene acceso" do
    before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

    it "devuelve un error de no autorizado" do
      get :show, params: { id: task.id }
      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)["error"]).to eq("No autorizado")
    end
  end
  end

  describe "POST #create" do
    context "cuando el usuario es un estudiante" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve un error de no autorizado" do
        post :create, params: { task: valid_attributes }
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)["error"]).to eq("No autorizado")
      end
    end

    context "cuando el usuario es un profesor" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      context "con parámetros válidos" do
        it "crea una nueva tarea" do
          post :create, params: { task: valid_attributes }
          expect(response).to have_http_status(:created)
          # puts response.body
          expect(JSON.parse(response.body)["title"]).to eq("Tarea de ejemplo")
        end

        it "asocia enunciados a la tarea si se proporcionan statement_ids" do
          statements = create_list(:statement, 2, user: teacher_user)
          post :create, params: { task: valid_attributes, statement_ids: statements.map(&:id) }
          expect(response).to have_http_status(:created)
          expect(Task.last.statements.count).to eq(2)
        end
      end

      context "con parámetros inválidos" do
        it "devuelve un error si la fecha de apertura es posterior a la de cierre" do
          post :create, params: { task: invalid_attributes_date }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)["error"]).to eq("La fecha de apertura debe ser anterior a la fecha de cierre.")
        end

        it "devuelve un error si el título está vacío" do
          post :create, params: { task: invalid_attributes_title }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)["error"]).to include("Title can't be blank")
        end
      end
    end

    context "cuando el usuario es un administrador" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "crea una nueva tarea" do
        expect {
          post :create, params: { task: valid_attributes }
        }.to change(Task, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)["title"]).to eq("Tarea de ejemplo")
      end
    end
  end

  describe "PATCH #update" do
    context "cuando el usuario es un profesor y creó la tarea" do
      before do 
        request.headers['AUTH-TOKEN'] = teacher_user.authentication_token 
        task.statements << statements
      end

      it "actualiza la tarea correctamente" do
        patch :update, params: { id: task.id, task: { title: "Tarea actualizada" } }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["title"]).to eq("Tarea actualizada")
      end

      it "devuelve un error si la fecha de apertura es posterior a la de cierre" do
        patch :update, params: { id: task.id, task: invalid_attributes_date }
        # puts response.body
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Opening date debe ser anterior a la fecha de cierre")
      end

      it "actualiza enunciados correctamente" do
        new_statements = create_list(:statement, 2)
        patch :update, params: { id: task.id, task: valid_attributes, statement_ids: new_statements.map(&:id) }
        expect(response).to have_http_status(:ok)
        expect(task.reload.statements.count).to eq(2)
      end

      it "devuelve un error si se envían enunciados inexistentes" do
        patch :update, params: { id: task.id, task: valid_attributes, statement_ids: [9999] }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["error"]).to eq("Algunos enunciados no existen")
      end
    end

    context "cuando el usuario no es el creador ni admin" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve un error de no autorizado" do
        patch :update, params: { id: task.id, task: valid_attributes }
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)["error"]).to eq("No autorizado")
      end
    end
  end

  describe "DELETE #destroy" do
    context "cuando el usuario es un administrador" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "elimina la tarea" do
        task_to_delete = create(:task, created_by: admin_user.id)
        expect {
          delete :destroy, params: { id: task_to_delete.id }
        }.to change(Task, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end
    end

    context "cuando el usuario no tiene permiso" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "devuelve un error de no autorizado" do
        delete :destroy, params: { id: task.id }
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)["error"]).to eq("No autorizado")
      end
    end
  end

describe "DELETE #destroy_statement" do
  let(:task) { create(:task, created_by: teacher_user.id) }
  let(:statement) { create(:statement) }

  before do
    task.statements << statement
  end

  context "cuando el usuario es un administrador" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "elimina el enunciado de la tarea correctamente" do
      delete :destroy_statement, params: { task_id: task.id, statement_id: statement.id }
      expect(response).to have_http_status(:ok)
      puts response.body
      expect(JSON.parse(response.body)["message"]).to eq("Enunciado desvinculado de la tarea correctamente.")
      expect(task.reload.statements).not_to include(statement)
    end
  end

  context "cuando el usuario no tiene permiso" do
    before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

    it "devuelve un error de no autorizado" do
      delete :destroy_statement, params: { task_id: task.id, statement_id: statement.id }
      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)["error"]).to eq("No autorizado")
    end
  end
end 

end