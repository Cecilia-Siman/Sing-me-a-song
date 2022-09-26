import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import { createRecommendation } from "./factories/createOneRecommendation";
import { createManyRecommendations } from "./factories/createManyRecommendations";
import exp from "constants";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Tests on POST recommendation", () => {
  it("Must return 201 for correct recommendation", async () => {
    const body = {
      name: "Don't worry :)",
      youtubeLink: "https://www.youtube.com/watch?v=mNEUkkoUoIA",
    };
    const { status } = await supertest(app).post("/recommendations").send(body);
    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: body.name },
    });
    expect(status).toBe(201);
    expect(createdRecommendation).not.toBeNull();
  });
  it("Must return 422 for wrong schema", async () => {
    const { status } = await supertest(app).post("/recommendations");

    expect(status).toBe(422);
  });
  it("Must return 409 for repeated recommendation name", async () => {
    const body = {
      name: "Don't worry :)",
      youtubeLink: "https://www.youtube.com/watch?v=mNEUkkoUoIA",
    };
    await supertest(app).post("/recommendations").send(body);
    const { status } = await supertest(app).post("/recommendations").send(body);

    expect(status).toBe(409);
  });
  it("Must return 200 for upvote", async () => {
    const { id, score } = await createRecommendation();
    const { status } = await supertest(app).post(
      `/recommendations/${id}/upvote`
    );
    const { score: addedScore } = await prisma.recommendation.findFirst({
      where: {
        id,
      },
    });
    expect(status).toBe(200);
    expect(addedScore).toBe(score + 1);
  });
  it("Must return 404 for id not found at upvote", async () => {
    const { status } = await supertest(app).post("/recommendations/20/upvote");

    expect(status).toBe(404);
  });
  it("Must return 200 for downvote", async () => {
    const { id, score } = await createRecommendation();
    const { status } = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    const { score: subtractedScore } = await prisma.recommendation.findFirst({
      where: {
        id,
      },
    });
    expect(status).toBe(200);
    expect(subtractedScore).toBe(score - 1);
  });
  it("Must return 404 for id not found at downvote", async () => {
    const { status } = await supertest(app).post(
      "/recommendations/20/downvote"
    );

    expect(status).toBe(404);
  });
  it("Must delete recommendation with score < -5", async () => {
    const { id } = await createRecommendation();
    for (let i = 0; i < 6; i++) {
      await supertest(app).post(`/recommendations/${id}/downvote`);
    }
    const recommendation = await prisma.recommendation.findFirst({
      where: { id },
    });
    expect(recommendation).toBeFalsy();
  });
});

describe("Tests on GET recommendtions", () => {
  it("Must return list with 10 recommendations", async () => {
    await createManyRecommendations();
    const { status, body } = await supertest(app).get("/recommendations");

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(10);
  });
  it("Must return recommendation by id", async () => {
    const { id } = await createRecommendation();
    const { status, body } = await supertest(app).get(`/recommendations/${id}`);

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
  it("Must return 404 for no recommendation by id", async () => {
    const { status } = await supertest(app).get("/recommendations/20");

    expect(status).toBe(404);
  });
  it("Must return random recommendation", async () => {
    await createManyRecommendations();
    const { status, body } = await supertest(app).get(
      "/recommendations/random"
    );

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
  it("Must return 404 for no songs registered", async () => {
    const { status } = await supertest(app).get("/recommendations/random");

    expect(status).toBe(404);
  });
  it("Must return a specific amount of recommendations", async () => {
    await createManyRecommendations();
    const amount: number = 6;
    const { status, body } = await supertest(app).get(
      `/recommendations/top/${amount}`
    );

    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(amount);
  });
});
