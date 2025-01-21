export const routes = [];

routes.push({
  to: "/home",
  icon: "fi fi-rr-home",
  name: "home",
  rol: ["teacher", "admin", "student"],
})

routes.push({
  to: "/modes",
  icon: "fi fi-rr-bank",
  name: "modos",
  rol: ["teacher", "admin", "student"],
})

routes.push({
  to: "/task",
  icon: "fi fi-rr-graduation-cap",
  name: "tareas",
  rol: ["teacher", "admin"],
})


routes.push({
  to: "/schools",
  icon: "fi fi-rr-school",
  name: "gestión escuelas",
  rol: ["admin"],
})

routes.push({
  to: "/accounting-plans",
  icon: "fi fi-rr-book",
  name: "gestión planes contables",
  rol: ["teacher", "admin"],
})

routes.push({
  to: "/accounts",
  icon: "fi fi-rr-credit-card",
  name: "gestión cuentas",
  student: false,
  rol: ["teacher", "admin"],
})
