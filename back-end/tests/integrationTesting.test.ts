import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Tests on POST recommendation", () => {
  it.todo("Must return 201 for correct recommendation");
  it.todo("Must return 422 for wrong schema");
  it.todo("Must return 409 for repeated recommendation name");
  it.todo("Must return 200 for upvote");
  it.todo("Must return 200 for downvote");
});

describe("Tests on GET recommendtions", () => {
  it.todo("Must return list with 10 recommendations");
  it.todo('Must return no recomenddations for downvoted recommendation');
  it.todo("Must return recommendation by id");
  it.todo("Must return random recommendation");
  it.todo("Must return 404 for no songs registered");
  it.todo("Must return a specific amount of recommendations");
});
