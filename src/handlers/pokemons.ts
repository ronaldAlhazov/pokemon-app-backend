import { Request, Response } from "express";
import prisma from "../config/prisma";
import { addPokemonToUser, fetchPokemons } from "../services/pokemons.service";

function handleServerError(
  response: Response,
  error: any,
  message: string = "Internal Server Error"
) {
  console.error(message, error);
  response.status(500).json({ error: message });
}
export async function getPokemons(
  request: Request,
  response: Response
): Promise<void> {
  const { sortBy, filter, username } = request.query;

  try {
    const pokemons = await fetchPokemons(
      sortBy as string,
      filter as string,
      username as string
    );
    response.json(pokemons);
  } catch (error) {
    handleServerError(response, error);
  }
}

export async function addUserPokemon(
  request: Request,
  response: Response
): Promise<void> {
  const { username, pokemonId } = request.query;

  try {
    if (!username || !pokemonId) {
      response
        .status(400)
        .json({ error: "Username and Pokemon ID are required" });
      return;
    }
    const pokemonIdNumber = parseInt(pokemonId as string, 10);

    const updatedUser = await addPokemonToUser(
      username as string,
      pokemonIdNumber
    );
    response.json({
      message: `Pokemon with ID ${pokemonId} added to ${username}'s collection`,
      user: updatedUser,
    });
  } catch (error) {
    handleServerError(response, error);
  }
}

export async function getOpponent(
  request: Request,
  response: Response
): Promise<void> {
  const { username } = request.query;

  if (!username) {
    response.status(400).json({ error: "Username is required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username: username as string },
  });

  if (!user) {
    response
      .status(404)
      .json({ error: `User with username "${username}" not found.` });
    return;
  }

  const availablePokemons = await prisma.pokemon.findMany({
    where: {
      AND: [
        { base: { is: {} } },
        { id: { notIn: user.pokemons } },
        { base: { HP: { not: null } } },
        { base: { Attack: { not: null } } },
        { base: { Defense: { not: null } } },
        { base: { SpAttack: { not: null } } },
        { base: { SpDefense: { not: null } } },
        { base: { Speed: { not: null } } },
      ],
    },
    select: {
      id: true,
    },
  });

  if (availablePokemons.length === 0) {
    response
      .status(404)
      .json({ error: "No available opponents with base stats." });
    return;
  }

  const randomIndex = Math.floor(Math.random() * availablePokemons.length);
  const opponentPokemonId = availablePokemons[randomIndex].id;

  const opponentPokemon = await prisma.pokemon.findUnique({
    where: { id: opponentPokemonId },
    include: {
      base: true,
      image: true,
    },
  });

  if (!opponentPokemon) {
    response.status(404).json({ error: "Opponent not found." });
    return;
  }

  response.json(opponentPokemon);
}
