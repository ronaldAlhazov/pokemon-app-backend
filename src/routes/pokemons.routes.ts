import { Router } from "express";
import { getPokemonByID, getPokemons } from "../handlers/pokemons";

const router = Router();

router.get("/pokemons", getPokemons);

router.get("/pokemons/:id", getPokemonByID);

export default router;
