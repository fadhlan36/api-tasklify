const request = require("supertest");

describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
        const response = await request(
            "https://taskify-app-rust.vercel.app"
        )
            .post("/api/auth/login")
            .send({
                email: "nadya@gmail.com",
                password: "12345678",
            });

        // cek status code
        expect(response.status).toBe(200);

        // cek message
        expect(response.body.message).toBe("Login berhasil");

        // cek token ada
        expect(response.body.token).toBeDefined();

        // cek user object
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user).toHaveProperty("name");
        expect(response.body.user).toHaveProperty("email");

        // cek email sesuai
        expect(response.body.user.email).toBe("nadya@gmail.com");
    });
});