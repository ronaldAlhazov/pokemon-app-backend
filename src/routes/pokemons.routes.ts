import { Router } from "express";
import { addUserPokemon, getPokemons } from "../handlers/pokemons";

const router = Router();

router.get("/pokemons/getPokemons", getPokemons);
router.post("/pokemons/addToMyPokemons", addUserPokemon);

export default router;
