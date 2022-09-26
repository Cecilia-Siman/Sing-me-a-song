import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export async function createRecommendation() {
  const recommendation = {
    name: faker.random.alpha(7),
    youtubeLink: "https://www.youtube.com/watch?v=mNEUkkoUoIA",
    score: 0,
  };
  await prisma.recommendation.create({
    data: recommendation,
  });
  const createdRecommendation = await prisma.recommendation.findFirst({
    where: {
      name: recommendation.name,
    },
  });
  return createdRecommendation;
}
