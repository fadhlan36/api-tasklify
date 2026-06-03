const request = require("supertest");

describe("POST /api/boards", () => {
    it("should create board successfully with default columns", async () => {

        // login terlebih dahulu untuk mendapatkan token
        const loginResponse = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        const token = loginResponse.body.token;

        // create board
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Project Tasklify",
                description: "Membangun aplikasi Kanban",
                color: "#4f46e5",
            });

        // status code
        expect(response.status).toBe(201);

        // board fields
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("Project Tasklify");
        expect(response.body.description).toBe(
            "Membangun aplikasi Kanban"
        );
        expect(response.body.color).toBe("#4f46e5");

        // timestamps
        expect(response.body).toHaveProperty("createdAt");
        expect(response.body).toHaveProperty("updatedAt");

        // columns validation
        expect(response.body.columns).toBeDefined();
        expect(Array.isArray(response.body.columns)).toBe(true);
        expect(response.body.columns.length).toBe(3);

        // default column titles
        expect(response.body.columns[0].title).toBe("To Do");
        expect(response.body.columns[1].title).toBe("Doing");
        expect(response.body.columns[2].title).toBe("Done");
    });
});