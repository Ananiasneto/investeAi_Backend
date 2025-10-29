import request from "supertest";
import app from "../../src/index";
import { findUserByEmail, createUserRepository } from "../../src/repository/auth-repository";
import { hash } from "bcrypt";

jest.mock("../../src/repository/auth-repository");

const mockedFindUserByEmail = findUserByEmail as jest.MockedFunction<typeof findUserByEmail>;
const mockedCreateUserRepository = createUserRepository as jest.MockedFunction<typeof createUserRepository>;

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
   afterAll(() => {
    jest.clearAllMocks();
  });
  describe("POST /sign-up", () => {
    it("deve retornar 422 quando body não passa no schema", async () => {
      const response = await request(app)
        .post("/sign-up")
        .send({ nome: "nias" });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });

    it("deve criar um usuário quando email não existe", async () => {
      const user = { email: "teste@mail.com", nome: "Teste", senha: "123456" };

      mockedFindUserByEmail.mockResolvedValue(null);
      mockedCreateUserRepository.mockResolvedValue({
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: user.email,
        nome: user.nome,
        senha: "hashedPassword",
        saldo: 0,
        patrimonio: 0,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/sign-up")
        .send(user);

      expect(mockedFindUserByEmail).toHaveBeenCalledWith(user.email);
      expect(mockedCreateUserRepository).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("deve retornar 409 quando email já existe", async () => {
      const user = { email: "teste@mail.com", nome: "Teste", senha: "123456" };

      mockedFindUserByEmail.mockResolvedValue(user as any);

      const response = await request(app)
        .post("/sign-up")
        .send(user);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /sign-in", () => {
    it("deve retornar 422 quando body não passa no schema", async () => {
      const response = await request(app)
        .post("/sign-in")
        .send({ nome: "nias" });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 404 quando email não encontrado", async () => {
      mockedFindUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post("/sign-in")
        .send({ email: "naoexiste@mail.com", senha: "123456" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 401 quando senha está incorreta", async () => {
      const passwordHash = await hash("123456", 10);
      mockedFindUserByEmail.mockResolvedValue({
        id: "1",
        email: "teste@mail.com",
        nome: "Teste",
        senha: passwordHash,
        saldo: 0,
        patrimonio: 0,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/sign-in")
        .send({ email: "teste@mail.com", senha: "senhaerrada" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 200 e token quando login é válido", async () => {
      const passwordHash = await hash("123456", 10);
      mockedFindUserByEmail.mockResolvedValue({
        id: "1",
        email: "teste@mail.com",
        nome: "Teste",
        senha: passwordHash,
        saldo: 0,
        patrimonio: 0,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/sign-in")
        .send({ email: "teste@mail.com", senha: "123456" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });
});
