import { Router } from "express";
import { getPokemons } from "../handelrs/pokemons";

const router = Router();

router.get("/pokemons", getPokemons);

export default router;
