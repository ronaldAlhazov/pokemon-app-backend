import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getPokemons(request: Request, response: Response) {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        base: true,
        image: true,
      },
    });

    response.json(pokemons);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
