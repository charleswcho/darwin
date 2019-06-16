const DIET = {
  Herbivore: 'Herbivore',
  Omnivore: 'Omnivore',
  Carnivore: 'Carnivore'
};

class Creature {
  constructor(water, waterNeed, food, foodNeed, diet, speed) {
    this.water = water;
    this.waterNeed = waterNeed;
    this.food = food;
    this.foodNeed = foodNeed;
    this.diet = diet;
    this.speed = speed;
  }
}

class Herbivore extends Creature {
  constructor() {
    super(0, 1, 0, 1, DIET.Herbivore, 1);
  }
}

class Omnivore extends Creature {
  constructor() {
    super(0, 1, 0, 1, DIET.Omnivore, 1);
  }
}

class Carnivore extends Creature {
  constructor() {
    super(0, 1, 0, 1, DIET.Carnivore, 1);
  }
}

class Environment {
  constructor(biome, water, temperature, plantLevel, ediblePlants) {
    this.biome = biome;
    this.water = water;
    this.temperature = temperature;
    this.plantLevel = plantLevel;
    this.ediblePlants = ediblePlants;
  }
}

class Jungle extends Environment {
  constructor() {
    super('Jungle', 'High', 'High', 'High', 50);
  }
}

class Game {
  constructor() {
    this.herbivores = this.createCreatures(10, DIET.Herbivore);
    this.omnivores = this.createCreatures(3, DIET.Omnivore);
    this.carnivores = this.createCreatures(3, DIET.Carnivore);
    this.creatures = [
      ...this.herbivores,
      ...this.omnivores,
      ...this.carnivores
    ];
    this.environment = new Jungle();

    this.startNaturalSelection();
  }

  createCreatures(number, type) {
    const creatures = [];

    for (let i = 0; i < number; i++) {
      switch (type) {
        case DIET.Herbivore:
          creatures.push(new Herbivore());
          break;
        case DIET.Omnivore:
          creatures.push(new Omnivore());
          break;
        case DIET.Carnivore:
          creatures.push(new Carnivore());
          break;
      }
    }

    return creatures;
  }

  startNaturalSelection() {
    for (let i = 0; i < 3; i++) {
      this.runOneMonth();
      // this.runOneMonth();
    }
  }

  runOneMonth() {
    const herbs = this.herbivores.length;
    const omnis = this.omnivores.length;
    const carns = this.carnivores.length;
    let herbsEaten = 0;

    this.drink();

    this.graze();

    this.hunt();

    herbsEaten = herbs - this.herbivores.length;

    console.log('Herbs eaten', herbsEaten);

    this.herbivores = this.die(this.herbivores);
    this.omnivores = this.die(this.omnivores);
    this.carnivores = this.die(this.carnivores);

    this.creatures = [
      ...this.herbivores,
      ...this.omnivores,
      ...this.carnivores
    ];

    console.log(
      this.herbivores,
      `Herb survival rate ${this.herbivores.length}/${herbs}`
    );

    console.log(
      this.omnivores,
      `Omni survival rate ${this.omnivores.length}/${omnis}`
    );

    console.log(
      this.carnivores,
      `Carn survival rate ${this.carnivores.length}/${carns}`
    );

    console.log(this.creatures);

    this.reproduce();

    this.creatures = [
      ...this.herbivores,
      ...this.omnivores,
      ...this.carnivores
    ];

    console.log(this.creatures);
  }

  drink() {
    // All animals have a chance to get water
    this.creatures.forEach(creature => {
      creature.water = 0;

      if (this.environment.water === 'High') {
        creature.water = 1;
      }
    });
  }

  graze() {
    if (!this.environment.ediblePlants) {
      console.error('All plants are already gone.');
      return;
    }

    const plantEaters = [...this.herbivores, ...this.omnivores];

    this.herbivores = [];
    this.omnivores = [];

    // Herbivores + Omnivores are randomly picked then have a random chance to get food based on the food number stat
    // Better chance to find food when there is a lot of it
    while (plantEaters.length) {
      const [creature] = plantEaters.splice(
        Math.floor(Math.random() * plantEaters.length),
        1
      );

      // base chance (0.75) * water * speed = Graze success chance
      const gotFood = 0.75 * creature.water * creature.speed;
      const random = Math.random();

      console.log(
        creature.diet,
        'has a',
        gotFood,
        'chance to get food',
        random.toFixed(2)
      );

      if (gotFood > random) {
        this.environment.ediblePlants--;

        console.log(
          creature.diet,
          'got food',
          this.environment.ediblePlants,
          'left'
        );

        creature.food = 1;
      }

      if (creature.diet === DIET.Herbivore) {
        this.herbivores.push(creature);
      } else {
        this.omnivores.push(creature);
      }
    }
  }

  hunt() {
    if (!this.herbivores.length) {
      console.error('All herbivores are already dead.');
      return;
    }

    if (!this.omnivores.length) {
      console.warn('All omnivores are already dead.');
    }

    if (!this.carnivores.length) {
      console.warn('All carnivores are already dead.');
    }

    if (!this.omnivores.length && !this.carnivores.length) {
      console.warn('All predators are already dead.');
      return;
    }

    // Carnivores are randomly picked and have a chance to hunt
    // Calculations based on animal speed speed is augmented by water
    // 25% base chance
    // Wounding?
    const predators = [...this.omnivores, ...this.carnivores];

    this.omnivores = [];
    this.carnivores = [];

    while (predators.length) {
      if (!this.herbivores.length) {
        console.error('All herbivores are already dead.');
        return;
      }

      const [predator] = predators.splice(
        Math.floor(Math.random() * predators.length),
        1
      );

      const preyIdx = Math.floor(Math.random() * this.herbivores.length);
      const prey = this.herbivores[preyIdx];

      // base chance (0.25) * water * predator speed / prey speed = Hunt success chance
      const gotFood = 0.25 * predator.water * (predator.speed / prey.speed);
      const random = Math.random();

      console.log(
        predator.diet,
        'has a',
        gotFood,
        'chance to get food',
        random.toFixed(2)
      );

      // If the omnivore already ate plants skip them
      if (predator.diet === DIET.Omnivore && predator.food) {
        console.info('Omnivore already ate plants.');
        this.omnivores.push(predator);
        continue;
      }

      if (gotFood > random) {
        // If Food is all gone
        if (!this.herbivores.length) {
          console.error('No more prey in the environment.');
          break;
        }

        console.log('EATEN');

        this.herbivores.splice(preyIdx, 1);

        console.log(predator.diet, 'got food', this.herbivores.length, 'left');

        predator.food = 1;
      }

      if (predator.diet === DIET.Omnivore) {
        this.omnivores.push(predator);
      } else {
        this.carnivores.push(predator);
      }
    }
  }

  die(creatures) {
    return creatures.filter(creature => {
      if (creature.food === 0) {
        console.log(
          creature.diet,
          'died of starvation',
          creature.water,
          'water'
        );

        return false;
      }

      return true;
    });
  }

  reproduce() {
    this.herbivores = [...this.herbivores].concat(...this.herbivores);
    this.omnivores = [...this.omnivores].concat(...this.omnivores);
    this.carnivores = [...this.carnivores].concat(...this.carnivores);
  }
}

const game = new Game();
