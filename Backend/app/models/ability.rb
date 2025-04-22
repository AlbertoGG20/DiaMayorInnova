# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # Crea un usuario invitado si no está logueado.

    if user.admin?
      can :manage, :all
    elsif user.center_admin?
      if user.school_center.present?
        can :manage, User, school_center_id: user.school_center.id
        can :manage, ClassGroup, school_center_id: user.school_center.id
        can :read, SchoolCenter, id: user.school_center.id
      end
    elsif user.teacher?
      can :manage, Exercise
      can :find_by_task_id, Exercise
      can :destroy_on_group, Exercise
      can :manage, Account
      can :find_by_account_number, Account
      can :find_by_account_id, HelpExample
      can :manage, ClassGroup
      can :manage, AccountingPlan
      can :manage, SchoolCenter 
      can :manage, Task
      can :manage, Statement
      can :manage, Solution
      can :manage, Mark
      # Asume que los maestros también pueden gestionar anotaciones
      can :manage, StudentAnnotation
      can :manage_users, ClassGroup do |class_group|
        user.admin? || 
        (user.teacher? && class_group.teachers.include?(user)) ||
        (user.center_admin? && class_group.school_center == user.school_center)
      end
    elsif user.student?
      cannot :manage, SchoolCenter
      cannot :manage, ClassGroup
      cannot :manage, Task
      cannot :read, Task
      cannot :manage, Statement
      cannot :read, Statement
      cannot :manage, Solution
      cannot :manage, Entry
      cannot :manage, Annotation
      can :index, Account
      can :show, Account
      can :index, AccountingPlan
      can :show, AccountingPlan
      # Asume que los estudiantes pueden gestionar sus propias anotaciones
      can :manage, StudentAnnotation, user_id: user.id
      can :find_by_account_number, Account
      can :find_by_account_id, HelpExample
      can :index, Exercise
      can :show, Exercise
    else
      # Usuarios invitados no pueden hacer nada con los class_groups
      cannot :manage, :all
      cannot :manage, SchoolCenter
      cannot :manage, ClassGroup
      cannot :manage, AccountingPlan
    end

    can :manage, Task, created_by: user.id
  end
end

