const request = require("supertest");

describe("POST /api/tasks", () => {
    it("should create task successfully", async () => {

        // login
        const login = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        // create task
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/tasks")
            .set("Authorization", `Bearer ${login.body.token}`)
            .send({
                title: "Cart Feature",
                description: "Membuat fitur add to cart",
                priority: "HIGH",
                columnId: "3472caf0-fee9-4f91-9cf6-3f8c6d484cda",
                order: 0,
            });

        expect(response.status).toBe(201);

        expect(response.body).toMatchObject({
            id: expect.any(String),
            title: "Cart Feature",
            priority: "HIGH",
            columnId: "3472caf0-fee9-4f91-9cf6-3f8c6d484cda",
        });
    });
});