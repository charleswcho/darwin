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
    super(0, 1, 0, 1, 'Herbivore', 1);
  }
}

class Omnivore extends Creature {
  constructor() {
    super(0, 1, 0, 1, 'Omnivore', 1);
  }
}

class Carnivore extends Creature {
  constructor() {
    super(0, 1, 0, 1, 'Carnivore', 1);
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
    super('Jungle', 'High', 'High', 'High', 100);
  }
}

class Game {
  constructor() {
    this.herbivores = this.createCreatures(10, 'Herbivore');
    this.omnivores = this.createCreatures(10, 'Omnivore');
    this.carnivores = this.createCreatures(10, 'Carnivore');
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
        case 'Herbivore':
          creatures.push(new Herbivore());
          break;
        case 'Omnivore':
          creatures.push(new Omnivore());
          break;
        case 'Carnivore':
          creatures.push(new Carnivore());
          break;
      }
    }

    return creatures;
  }

  startNaturalSelection() {
    // for (let i = 0; i < 12; i++) {
    this.runOneMonth();
    this.runOneMonth();
    // }
  }

  runOneMonth() {
    this.drink();

    this.graze();

    this.hunt();
    console.log(this.herbivores.length);

    this.die(this.herbivores);
    this.die(this.omnivores);
    this.die(this.carnivores);

    this.creatures = [
      ...this.herbivores,
      ...this.omnivores,
      ...this.carnivores
    ];

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

      // base chance (0.5) * water * speed = Graze success chance
      const gotFood = 0.5 * creature.water * creature.speed;
      const random = Math.random();

      console.log(
        creature.diet,
        'has a',
        gotFood,
        'chance to get food',
        random.toFixed(2)
      );

      if (gotFood > random) {
        // If Food is all gone
        if (!this.environment.ediblePlants) {
          break;
        }

        this.environment.ediblePlants--;

        console.log(
          creature.diet,
          'got food',
          this.environment.ediblePlants,
          'left'
        );

        creature.food = 1;
      }

      if (creature.diet === 'Herbivore') {
        this.herbivores.push(creature);
      } else {
        this.omnivores.push(creature);
      }
    }
  }

  hunt() {
    // Carnivores are randomly picked and have a chance to hunt
    // Calculations based on animal speed speed is augmented by water
    // 25% base chance
    // Wounding?
    const predators = [...this.omnivores, ...this.carnivores];

    this.omnivores = [];
    this.carnivores = [];

    while (predators.length) {
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
      if (predator.diet === 'Omnivore' && predator.food) {
        continue;
      }

      if (gotFood > random) {
        // If Food is all gone
        if (!this.herbivores.length) {
          break;
        }

        console.log('EATEN');

        this.herbivores.splice(preyIdx, 1);

        console.log(predator.diet, 'got food', this.herbivores.length, 'left');

        predator.food = 1;
      }

      if (predator.diet === 'Omnivore') {
        this.omnivores.push(predator);
      } else {
        this.carnivores.push(predator);
      }
    }
  }

  die(creatures) {
    for (let i = 0; i < creatures.length; i++) {
      if (creatures[i].food === 0) {
        console.log(
          creatures[i].diet,
          'died of starvation',
          creatures[i].water,
          'water'
        );
        creatures.splice(i, 1);
      }
    }
  }

  reproduce() {
    this.herbivores = [...this.herbivores].concat(...this.herbivores);
    this.omnivores = [...this.omnivores].concat(...this.omnivores);
    this.carnivores = [...this.carnivores].concat(...this.carnivores);
  }
}

const game = new Game();
