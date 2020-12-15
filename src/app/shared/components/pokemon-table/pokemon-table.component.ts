import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    const ballSprite = ball.replace(/ /gi, '-');

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
}
