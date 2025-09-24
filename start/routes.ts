/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";
router.on("/").renderInertia("landing");

// Auth — Registration
router.get("/register", [
  () => import("#features/auth/auth_controller"),
  "showRegister",
]);
router.post("/register", [
  () => import("#features/auth/auth_controller"),
  "register",
]);

// Auth — Login/Logout
router.get("/login", [
  () => import("#features/auth/auth_controller"),
  "showLogin",
]);
router.post("/login", [
  () => import("#features/auth/auth_controller"),
  "login",
]);
router.post("/logout", [
  () => import("#features/auth/auth_controller"),
  "logout",
]);

// Test route to check authentication
router.get("/test-auth", async ({ auth, response }) => {
  try {
    const user = await auth.user;
    return response.json({
      authenticated: true,
      user: user ? { id: user.id, email: user.email } : null
    });
  } catch (error) {
    return response.json({
      authenticated: false,
      error: error.message
    });
  }
});
// // Home (protected) — alias of Journal
// router.get("/home", ({ inertia }) => inertia.render("JournalHome")).use(middleware.auth());

// // Redirect /journal -> /home for consistency
// router.get("/journal", ({ response }) => response.redirect("/home"));



// RAG Test page (Inertia)
router.get("/rag-test", ({ inertia }) => inertia.render("rag-test/Index"));

router
  .get("/home", [
    () => import("#features/nooklet/nooklet_controller"),
    "index",
  ])
  .use(middleware.auth());

// Test LLM endpoints (no auth)
router.post("/test/llm/embed-text", [
  () => import("#features/ai/llm_test_controller"),
  "embedText",
]);

router.post("/test/llm/chat", [
  () => import("#features/ai/llm_test_controller"),
  "chat",
]);

router
  .group(() => {
    router.post("nooklets", [
      () => import("#features/nooklet/nooklet_controller"),
      "store",
    ]);
    router.put("nooklets/:id", [
      () => import("#features/nooklet/nooklet_controller"),
      "update",
    ]);
    router.delete("nooklets/:id", [
      () => import("#features/nooklet/nooklet_controller"),
      "destroy",
    ]);
  })
  .prefix("api/v1")
  .use(middleware.auth());
