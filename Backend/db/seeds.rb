# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

school1 = SchoolCenter.find_or_create_by!(school_name: "IES El Rincón") do |s|
  s.address = "Calle de prueba 1"
  s.phone = "123456789"
  s.email = "elrincon@ies.elrincon.es"
  s.website = "www.ieselrincon.es"
  s.province = "Las Palmas"
end

school2 = SchoolCenter.find_or_create_by!(school_name: "IES Siete Palmas") do |s|
  s.address = "Calle de siete palmas 1"
  s.phone = "987654321"
  s.email = "sietePalmas@ies.elrincon.es"
  s.website = "www.sietePalmas.es"
  s.province = "Las Palmas"
end

class_group1 = ClassGroup.find_or_create_by!(course_module: "TUM", school_center_id: school1.id) do |c|
  c.course = 1
  c.modality = "Presencial"
  c.number_students = 0
  c.max_students = 30
  c.location = "Taller 12"
  c.weekly_hours = 6
end

class_group2 = ClassGroup.find_or_create_by!(course_module: "PNG", school_center_id: school2.id) do |c|
  c.course = 2
  c.modality = "Distancia"
  c.number_students = 0
  c.max_students = 20
  c.location = "Aula 106"
  c.weekly_hours = 6
end

accPlanPyme = AccountingPlan.find_or_create_by!(name: "PGC para PYMES") do |a|
  a.description = "El plan más utilizado por el alumnado"
  a.acronym = "PGC PYMES"
end

accPlan2 = AccountingPlan.find_or_create_by!(name: "PGC prueba1") do |a|
  a.description = "Plan para probar el Crud 1"
  a.acronym = "PGC prueba1"
end

accPlan3 = AccountingPlan.find_or_create_by!(name: "PGC prueba2") do |a|
  a.description = "Plan para probar el Crud 2"
  a.acronym = "PGC prueba2"
end

school_center = SchoolCenter.find_or_create_by!(school_name: "IES El Rincón")

  # Usuario Admin
  user = User.find_or_create_by!(email: 'admin@admin.es') do |u|
    u.name = "Admin"
    u.first_lastName = "Admin"
    u.second_lastName = "Admin"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'admin'
  end
puts "Usuario admin creado: #{user.email} con rol #{user.role}"

  # Usuarios con rol Teacher
  user2 = User.find_or_create_by!(email: 'tiburcio@ieselrincon.es') do |u|
    u.name = "Tiburcio"
    u.first_lastName = "Cruz"
    u.second_lastName = "Ravelo"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'teacher'
    u.school_center = school_center
  end
puts "Usuario #{user2.name} creado: #{user2.email} con rol #{user2.role}"

class_group = class_group1
user2.teacher_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user2.email} con rol #{user2.role} en el grupo #{class_group.id}"

  user3 = User.find_or_create_by!(email: 'miguel@ieselrincon.es') do |u|
    u.name = "Miguel Ángel"
    u.first_lastName = "Figueroa"
    u.second_lastName = "García"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'teacher'
    u.school_center = school_center
  end
puts "Usuario #{user3.name} creado: #{user3.email} con rol #{user3.role}"

class_group = class_group2
user3.teacher_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user3.email} con rol #{user3.role} en el grupo #{class_group.id}"

user7 = User.find_or_create_by!(email: 'nira@ieselrincon.es') do |u|
  u.name = "Nira"
  u.first_lastName = "Ruíz"
  u.second_lastName = "Díaz"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'teacher'
  u.school_center = school_center
end
puts "Usuario #{user7.name} creado: #{user7.email} con rol #{user7.role}"

class_group = class_group1
user7.teacher_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user7.email} con rol #{user7.role} en el grupo #{class_group.id}"

user8 = User.find_or_create_by!(email: 'mirian@ieselrincon.es') do |u|
  u.name = "Mirian de la Peña"
  u.first_lastName = "Cabrera"
  u.second_lastName = "Reyes"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'teacher'
  u.school_center = school_center
end
puts "Usuario #{user8.name} creado: #{user8.email} con rol #{user8.role}"

class_group = class_group2
user8.teacher_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user8.email} con rol #{user8.role} en el grupo #{class_group.id}"

 # Usuarios con rol Student
  user4 = User.find_or_create_by!(email: 'echedey@ieselrincon.es') do |u|
    u.name = "Echedey"
    u.first_lastName = "Henríquez"
    u.second_lastName = "Hernández"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.school_center = school_center
  end
puts "Usuario admin creado: #{user4.email} con rol #{user4.role}"

class_group = class_group2
user4.student_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user4.email} con rol #{user4.role} en el grupo #{class_group.id}"

  user5 = User.find_or_create_by!(email: 'mayer@ieselrincon.es') do |u|
    u.name = "Mayer Alberto"
    u.first_lastName = "Guerrero"
    u.second_lastName = "Gutierrez"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.school_center = school_center
  end
puts "Usuario admin creado: #{user5.email} con rol #{user5.role}"

class_group = class_group1
user5.student_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user5.email} con rol #{user5.role} en el grupo #{class_group.id}"

  user6 = User.find_or_create_by!(email: 'juancarlos@ieselrincon.es') do |u|
    u.name = "Juan Carlos"
    u.first_lastName = "Bolaños"
    u.second_lastName = "Ojeda"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.school_center = school_center
  end
puts "Usuario admin creado: #{user6.email} con rol #{user6.role}"

class_group = class_group2
user6.student_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user6.email} con rol #{user6.role} en el grupo #{class_group.id}"

user9 = User.find_or_create_by!(email: 'diago@ieselrincon.es') do |u|
  u.name = "Diago"
  u.first_lastName = "Tall"
  u.second_lastName = "Alioune"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'student'
  u.school_center = school_center
end
puts "Usuario admin creado: #{user9.email} con rol #{user9.role}"

class_group = class_group1
user9.student_class_groups.find_or_create_by!(class_group: class_group)

puts "Usuario creado: #{user9.email} con rol #{user9.role} en el grupo #{class_group.id}"

user10 = User.find_or_create_by!(email: 'ieselrincon@ieselrincon.es') do |u|
  u.name = "Administrador"
  u.first_lastName = "del Centro"
  u.second_lastName = "Ieselrincon"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'center_admin'
  u.school_center = school_center
end
puts "Usuario admin creado: #{user10.email} con rol #{user10.role}"

task1 = Task.find_or_create_by!(title: "Tarea 1 - Ficticia S.L.", created_by: user2.id) do |t|
  t.opening_date = DateTime.new(2024, 11, 27, 4, 0, 0)
  t.closing_date = DateTime.new(2024, 12, 1, 23, 59, 0)
end

task2 = Task.find_or_create_by!(title: "Tarea 2 - Inventada S.L.", created_by: user2.id) do |t|
  t.opening_date = DateTime.new(2024, 11, 12,05, 00, 0)
  t.closing_date = DateTime.new(2024, 12, 1, 23, 59, 0)
end

statement1 = Statement.find_or_create_by!(definition: "Compramos mercaderías a 30 días por 1250€. El proveedor nos incluye en factura un descuento comercial del 2%. Además, la compra tiene unos gastos de transporte de 100€", user: user2) do |s|
  s.explanation = "Explicación 1"
  s.is_public = false
end

statement2 = Statement.find_or_create_by!(definition: "Vendemos mercaderías por valor de 3000€. Para el cobro giramos una letra de cambio a 30 días, que es aceptada.", user: user2) do |s|
  s.explanation = "Explicación 2"
  s.is_public = false
end

statement3 = Statement.find_or_create_by!(definition: "Devolvemos mercaderías por valor de 200€  al proveedor, por estar inservibles.", user: user2) do |s|
  s.explanation = "Explicación 3"
  s.is_public = false
end

statement4 = Statement.find_or_create_by!(definition: "El proveedor nos hace un descuento del 20% en la mercancía que está un poco defectuosa. Se paga al proveedor mediante transferencia.", user: user2) do |s|
  s.explanation = "Explicación 4"
  s.is_public = false
end

statement5 = Statement.find_or_create_by!(definition: "Descontamos la letra de cambio en la entidad bancaria, la cual nos cobra una comisión de 30€ y unos intereses de 80€.", user: user2) do |s|
  s.explanation = "Explicación 5"
  s.is_public = false
end

statement6 = Statement.find_or_create_by!(definition: "Se devenga la nómina de uno de nuestros trabajadores. El importe íntegro es de 2000€. La cuota empresarial a la Seguridad Social asciende a 700€. La cuota de la SS del trabajador sería de 30€. La retención de IRPF sería de 350€. Pasada 1 semana se paga mediante trasferencia bancaria.", user: user2) do |s|
  s.explanation = "Explicación 6"
  s.is_public = true
end

task1.statements << statement1
task1.statements << statement2
task1.statements << statement3

task2.statements << statement4
task2.statements << statement5
task2.statements << statement6
task2.statements << statement2


  solution1 = Solution.find_or_create_by!(statement: statement1) do |s|
    s.description = 'Descripcion solución 1 de prueba'
  end
  solution2 = Solution.find_or_create_by!(statement: statement2) do |s|
    s.description = 'Descripcion solución 2 de prueba'
  end
  solution3 = Solution.find_or_create_by!(statement: statement3) do |s|
    s.description = 'Descripcion solución 3 de prueba'
  end
  solution4 = Solution.find_or_create_by!(statement: statement4) do |s|
    s.description = 'Descripcion solución 4 de prueba'
  end
  solution5 = Solution.find_or_create_by!(statement: statement5) do |s|
    s.description = 'Descripcion solución 5 de prueba'
  end
  solution6 = Solution.find_or_create_by!(statement: statement6) do |s|
    s.description = 'Descripcion solución 6 de prueba'
  end

  entry1= Entry.find_or_create_by!(solution:solution1, entry_number: 1, entry_date: Date.new(2024,11,25))
  entry2= Entry.find_or_create_by!(solution:solution2, entry_number: 2, entry_date: Date.new(2024,11,26))

  account1 = Account.find_or_create_by!(account_number: 1234, accounting_plan: accPlanPyme) do |a|
    a.description = "Cuenta de prueba número 1"
    a.name = "Cuenta 1"
  end

  account2 = Account.find_or_create_by!(account_number: 6543, accounting_plan: accPlan2) do |a|
    a.description = "Cuenta de prueba número 2"
    a.name = "Cuenta 2"
  end
  account3 = Account.find_or_create_by!(account_number: 2711, accounting_plan: accPlan3) do |a|
    a.description = "Cuenta de prueba número 3"
    a.name = "Cuenta 3"
  end
  account9999 = Account.find_or_create_by!(account_number: 9999, accounting_plan: accPlan3) do |a|
    a.id = 9999
    a.description = "Cuenta Dummy"
    a.name = "Cuenta dummy"
  end

  annotation1 = Annotation.find_or_create_by!(entry: entry1, account: account1, number: 1) do |a|
    a.debit = 0 
    a.credit = 100
  end
  annotation2 = Annotation.find_or_create_by!(entry: entry1, account: account2, number: 2) do |a|
    a.debit = 100
    a.credit = 0
  end
  annotation3 = Annotation.find_or_create_by!(entry: entry2, account: account3, number: 1) do |a|
    a.debit = 0
    a.credit = 300
  end
  annotation4 = Annotation.find_or_create_by!(entry: entry2, account: account2, number: 2) do |a|
    a.debit = 300
    a.credit = 0
  end

  helpExample1 = HelpExample.find_or_create_by!(account: account1, description: "Descripcion ejemplo 1") do |h|
    h.creditMoves = "1 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
    h.debitMoves = "1 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
  end
  helpExample2 = HelpExample.find_or_create_by!(account: account2, description: "Descripcion ejemplo 2") do |h|
    h.creditMoves = "2 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
    h.debitMoves = "2 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
  end
  helpExample3 = HelpExample.find_or_create_by!(account: account3, description: "Descripcion ejemplo 3") do |h|
    h.creditMoves = "3 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
    h.debitMoves = "3 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas"
  end

  exercise1 = Exercise.find_or_create_by!(user: user4, task: task1) 
  exercise2 = Exercise.find_or_create_by!(user: user6, task: task1) 
  exercise3 = Exercise.find_or_create_by!(user: user5, task: task2) 
  
  mark1 = Mark.find_or_create_by!(mark: 5.5, exercise: exercise1) 
  mark2 = Mark.find_or_create_by!(mark: 9, exercise: exercise2) 
  mark3 = Mark.find_or_create_by!(mark: 7.5, exercise: exercise3)

  student_entry1 = StudentEntry.find_or_create_by!(entry_number: 1, entry_date: Date.new(2024, 11, 25), mark: mark1) 
  student_entry2 = StudentEntry.find_or_create_by!(entry_number: 2, entry_date: Date.new(2024, 11, 25), mark: mark2) 
  student_entry3 = StudentEntry.find_or_create_by!(entry_number: 3, entry_date: Date.new(2024, 11, 25), mark: mark3) 
  student_entry3 = StudentEntry.find_or_create_by!(entry_number: 2, entry_date: Date.new(2022, 10, 25), mark: mark1) 

  student_annotation1 = StudentAnnotation.find_or_create_by!(number: 1, account_number: 1234, credit: 100, debit: 0, student_entry: student_entry1, account: account1) 
  student_annotation2 = StudentAnnotation.find_or_create_by!(number: 2, account_number: 1334, credit: 0, debit: 1000, student_entry: student_entry2, account: account2) 
  student_annotation3 = StudentAnnotation.find_or_create_by!(number: 3, account_number: 2234, credit: 100, debit: 0, student_entry: student_entry3, account: account3)
  
  teacher_class_group1 = TeacherClassGroup.find_or_create_by!(user: user2, class_group: class_group1)
  teacher_class_group3 = TeacherClassGroup.find_or_create_by!(user: user3, class_group: class_group1)
  teacher_class_group2 = TeacherClassGroup.find_or_create_by!(user: user2, class_group: class_group2)
  teacher_class_group4 = TeacherClassGroup.find_or_create_by!(user: user3, class_group: class_group2)

  taskExample1 = Task.find_or_create_by!(title: "Contabiliza en el libro diario las operaciones que la empresa GAMONAL SL realiza durante el año 20X4", created_by: user2.id) do |t| 
    t.opening_date = DateTime.new(2024, 10, 8,05, 00, 0)
    t.closing_date = DateTime.new(2024, 12, 1, 23, 59, 0)
  end

  statementExample1 = Statement.find_or_create_by!(definition: "01/08 Hace un pedido a un proveedor de 200 unidades del producto ROJO a 15 € la unidad. El proveedor nos solicita un anticipo por lo que le transferimos por banco 1.284 €.", explanation: "", user: user2, is_public: false)
  statementExample2 = Statement.find_or_create_by!(definition: "03/08 Llega el pedido anterior junto con la factura en la que se incluye un descuento comercial de 2%,además de 200 envases SIN facultad de devolución a 0,25 € la unidad. En las condiciones comerciales se indica que el pago se realizará a final de mes.", explanation: "Aplica el anticipo", user: user2, is_public: false)
  statementExample3 = Statement.find_or_create_by!(definition: "07/08 Tras revisar la compra anterior se observa que 25 unidades están inservibles por lo que se las devuelve al proveedor junto con los envases correspondientes.", explanation: "", user: user2, is_public: false)
  statementExample4 = Statement.find_or_create_by!(definition: "16/08 Acuerda con el proveedor no esperar a final de mes y procede al pago de la deuda pendiente por lo que le concede un descuento de 150 € y le transfiere por banco el resto.", explanation: "", user: user2, is_public: false)
  statementExample5 = Statement.find_or_create_by!(definition: "19/08 D. Luis Mendoza, abogado que se ha dado de alta en el año 20X3, le remite una factura por los servicios prestados por importe de 450 € + IGIC que le abona mediante transferencia bancaria.", explanation: "", user: user2, is_public: false)
  statementExample6 = Statement.find_or_create_by!(definition: "21/08 Uno de los empleados solicita un anticipo de la nómina de 600 € que se le paga en efectivo.", explanation: "", user: user2, is_public: false)
  statementExample7 = Statement.find_or_create_by!(definition: "31/08 El desglose de la nómina del mes de agosto es el siguiente: Sueldos y salarios: 7.500 €, seguridad social a cargo empresa: 1.875 €, seguridad social de los trabajadores 375 €; retenciones: 975 €. La nómina se paga los días 5 de cada mes.", explanation: "", user: user2, is_public: false)
  statementExample8 = Statement.find_or_create_by!(definition: "El 1/09 firma un contrato de leasing de dos años de duración para la adquisición de un vehículo. La empresa no tiene dudas de que va a ejercer la opción de compra. El pago de las cuotas es prepagable y periodicidad cuatrimestral. El tipo de interés de la operación es del 3% cuatrimestral. El valor actual del bien 32.503,15 € coincide con su valor razonable. El cuadro del leasing es el siguiente:", explanation: "", user: user2, is_public: false)
  statementExample9 = Statement.find_or_create_by!(definition: "01/09 y el pago de la primera cuota del leasing.", explanation: "", user: user2, is_public: false)
  statementExample10 = Statement.find_or_create_by!(definition: "05/09 Paga por transferencia bancaria la nómina de los trabajadores correspondiente al mes de agosto.", explanation: "", user: user2, is_public: false)
  statementExample11 = Statement.find_or_create_by!(definition: "16/09 Vende mercaderías por importe de 7.900 €. En la factura se incluyen envases con facultad de devolución por importe de 100 €. Operación a crédito de 45 días.", explanation: "", user: user2, is_public: false)
  statementExample12 = Statement.find_or_create_by!(definition: "21/09 Vende en 18.000 € + IGIC una furgoneta que adquirió el 1 de julio del año 20X3 por importe de 26.000 € y un valor residual de 1.000 €. La venía amortizando aplicando el coeficiente lineal máximo que para el 20X3 y 20X4 es del 16%. Cobra la mitad al contado y la otra mitad mediante un efecto aceptado.", explanation: "Contabiliza la amortización del 20X3 y la del 20X4 antes de la venta y la venta.", user: user2, is_public: false)
  statementExample13 = Statement.find_or_create_by!(definition: "25/09 Llega la factura del suministro eléctrico del mes en curso por importe de 120 € + IGIC. El recibo está domiciliado en el banco y se paga a principios de mes.", explanation: "", user: user2, is_public: false)
  statementExample14 = Statement.find_or_create_by!(definition: "28/09 La nómina del mes de septiembre es igual a la de agosto. Paga a los empleados el mismo día por transferencia bancaria.", explanation: "", user: user2, is_public: false)
  statementExample15 = Statement.find_or_create_by!(definition: "29/09 Paga por banco la seguridad social del mes de agosto.", explanation: "", user: user2, is_public: false)
  statementExample16 = Statement.find_or_create_by!(definition: "30/09 Contabiliza la liquidación del IGIC correspondiente al tercer trimestre del año en curso.", explanation: "", user: user2, is_public: false)

  taskExample1.statements << statementExample1
  taskExample1.statements << statementExample2
  taskExample1.statements << statementExample3
  taskExample1.statements << statementExample4
  taskExample1.statements << statementExample5
  taskExample1.statements << statementExample6
  taskExample1.statements << statementExample7
  taskExample1.statements << statementExample8
  taskExample1.statements << statementExample9
  taskExample1.statements << statementExample10
  taskExample1.statements << statementExample11
  taskExample1.statements << statementExample12
  taskExample1.statements << statementExample13
  taskExample1.statements << statementExample14
  taskExample1.statements << statementExample15
  taskExample1.statements << statementExample16

  solutionExample1= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample1)
  solutionExample2= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample2)
  solutionExample3= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample3)
  solutionExample4= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample4)
  solutionExample5= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample5)
  solutionExample6= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample6)
  solutionExample7= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample7)
  solutionExample8= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample8)
  solutionExample9= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample9)
  solutionExample10= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample10)
  solutionExample11= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample11)
  solutionExample12= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample12)
  solutionExample13= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample13)
  solutionExample14= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample14)
  solutionExample15= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample15)
  solutionExample16= Solution.find_or_create_by!(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample16)


  entryExample1= Entry.find_or_create_by!(solution:solutionExample1, entry_number: 1, entry_date: Date.new(2024,8,1)) # año/mes/dia
  entryExample2= Entry.find_or_create_by!(solution:solutionExample2, entry_number: 2, entry_date: Date.new(2024,8,3)) 
  entryExample3= Entry.find_or_create_by!(solution:solutionExample3, entry_number: 3, entry_date: Date.new(2024,8,7)) 
  entryExample4= Entry.find_or_create_by!(solution:solutionExample4, entry_number: 4, entry_date: Date.new(2024,8,16))
  entryExample5= Entry.find_or_create_by!(solution:solutionExample5, entry_number: 5, entry_date: Date.new(2024,8,19))
  entryExample6= Entry.find_or_create_by!(solution:solutionExample6, entry_number: 6, entry_date: Date.new(2024,8,21))
  entryExample7= Entry.find_or_create_by!(solution:solutionExample7, entry_number: 7, entry_date: Date.new(2024,8,31))
  entryExample8= Entry.find_or_create_by!(solution:solutionExample8, entry_number: 8, entry_date: Date.new(2024,9,1))
  entryExample9= Entry.find_or_create_by!(solution:solutionExample9, entry_number: 9, entry_date: Date.new(2024,9,1))
  entryExample10= Entry.find_or_create_by!(solution:solutionExample10, entry_number: 10, entry_date: Date.new(2024,9,5))
  entryExample11= Entry.find_or_create_by!(solution:solutionExample11, entry_number: 11, entry_date: Date.new(2024,9,16))
  entryExample12= Entry.find_or_create_by!(solution:solutionExample12, entry_number: 12, entry_date: Date.new(2024,9,21))
  entryExample13= Entry.find_or_create_by!(solution:solutionExample13, entry_number: 13, entry_date: Date.new(2024,9,25))
  entryExample14= Entry.find_or_create_by!(solution:solutionExample14, entry_number: 14, entry_date: Date.new(2024,9,28))
  entryExample15= Entry.find_or_create_by!(solution:solutionExample15, entry_number: 15, entry_date: Date.new(2024,9,29))
  entryExample16= Entry.find_or_create_by!(solution:solutionExample16, entry_number: 16, entry_date: Date.new(2024,9,30))

  # Creación de cuentas / Si está en la base de datos, no se crea
  Account.find_or_create_by!(account_number: 174) do |account|
    account.description = "Acreedores por arrendamiento financiero a largo plazo"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por arrendamiento financiero a largo plazo"
  end
  
  Account.find_or_create_by!(account_number: 218) do |account|
    account.description = "Elementos de transporte"
    account.accounting_plan = accPlanPyme
    account.name = "Elementos de transporte"
  end
  
  Account.find_or_create_by!(account_number: 281) do |account|
    account.description = "Amortización acumulada del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Amortización acumulada del inmovilizado material"
  end
  
  Account.find_or_create_by!(account_number: 400) do |account|
    account.description = "Proveedores"
    account.accounting_plan = accPlanPyme
    account.name = "Proveedores"
  end
  
  Account.find_or_create_by!(account_number: 407) do |account|
    account.description = "Anticipo a proveedores"
    account.accounting_plan = accPlanPyme
    account.name = "Anticipo a proveedores"
  end
  
  Account.find_or_create_by!(account_number: 410) do |account|
    account.description = "Acreedores por prestaciones de servicios"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por prestaciones de servicios"
  end
  
  Account.find_or_create_by!(account_number: 430) do |account|
    account.description = "Clientes"
    account.accounting_plan = accPlanPyme
    account.name = "Clientes"
  end
  
  Account.find_or_create_by!(account_number: 437) do |account|
    account.description = "Envases y embalajes a devolver por clientes"
    account.accounting_plan = accPlanPyme
    account.name = "Envases y embalajes a devolver por clientes"
  end
  
  Account.find_or_create_by!(account_number: 441) do |account|
    account.description = "Deudores, efectos comerciales a cobrar"
    account.accounting_plan = accPlanPyme
    account.name = "Deudores, efectos comerciales a cobrar"
  end
  
  Account.find_or_create_by!(account_number: 460) do |account|
    account.description = "Anticipo de remuneraciones"
    account.accounting_plan = accPlanPyme
    account.name = "Anticipo de remuneraciones"
  end
  
  Account.find_or_create_by!(account_number: 465) do |account|
    account.description = "Remuneraciones pendientes de pago"
    account.accounting_plan = accPlanPyme
    account.name = "Remuneraciones pendientes de pago"
  end
  
  Account.find_or_create_by!(account_number: 476) do |account|
    account.description = "Organismos de la Seguridad Social, acreedores"
    account.accounting_plan = accPlanPyme
    account.name = "Organismos de la Seguridad Social, acreedores"
  end
  
  Account.find_or_create_by!(account_number: 524) do |account|
    account.description = "Acreedores por arrendamiento financiero a corto plazo"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por arrendamiento financiero a corto plazo"
  end
  
  Account.find_or_create_by!(account_number: 570) do |account|
    account.description = "Caja, euros"
    account.accounting_plan = accPlanPyme
    account.name = "Caja, euros"
  end
  
  Account.find_or_create_by!(account_number: 572) do |account|
    account.description = "Banco e instituciones de crédito c/c vista, euros"
    account.accounting_plan = accPlanPyme
    account.name = "Banco e instituciones de crédito c/c vista, euros"
  end
  
  Account.find_or_create_by!(account_number: 600) do |account|
    account.description = "Compras"
    account.accounting_plan = accPlanPyme
    account.name = "Compras de mercaderías"
  end
  
  Account.find_or_create_by!(account_number: 602) do |account|
    account.description = "Compras de otros aprovisionamientos"
    account.accounting_plan = accPlanPyme
    account.name = "Compras de otros aprovisionamientos"
  end
  
  Account.find_or_create_by!(account_number: 606) do |account|
    account.description = "Descuentos sobre compras por pronto pago"
    account.accounting_plan = accPlanPyme
    account.name = "Descuentos sobre compras por pronto pago"
  end
  
  Account.find_or_create_by!(account_number: 608) do |account|
    account.description = "Devoluciones de compras y operaciones similares"
    account.accounting_plan = accPlanPyme
    account.name = "Devoluciones de compras y operaciones similares"
  end
  
  Account.find_or_create_by!(account_number: 623) do |account|
    account.description = "Servicios de profesionales independientes"
    account.accounting_plan = accPlanPyme
    account.name = "Servicios de profesionales independientes"
  end
  
  Account.find_or_create_by!(account_number: 628) do |account|
    account.description = "Suministros"
    account.accounting_plan = accPlanPyme
    account.name = "Suministros"
  end
  
  Account.find_or_create_by!(account_number: 640) do |account|
    account.description = "Sueldos y salarios"
    account.accounting_plan = accPlanPyme
    account.name = "Sueldos y salarios"
  end
  
  Account.find_or_create_by!(account_number: 642) do |account|
    account.description = "Seguridad Social a cargo de la empresa"
    account.accounting_plan = accPlanPyme
    account.name = "Seguridad Social a cargo de la empresa"
  end
  
  Account.find_or_create_by!(account_number: 662) do |account|
    account.description = "Intereses de deudas"
    account.accounting_plan = accPlanPyme
    account.name = "Intereses de deudas"
  end
  
  Account.find_or_create_by!(account_number: 671) do |account|
    account.description = "Pérdidas procedentes del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Pérdidas procedentes del inmovilizado material"
  end
  
  Account.find_or_create_by!(account_number: 681) do |account|
    account.description = "Amortización del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Amortización del inmovilizado material"
  end
  
  Account.find_or_create_by!(account_number: 700) do |account|
    account.description = "Ventas de mercaderías"
    account.accounting_plan = accPlanPyme
    account.name = "Ventas de mercaderías"
  end
  
  Account.find_or_create_by!(account_number: 4751) do |account|
    account.description = "Hacienda Pública, acreedora por retenciones practicadas"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, acreedora por retenciones practicadas"
  end
  
  Account.find_or_create_by!(account_number: 4727) do |account|
    account.description = "Hacienda Pública, IGIC soportado"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, IGIC soportado"
  end
  
  Account.find_or_create_by!(account_number: 4757) do |account|
    account.description = "Hacienda Pública, acreedora por IGIC"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, acreedora por IGIC"
  end
  
  Account.find_or_create_by!(account_number: 4777) do |account|
    account.description = "Hacienda Pública IGIC repercutido"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública IGIC repercutido"
  end
  
  account174 = Account.find_by(account_number: 174)
  account218 = Account.find_by(account_number: 218)
  account281 = Account.find_by(account_number: 281)
  account400 = Account.find_by(account_number: 400)
  account407 = Account.find_by(account_number: 407)
  account410 = Account.find_by(account_number: 410)
  account430 = Account.find_by(account_number: 430)
  account437 = Account.find_by(account_number: 437)
  account441 = Account.find_by(account_number: 441)
  account460 = Account.find_by(account_number: 460)
  account465 = Account.find_by(account_number: 465)
  account476 = Account.find_by(account_number: 476)
  account524 = Account.find_by(account_number: 524)
  account570 = Account.find_by(account_number: 570)
  account572 = Account.find_by(account_number: 572)
  account600 = Account.find_by(account_number: 600)
  account602 = Account.find_by(account_number: 602)
  account606 = Account.find_by(account_number: 606)
  account608 = Account.find_by(account_number: 608)
  account623 = Account.find_by(account_number: 623)
  account628 = Account.find_by(account_number: 628)
  account640 = Account.find_by(account_number: 640)
  account642 = Account.find_by(account_number: 642)
  account662 = Account.find_by(account_number: 662)
  account671 = Account.find_by(account_number: 671)
  account681 = Account.find_by(account_number: 681)
  account700 = Account.find_by(account_number: 700)
  account4751 = Account.find_by(account_number: 4751)
  account4727 = Account.find_by(account_number: 4727)
  account4757 = Account.find_by(account_number: 4757)
  account4777 = Account.find_by(account_number: 4777)

  annotationExample1 = Annotation.find_or_create_by!(entry: entryExample1, account: account407, number: 1, debit: 1200.00 , credit: "")
  annotationExample2 = Annotation.find_or_create_by!(entry: entryExample1, account: account4727, number: 2, debit: 84.00 , credit: "")
  annotationExample3 = Annotation.find_or_create_by!(entry: entryExample1, account: account572, number: 3, debit: "" , credit: 1284.00)

  annotationExample4 = Annotation.find_or_create_by!(entry: entryExample2, account: account600, number: 1, debit: 2940.00 , credit: "")
  annotationExample5 = Annotation.find_or_create_by!(entry: entryExample2, account: account602, number: 2, debit: 50.00 , credit: "")
  annotationExample6 = Annotation.find_or_create_by!(entry: entryExample2, account: account4727, number: 3, debit: 125.30 , credit: "")
  annotationExample7 = Annotation.find_or_create_by!(entry: entryExample2, account: account407, number: 4, debit: "" , credit: 1200.00)
  annotationExample8 = Annotation.find_or_create_by!(entry: entryExample2, account: account400, number: 5, debit: "" , credit: 1915.30)

  annotationExample9 = Annotation.find_or_create_by!(entry: entryExample3, account: account400, number: 1, debit: 419.71 , credit: "")
  annotationExample10 = Annotation.find_or_create_by!(entry: entryExample3, account: account608, number: 2, debit: "" , credit: 392.25)
  annotationExample11 = Annotation.find_or_create_by!(entry: entryExample3, account: account4727, number: 3, debit: "" , credit: 27.46)

  annotationExample12 = Annotation.find_or_create_by!(entry: entryExample4, account: account400, number: 1, debit: 1495.59 , credit: "")
  annotationExample13 = Annotation.find_or_create_by!(entry: entryExample4, account: account606, number: 2, debit: "" , credit: 150.00)
  annotationExample14 = Annotation.find_or_create_by!(entry: entryExample4, account: account4727, number: 3, debit: "" , credit: 10.50)
  annotationExample15 = Annotation.find_or_create_by!(entry: entryExample4, account: account572, number: 4, debit: "" , credit: 1335.09)

  annotationExample16 = Annotation.find_or_create_by!(entry: entryExample5, account: account623, number: 1, debit: 450.00 , credit: "")
  annotationExample17 = Annotation.find_or_create_by!(entry: entryExample5, account: account4727, number: 2, debit: 31.50 , credit: "")
  annotationExample18 = Annotation.find_or_create_by!(entry: entryExample5, account: account4751, number: 3, debit: "" , credit: 31.50)
  annotationExample19 = Annotation.find_or_create_by!(entry: entryExample5, account: account410, number: 4, debit: "" , credit: 450.00)
  annotationExample20 = Annotation.find_or_create_by!(entry: entryExample5, account: account410, number: 5, debit: 450.00 , credit: "")
  annotationExample21 = Annotation.find_or_create_by!(entry: entryExample5, account: account572, number: 6, debit: "" , credit: 450.00)

  annotationExample22 = Annotation.find_or_create_by!(entry: entryExample6, account: account460, number: 1, debit: 600.00 , credit: "")
  annotationExample23 = Annotation.find_or_create_by!(entry: entryExample6, account: account570, number: 2, debit: "" , credit: 600.00)

  annotationExample24 = Annotation.find_or_create_by!(entry: entryExample7, account: account640, number: 1, debit: 7500.00 , credit: "")
  annotationExample25 = Annotation.find_or_create_by!(entry: entryExample7, account: account642, number: 2, debit: 1875.00 , credit: "")
  annotationExample26 = Annotation.find_or_create_by!(entry: entryExample7, account: account460, number: 3, debit: "", credit: 600.00)
  annotationExample27 = Annotation.find_or_create_by!(entry: entryExample7, account: account4751, number: 4, debit: "" , credit: 975.00)
  annotationExample28 = Annotation.find_or_create_by!(entry: entryExample7, account: account476, number: 5, debit: "" , credit: 2250.00)
  annotationExample29 = Annotation.find_or_create_by!(entry: entryExample7, account: account465, number: 6, debit: "" , credit: 5550.00)

  annotationExample30 = Annotation.find_or_create_by!(entry: entryExample8, account: account218, number: 1, debit: 32503.15 , credit: "")
  annotationExample31 = Annotation.find_or_create_by!(entry: entryExample8, account: account524, number: 2, debit: "" , credit: 15531.48)
  annotationExample32 = Annotation.find_or_create_by!(entry: entryExample8, account: account174, number: 3, debit: "" , credit: 16971.67)

  annotationExample33 = Annotation.find_or_create_by!(entry: entryExample9, account: account524, number: 1, debit: 5024.91 , credit: "")
  annotationExample34 = Annotation.find_or_create_by!(entry: entryExample9, account: account662, number: 2, debit: 975.09 , credit: "")
  annotationExample35 = Annotation.find_or_create_by!(entry: entryExample9, account: account4727, number: 3, debit: 420.00 , credit: "")
  annotationExample36 = Annotation.find_or_create_by!(entry: entryExample9, account: account572, number: 4, debit: "" , credit: 6420.00)

  annotationExample37 = Annotation.find_or_create_by!(entry: entryExample10, account: account465, number: 1, debit: 5550.00 , credit: "")
  annotationExample38 = Annotation.find_or_create_by!(entry: entryExample10, account: account572, number: 2, debit: "" , credit: 5550.00)

  annotationExample39 = Annotation.find_or_create_by!(entry: entryExample11, account: account430, number: 1, debit: 8560.00 , credit: "")
  annotationExample40 = Annotation.find_or_create_by!(entry: entryExample11, account: account700, number: 2, debit: "" , credit: 7900.00)
  annotationExample41 = Annotation.find_or_create_by!(entry: entryExample11, account: account437, number: 3, debit: "" , credit: 100.00)
  annotationExample42 = Annotation.find_or_create_by!(entry: entryExample11, account: account4777, number: 4, debit: "" , credit: 560.00)

  annotationExample43 = Annotation.find_or_create_by!(entry: entryExample12, account: account681, number: 1, debit: 2000.00 , credit: "")
  annotationExample44 = Annotation.find_or_create_by!(entry: entryExample12, account: account281, number: 2, debit: "" , credit: 2000.00)
  annotationExample45 = Annotation.find_or_create_by!(entry: entryExample12, account: account681, number: 3, debit: 2882.19 , credit: "")
  annotationExample46 = Annotation.find_or_create_by!(entry: entryExample12, account: account281, number: 4, debit: "" , credit: 2882.19)
  annotationExample47 = Annotation.find_or_create_by!(entry: entryExample12, account: account281, number: 5, debit: 4882.19 , credit: "")
  annotationExample48 = Annotation.find_or_create_by!(entry: entryExample12, account: account671, number: 6, debit: 3117.81 , credit: "")
  annotationExample49 = Annotation.find_or_create_by!(entry: entryExample12, account: account572, number: 7, debit: 9639.00 , credit: "")
  annotationExample50 = Annotation.find_or_create_by!(entry: entryExample12, account: account441, number: 8, debit: 9630.00 , credit: "")
  annotationExample51 = Annotation.find_or_create_by!(entry: entryExample12, account: account218, number: 9, debit: "" , credit: 26000.00)
  annotationExample52 = Annotation.find_or_create_by!(entry: entryExample12, account: account4777, number: 10, debit: "" , credit: 1260.00)

  annotationExample53 = Annotation.find_or_create_by!(entry: entryExample13, account: account628, number: 1, debit: 120.00 , credit: "")
  annotationExample54 = Annotation.find_or_create_by!(entry: entryExample13, account: account4727, number: 2, debit: 8.40 , credit: "")
  annotationExample55 = Annotation.find_or_create_by!(entry: entryExample13, account: account410, number: 3, debit: "" , credit: 128.40)
  
  annotationExample56 = Annotation.find_or_create_by!(entry: entryExample14, account: account640, number: 1, debit: 7500.00 , credit: "")
  annotationExample57 = Annotation.find_or_create_by!(entry: entryExample14, account: account642, number: 2, debit: 1875.00 , credit: "")
  annotationExample58 = Annotation.find_or_create_by!(entry: entryExample14, account: account4751, number: 3, debit: "" , credit: 975.00)
  annotationExample59 = Annotation.find_or_create_by!(entry: entryExample14, account: account476, number: 4, debit: "" , credit: 2250.00)
  annotationExample60 = Annotation.find_or_create_by!(entry: entryExample14, account: account465, number: 5, debit: "" , credit: 6150.00)
  annotationExample61 = Annotation.find_or_create_by!(entry: entryExample14, account: account465, number: 6, debit: 6150.00 , credit: "")
  annotationExample62 = Annotation.find_or_create_by!(entry: entryExample14, account: account572, number: 7, debit: "" , credit: 6150.00)

  annotationExample63 = Annotation.find_or_create_by!(entry: entryExample15, account: account476, number: 1, debit: 2250.00 , credit: "")
  annotationExample64 = Annotation.find_or_create_by!(entry: entryExample15, account: account572, number: 2, debit: "" , credit: 2250.00)

  annotationExample65 = Annotation.find_or_create_by!(entry: entryExample16, account: account4777, number: 1, debit: 1820.00 , credit: "")
  annotationExample66 = Annotation.find_or_create_by!(entry: entryExample16, account: account4727, number: 2, debit: "" , credit: 631.24)
  annotationExample67 = Annotation.find_or_create_by!(entry: entryExample16, account: account4757, number: 3, debit: "" , credit: 1188.76)

  exercise_example1 = Exercise.find_or_create_by!(user: user5, task: taskExample1) 
  
  mark_example1 = Mark.find_or_create_by!(mark: 10, exercise: exercise_example1, statement: statementExample1)
  mark_example2 = Mark.find_or_create_by!(mark: 5, exercise: exercise_example1, statement: statementExample2)
  mark_example3 = Mark.find_or_create_by!(mark: 7.5, exercise: exercise_example1, statement: statementExample3)

  student_entry_example1 = StudentEntry.find_or_create_by!(entry_number: 1, entry_date: Date.new(2024,8,1), mark: mark_example1) 
  student_entry_example2 = StudentEntry.find_or_create_by!(entry_number: 2, entry_date: Date.new(2024,8,3), mark: mark_example2) 
  student_entry_example3 = StudentEntry.find_or_create_by!(entry_number: 3, entry_date: Date.new(2024,8,7), mark: mark_example3) 

  student_annotation_example1 = StudentAnnotation.find_or_create_by!(number: 1, account_number: 407, credit: 0, debit: 1200.00, student_entry: student_entry_example1, account: account407) 
  student_annotation_example2 = StudentAnnotation.find_or_create_by!(number: 2, account_number: 4727, credit: 100, debit: 84.00, student_entry: student_entry_example1, account: account4727) 
  student_annotation_example3 = StudentAnnotation.find_or_create_by!(number: 3, account_number: 572, credit: 1284.00, debit: 0, student_entry: student_entry_example1, account: account572) 

  student_annotation_example4 = StudentAnnotation.find_or_create_by!(number: 1, account_number: 600, credit: 0, debit: 2940.00, student_entry: student_entry_example2, account: account600) 
  student_annotation_example5 = StudentAnnotation.find_or_create_by!(number: 2, account_number: 602, credit: 0, debit: 50.00, student_entry: student_entry_example2, account: account602) 
  student_annotation_example6 = StudentAnnotation.find_or_create_by!(number: 3, account_number: 4727, credit: 0, debit: 125.30, student_entry: student_entry_example2, account: account4727) 
  
  student_annotation_example7 = StudentAnnotation.find_or_create_by!(number: 1, account_number: 400, credit:0.0, debit: 419.71, student_entry: student_entry_example3, account: account400) 
  student_annotation_example8 = StudentAnnotation.find_or_create_by!(number: 2, account_number: 608, credit:392.25, debit: 0.0, student_entry: student_entry_example3, account: account608) 