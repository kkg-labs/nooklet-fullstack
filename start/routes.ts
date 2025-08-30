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
  () => import("#features/auth/auth_controller"),
  "showRegister",
]);
router.post("/register", [
  () => import("#features/auth/auth_controller"),
  "register",
]);


// RAG Test page (Inertia)
router.get("/rag-test", ({ inertia }) => inertia.render("rag-test/Index"));


// Test LLM endpoints (no auth)
router.post("/test/llm/embed-text", [
  () => import("#features/ai/llm_test_controller"),
  "embedText",
]);

router.post("/test/llm/chat", [
  () => import("#features/ai/llm_test_controller"),
  "chat",
]);
