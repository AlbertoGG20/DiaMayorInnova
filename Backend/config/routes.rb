Rails.application.routes.draw do

  resources :accounting_plans do
    member do
      get 'export_csv'
      get 'accounts_by_PGC'
      get 'export_xlsx_by_pgc'
    end
    collection do
      post 'import_csv'
      post 'import_xlsx'
    end
  end
  
  resources :class_groups do
    member do
      get 'users' # AÑADIDO
      put 'update_users'
    end
  end
  
  resources :school_centers
  resources :accounts do
    get 'find_by_account_number', on: :collection
  end

  resources :help_examples do
    get 'find_by_account_id', on: :collection
  end
  
  
  resources :teacher_class_groups
  resources :annotations
  resources :entries
  resources :solutions
  resources :student_entries
  resources :student_annotations
  resources :marks do
    put 'update_multiple', on: :collection
  end

  resources :student_exercises, only: [:index, :show, :create, :update] do
    member do
      post 'start'
      put 'finish'
      put 'update_student_exercise'
      put 'update_student_task'
    end
    collection do
      get 'students_mark_list'
      get 'export_to_xlsx'  # Route pour l'exportation
      get 'find_mark_exercise_by_user'
    end
  end
  
  resources :exercises do
    delete 'destroy_on_group', on: :collection
    get 'find_by_task_id', on: :collection
    get 'find_by_exercise_id', on: :collection
  end

  resources :tasks, param: :id do
    delete 'statements/:statement_id', to: 'tasks#destroy_statement', as: 'destroy_statement_from_task'
    member do
      delete :destroy
    end
  end
  
  resources :statements, only: [:create, :index, :show, :update, :destroy] do
    post 'add_solution', on: :member
    get 'solutions', to: 'statements#get_solutions', on: :member
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  devise_for :users, controllers: { sessions: 'sessions' }, skip: [:registrations]
  devise_scope :user do
    post 'sign_in', to: 'sessions#create'
    delete 'log_out', to: 'sessions#destroy'
    post 'validate_token', to: 'sessions#valid_token'
    resources :registrations
  end

  resources :users, only: [:index, :show, :create, :update, :destroy] do
    collection do
      get 'current_user', to: 'users#current'
      get '/users/by_class/:id', to: 'users#by_class'
    end
  end
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root to: 'sessions#create'
end

