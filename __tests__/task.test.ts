import request from "supertest";
import app from "../src/app";

describe("Task API", () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(5001); // Start the server on a different port to avoid conflicts
  });

  afterAll(async () => {
    await server.close(); // Close the server after all tests are done
  });

  let taskId: string;

  // ** Create a new task **
  it("should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task", description: "Test Description" });

    expect(res.statusCode).toBe(201);
    expect(res.body.newTask).toHaveProperty("id");
    taskId = res.body.newTask.id;
  });

  // ** Get all tasks **
  it("should retrieve all tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  // ** Update a task **
  it("should update a task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.updatedTask.title).toBe("Updated Task");
  });

  // ** Delete a task **
  it("should delete a task", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
  });
});
