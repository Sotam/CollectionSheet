import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Move } from '../../models/move.model';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-table',
  templateUrl: './pokemon-table.component.html'
})
export class PokemonTableComponent implements OnInit {
  @Input()
  pokemons!: Observable<Pokemon[]>;

  constructor() { }

  ngOnInit(): void {
  }

  public getPokemonSprite(species: string, form: string): string {
    if (!form) {
      return species.toLowerCase();
    }

    return `${species.toLowerCase()}-${form.toLowerCase()}`;
  }

  public getBallSprite(ball: string): string {
    const ballSprite = ball
      .replace(/ /gi, '-')
      .replace('é', 'e');

    return `${ballSprite.toLowerCase()}`;
  }

  public getSpecies(species: string, form: string): string {
    if (!form) {
      return species;
    }

    return `${species}<br />${form}`;
  }

  public getNatureFormat(nature: string, statNature: string): string {
    if (!statNature) {
      return nature;
    }

    return `${nature}<br />(${statNature})`;
  }

  public getMoves(pkm: Pokemon): string {
    const moves: Move[] = [];

    this.setMove(moves, pkm.eggMove1, true);
    this.setMove(moves, pkm.eggMove2, true);
    this.setMove(moves, pkm.eggMove3, true);
    this.setMove(moves, pkm.eggMove4, true);

    this.setMove(moves, pkm.move1);
    this.setMove(moves, pkm.move2);
    this.setMove(moves, pkm.move3);
    this.setMove(moves, pkm.move4);

    const formattedMoves = moves.map((m) => {
      if (m.isEggMove) {
        return `<i><u>${m.name}</u></i>`;
      }

      return m.name;
    });

    return formattedMoves.join(', ');
  }

  private setMove(moves: Move[], move: string, isEggMove: boolean = false): void {
    if (move && !moves.some((m) => m.name === move)) {
      moves.push({ name: move, isEggMove });
    }
  }
}
