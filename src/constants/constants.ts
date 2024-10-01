export enum SortBy {
  NAME_AZ = "Alphabetical A-Z",
  NAME_ZA = "Alphabetical Z-A",
  POWER_HL = "Power (High to low)",
  POWER_LH = "Power (Low to high)",
  HP_HL = "HP (High to low)",
  HP_LH = "HP (Low to High)",
}
export enum sortType {
  ASC = "asc",
  DESC = "desc",
}

export const sortByOptions = [
  {
    label: "Alphabetical A-Z",
    value: SortBy.NAME_AZ,
    order: sortType.ASC,
  },
  {
    label: "Alphabetical Z-A",
    value: SortBy.NAME_ZA,
    order: sortType.DESC,
  },
  {
    label: "Power (High to low)",
    value: SortBy.POWER_HL,
    order: sortType.DESC,
  },
  {
    label: "Power (Low to high)",
    value: SortBy.POWER_LH,
    order: sortType.ASC,
  },
  {
    label: "HP (High to low)",
    value: SortBy.HP_HL,
    order: sortType.DESC,
  },
  {
    label: "HP (Low to High)",
    value: SortBy.HP_LH,
    order: sortType.ASC,
  },
];
