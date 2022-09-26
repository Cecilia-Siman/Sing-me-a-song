import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationExample } from "./factories/recommendationFactory";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Test insert recommendation", () => {
  it("Test create recommendation", async () => {
    const { name, youtubeLink } = recommendationExample();
    const recommendation = {
      name,
      youtubeLink,
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });
  it("Test insert recommendation with repeated name", async () => {
    const { name, youtubeLink } = recommendationExample();
    const recommendation = {
      name,
      youtubeLink,
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return {
          name: "Don't worry :)",
          youtubeLink: "https://www.youtube.com/watch?v=mNEUkkoUoIA",
        };
      });
    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });

    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Test voting", () => {
  it("Upvote", async () => {
    const recommendation = recommendationExample();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });
  it("Unable to upvote, id not found", async () => {
    const id: number = 2;
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    const promise = recommendationService.upvote(id);

    expect(recommendationRepository.find).toBeCalled;
    expect(recommendationRepository.updateScore).not.toBeCalled();
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });
  it("Downvote once", async () => {
    const recommendation = recommendationExample();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { ...recommendation, score: -1 };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });
  it("Unable to downvote, id not found", async () => {
    const id: number = 2;
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    const promise = recommendationService.downvote(id);
    expect(promise).rejects.toEqual({
      message: "",
      type: "not_found",
    });

    expect(recommendationRepository.updateScore).not.toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });
  it("Test downvoting and removing recommendation", async () => {
    const recommendation = recommendationExample();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          score: -6,
        };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});
    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Test getting recommendations", () => {
  it("Get 10 recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {});
    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });
  it("Get recommendation by id", async () => {
    const recommendation = recommendationExample();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          recommendation,
        };
      });
    await recommendationService.getById(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
  });
  it("Test finding recommendation for not valid id", async () => {
    const id: number = 5;
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    const promise = recommendationService.getById(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });
  it("Get an amount of top recommendations", async () => {
    const amount: number = 3;
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {});
    await recommendationService.getTop(amount);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });
  it("Get random recommendation", async () => {
    const recommendation = recommendationExample();
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [recommendation];
      });

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });
  it("Test getting recommendation from empty list", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [];
      });
    const promise = recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });
});
