enum Levels {
  Low,
  Normal,
  High
}

enum Diet {
  Herbivore,
  Omnivore,
  Carnivore
}

enum Biome {
  Plains,
  Forest,
  Jungle
}

export interface Creature {
  water: number;
  waterNeed: number;
  food: number;
  foodNeed: number;
  diet: Diet;
  speed: number;
}

export interface Environment {
  biome: Biome;
  water: Levels;
  temperature: Levels;
  plantLevel: Levels;
  ediblePlants: number;
}

class Herbavore {
  public stats: Creature = {
    water: 0,
    waterNeed: 1,
    food: 0,
    foodNeed: 1,
    diet: Diet.Herbivore,
    speed: 1
  };
}

class Omnivore {
  public stats: Creature = {
    water: 0,
    waterNeed: 1,
    food: 0,
    foodNeed: 1,
    diet: Diet.Omnivore,
    speed: 1
  };
}

class Carnivore {
  public stats: Creature = {
    water: 0,
    waterNeed: 1,
    food: 0,
    foodNeed: 1,
    diet: Diet.Carnivore,
    speed: 1
  };
}

class Jungle {
  public stats: Environment = {
    biome: Biome.Jungle,
    water: Levels.High,
    temperature: Levels.High,
    plantLevel: Levels.High,
    ediblePlants: 10
  };
}

class Forest {
  public stats: Environment = {
    biome: Biome.Forest,
    water: Levels.Normal,
    temperature: Levels.Normal,
    plantLevel: Levels.Normal,
    ediblePlants: 10
  };
}

class Plains {
  public stats: Environment = {
    biome: Biome.Plains,
    water: Levels.Low,
    temperature: Levels.High,
    plantLevel: Levels.High,
    ediblePlants: 10
  };
}

// More water + food = more attack stats = more hunt effectiveness = more hunt

// All animals looped through and have a chance to get water

// Herbivores + Omnivores are randomly picked then have a random chance to get food based on the food number stat
// Better chance to find food when there is a lot of it

// Carnivores are randomly picked and have a chance to hunt
// Calculations based on animal speed speed is augmented by water
// 25% base chance
