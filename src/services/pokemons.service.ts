import e from "express";
import prisma from "../config/prisma";
import { SortBy, sortByOptions, sortType } from "../constants/constants";

export async function fetchPokemons(
  sortBy?: string,
  filter?: string,
  username?: string
) {
  try {
    const filterCriteria: any = {};

    if (filter) {
      filterCriteria.nameEnglish = {
        contains: String(filter),
        mode: "insensitive",
      };
    }

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new Error(`User with username "${username}" not found.`);
      }

      filterCriteria.id = { in: user.pokemons };
    }

    const pokemons = await prisma.pokemon.findMany({
      where: filterCriteria,
      include: {
        base: true,
        image: true,
      },
    });

    if (sortBy) {
      const sortOption = sortByOptions.find(
        (option) => option.value === sortBy
      );
      if (sortOption) {
        const order = sortOption.order;

        pokemons.sort((a, b) => {
          let valueA: string | number | undefined | null;
          let valueB: string | number | undefined | null;

          switch (sortBy) {
            case SortBy.NAME_AZ:
              valueA = a.nameEnglish;
              valueB = b.nameEnglish;
              break;
            case SortBy.NAME_ZA:
              valueA = b.nameEnglish;
              valueB = a.nameEnglish;
              break;
            case SortBy.POWER_HL:
              valueA = a.base.Attack;
              valueB = b.base.Attack;
              break;
            case SortBy.POWER_LH:
              valueA = a.base.Attack;
              valueB = b.base.Attack;
              break;
            case SortBy.HP_HL:
              valueA = a.base.HP;
              valueB = b.base.HP;
              break;
            case SortBy.HP_LH:
              valueA = a.base.HP;
              valueB = b.base.HP;
              break;
            default:
              return 0;
          }

          if (typeof valueA === "string" && typeof valueB === "string") {
            return order === sortType.ASC
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else if (typeof valueA === "number" && typeof valueB === "number") {
            return order === sortType.ASC ? valueA - valueB : valueB - valueA;
          }

          return 0;
        });
      }
    }
    return pokemons;
  } catch (error) {
    throw new Error("Error fetching Pokémon: " + error);
  }
}

export async function addPokemonToUser(username: string, pokemonId: number) {
  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new Error(`Pokemon with ID ${pokemonId} does not exist`);
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        pokemons: {
          push: pokemonId,
        },
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Error adding Pokémon to user: " + error);
  }
}
