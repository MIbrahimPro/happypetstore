export type SeedPet = {
  kind: "adoption";
  name: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "visited" | "won" | "lost";
  source: string;
};

export const SEED_PETS: SeedPet[] = [
  {
    kind: "adoption",
    name: "Persian kitten, cream male",
    phone: "at the shop",
    message:
      "Two months old, litter trained, eats Royal Canin kitten. Comes with first vaccine card. Shop visit recommended, the kitten picks you.",
    status: "new",
    source: "in-store",
  },
  {
    kind: "adoption",
    name: "Persian kitten, white female",
    phone: "at the shop",
    message:
      "Teacup line, very calm. Weaned onto wet food. Price includes vet check and deworming record.",
    status: "new",
    source: "in-store",
  },
  {
    kind: "adoption",
    name: "Local tabby kittens, litter of three",
    phone: "at the shop",
    message:
      "Street-rescued litter raised at the clinic. Free to good homes, donation to the clinic welcome. Tough, healthy, playful.",
    status: "new",
    source: "rescue",
  },
  {
    kind: "adoption",
    name: "Labrador puppy, black male",
    phone: "at the shop",
    message:
      "Nine weeks, chunky, both vaccines done. Parents on site. Best for families with a little garden.",
    status: "new",
    source: "in-store",
  },
  {
    kind: "adoption",
    name: "German Shepherd puppy, female",
    phone: "at the shop",
    message:
      "Straight-back working line. Eight weeks, microchip booked. Needs an owner who will train her.",
    status: "new",
    source: "in-store",
  },
  {
    kind: "adoption",
    name: "Desi dog adult, Bruno",
    phone: "at the shop",
    message:
      "Two years, neutered, vaccinated. Rescued after a road accident near G-10. Walks on leash, guards the shop at night.",
    status: "new",
    source: "rescue",
  },
];
