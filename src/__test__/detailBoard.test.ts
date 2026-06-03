const request = require("supertest");

describe("GET /api/boards/:id", () => {
    it("should retrieve board detail successfully", async () => {

        // login
        const login = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        // get board detail
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .get("/api/boards/471e3eea-6800-4443-bd98-aeb9c37e3570")
            .set("Authorization", `Bearer ${login.body.token}`);

        // status
        expect(response.status).toBe(200);

        // board validation
        expect(response.body).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            color: expect.any(String),
        });

        // columns validation
        expect(response.body.columns).toHaveLength(3);

        // validate task structure
        expect(response.body.columns[0].tasks[0]).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            priority: expect.any(String),
        });
    });
});