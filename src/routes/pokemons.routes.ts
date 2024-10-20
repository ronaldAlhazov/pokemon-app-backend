import { Router } from "express";
import { addUserPokemon, getOpponent, getPokemons } from "../handlers/pokemons";

const router = Router();

router.get("/pokemons/getPokemons", getPokemons);
router.post("/pokemons/addToMyPokemons", addUserPokemon);
router.get("/pokemons/getOpponent", getOpponent);

export default router;
