export const scRoutes = [];

scRoutes.push({
  to: "/home",
  icon: "fi fi-rr-home",
  name: "home",
  rol: ["student"],
  tooltipName: 'Inicio',
})

scRoutes.push({
  to: "/tasks",
  icon: "fi fi-rr-edit",
  name: "Tarea",
  rol: ["teacher"],
  tooltipName: 'Supuesto',
})

scRoutes.push({
  to: "/add-statements",
  icon: "fi fi-rr-pencil",
  name: "Enunciado",
  rol: ["teacher"],
  tooltipName: 'Operación u Operaciones Económicas',
})

scRoutes.push({
  to: "/modes/practica",
  icon: "fi fi-rr-bank",
  name: "Práctica",
  rol: ["teacher", "student"],
  tooltipName: 'Modo Práctica',
})

scRoutes.push({
  to: "/home/escuelas",
  icon: "fi fi-rr-school",
  name: "Centro Educativo",
  rol: ["admin"],
})

scRoutes.push({
  to: "/accounting-plans",
  icon: "fi fi-rr-book",
  name: "PGC",
  rol: ["teacher", "center_admin", "admin"],
  tooltipName: 'Planes de Contabilidad',
})

scRoutes.push({
  to: "/class-list",
  icon: "fi fi-rr-book",
  name: "Lista Grupos",
  student: false,
  rol: ["teacher", "center_admin", "admin"],
  tooltipName: 'Grupos de Clase',
})

scRoutes.push({
  to: "/home/usuarios",
  icon: "fi fi-rr-user-add",
  name: "Crear Usuario",
  student: false,
  rol: ["center_admin", "admin"],
})
