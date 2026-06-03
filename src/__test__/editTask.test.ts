const request = require("supertest");

describe("PUT /api/tasks/:id", () => {
    it("should update task successfully", async () => {

        // login
        const login = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        // update task
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .put("/api/tasks/02ebe82c-4946-48df-8c95-1173b177fd76")
            .set("Authorization", `Bearer ${login.body.token}`)
            .send({
                title: "Cart Feature (Updated)",
                priority: "URGENT",
                columnId: "0c78ba0f-1d40-4ed3-801b-a8a0b8bb69ea",
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            message: "Task berhasil diupdate",
        });

        expect(response.body.data).toMatchObject({
            id: expect.any(String),
            title: "Cart Feature (Updated)",
            priority: "URGENT",
            columnId: "0c78ba0f-1d40-4ed3-801b-a8a0b8bb69ea",
        });
    });
});