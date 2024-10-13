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

export async function getPokemonByID(request: Request, response: Response) {
  const { id } = request.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    response.status(400).send({ message: "Id should be number!" });
    return;
  }

  try {
    const pokemon = await prisma.$queryRaw`
          SELECT 
              p.id, 
              p."nameEnglish", 
              p."description",
              p.type, 
              b."HP", 
              b."Attack", 
              b."Defense", 
              b."Sp_Attack" AS "SpAttack", 
              b."Sp_Defense" AS "SpDefense", 
              b."Speed", 
              i."sprite", 
              i."thumbnail", 
              i."hires" 
          FROM "Pokemon" p
          JOIN "Base" b ON p."baseId" = b.id
          JOIN "Image" i ON p."imageId" = i.id
          WHERE p.id = ${numericId}
      `;

    if (!pokemon) {
      response
        .status(400)
        .send({ message: `There is no pokemon with this id :${numericId}` });
      return;
    }

    response.json(pokemon);
  } catch (error) {
    handleServerError(response, error, "Error fetching Pokémon");
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
