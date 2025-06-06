const faker = require('faker');

class GameSimulator {
  constructor() {
    this.leagues = {
      soccer_epl: { avgGoals: 2.8, teams: 20 },
      basketball_nba: { avgPoints: 220, teams: 30 }
    };
  }

  generateGames(sport = 'soccer_epl', count = 10) {
    const league = this.leagues[sport];
    const games = [];
    
    for (let i = 0; i < count; i++) {
      const status = this.randomStatus();
      const isCompleted = status === 'completed';
      
      const game = {
        id: faker.datatype.uuid(),
        sport_key: sport,
        commence_time: this.randomDate(),
        home_team: this.randomTeam(sport),
        away_team: this.randomTeam(sport),
        status: status,
        score: this.generateScore(sport, isCompleted),
        odds: this.generateOdds(status),
        simulation: isCompleted ? null : this.liveSimulation(sport)
      };
      
      games.push(game);
    }
    
    return games;
  }

  generateScore(sport, isCompleted) {
    const params = sport === 'soccer_epl' 
      ? { home: 1.4, away: 1.4 } 
      : { home: 110, away: 110 };
      
    return {
      home: this.poissonValue(params.home, isCompleted),
      away: this.poissonValue(params.away, isCompleted),
      time_elapsed: isCompleted ? 90 : Math.floor(Math.random() * 90)
    };
  }

  randomStatus() {
    const rand = Math.random();
    return rand < 0.6 ? 'completed' : rand < 0.8 ? 'live' : 'upcoming';
  }

  generateOdds(status) {
    const baseOdds = {
      home: 2.0 + Math.random(),
      draw: 3.0 + Math.random(),
      away: 2.0 + Math.random()
    };

    if (status === 'live') {
      return this.adjustLiveOdds(baseOdds);
    }
    
    return baseOdds;
  }

  adjustLiveOdds(odds) {
    const momentum = Math.random() * 0.3;
    return {
      home: odds.home * (0.9 + momentum),
      draw: odds.draw * (1.1 - momentum),
      away: odds.away * (0.9 + momentum)
    };
  }

  randomTeam(sport) {
    const prefix = sport === 'soccer_epl' ? 'FC ' : '';
    return prefix + faker.address.city() + ' ' + 
      faker.random.arrayElement(['United', 'City', 'FC', 'Athletic']);
  }

  randomDate() {
    return new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();
  }
}

// Usage
const simulator = new GameSimulator();
const simulatedGames = simulator.generateGames('soccer_epl', 5);
console.log(simulatedGames);
