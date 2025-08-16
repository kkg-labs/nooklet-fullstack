/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
router.on("/").renderInertia("landing");

// Auth — Registration
router.get("/register", [
  () => import("#features/auth/controllers/auth_controller"),
  "showRegister",
]);
router.post("/register", [
  () => import("#features/auth/controllers/auth_controller"),
  "register",
]);
