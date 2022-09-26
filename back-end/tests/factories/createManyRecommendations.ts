import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export async function createManyRecommendations() {
  for (let i = 0; i < 20; i++) {
    const recommendation = {
      name: faker.random.alpha(7),
      youtubeLink: "https://www.youtube.com/watch?v=mNEUkkoUoIA",
      score: Number(faker.random.numeric(1)),
    };
    await prisma.recommendation.create({
      data: recommendation,
    });
  }
}
