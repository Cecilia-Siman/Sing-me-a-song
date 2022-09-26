import { Request, Response } from "express";
import { deleteAll } from "../repositories/e2eRepository.js";

async function deleteAllRecommendations(req: Request,res: Response) {
    await deleteAll();
    res.send(200);
}

export const deleteRecommendations ={
    deleteAllRecommendations
}