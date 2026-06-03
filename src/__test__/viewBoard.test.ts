const request = require("supertest");

describe("GET /api/boards", () => {
    it("should retrieve all boards successfully", async () => {

        // login terlebih dahulu
        const loginResponse = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        const token = loginResponse.body.token;

        // get boards
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .get("/api/boards")
            .set("Authorization", `Bearer ${token}`);

        // status code
        expect(response.status).toBe(200);

        // response harus array
        expect(Array.isArray(response.body)).toBe(true);

        // minimal ada 1 board
        expect(response.body.length).toBeGreaterThan(0);

        // validasi object board pertama
        const board = response.body[0];

        expect(board).toHaveProperty("id");
        expect(board).toHaveProperty("title");
        expect(board).toHaveProperty("description");
        expect(board).toHaveProperty("color");
        expect(board).toHaveProperty("createdAt");
        expect(board).toHaveProperty("updatedAt");

        // validasi tipe data
        expect(typeof board.title).toBe("string");
        expect(typeof board.color).toBe("string");
    });
});