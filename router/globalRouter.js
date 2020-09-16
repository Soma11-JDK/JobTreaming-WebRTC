import express from "express";
import routes from "../routes";
import { getHome, getJoin, postJoin, getExit, getStreamer, getViewers } from '../controllers/globalController';

const globalRouter = express.Router();

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin);

globalRouter.get(routes.exit, getExit);

globalRouter.get(routes.streamer, getStreamer);
globalRouter.get(routes.viewers, getViewers);

globalRouter.get(routes.home, getHome);

export default globalRouter;