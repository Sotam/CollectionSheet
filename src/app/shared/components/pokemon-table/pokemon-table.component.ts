import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-table',
  templateUrl: './pokemon-table.component.html',
  styleUrls: ['./pokemon-table.component.scss']
})
export class PokemonTableComponent implements OnInit {
  @Input()
  pokemons!: Observable<Pokemon[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
