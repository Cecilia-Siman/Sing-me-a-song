import { Router } from "express";
import { deleteRecommendations } from "../controllers/e2eController.js";

const deleteRouter = Router();

deleteRouter.delete('/', deleteRecommendations.deleteAllRecommendations);

export default deleteRouter;