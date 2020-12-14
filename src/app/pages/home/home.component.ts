import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, filter, map, toArray } from 'rxjs/operators';

import { GoogleService } from '../../core/services/google/google.service';
import { Pokemon } from '../../shared/models/pokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tabs: TabComp[] = [];

  constructor(googleService: GoogleService) {
    googleService.getTrainer()
      .subscribe((t) => {
        console.log('Trainer:', t);
        sessionStorage.setItem('trainer', JSON.stringify(t));
      });

    const pokemons = googleService.getPokemons()
      .pipe(
        toArray(),
        map((tabs) => tabs.sort((a, b) => a.dex - b.dex)),
        concatAll()
      );

    this.tabs.push({ name: 'Kanto', pokemons: this.getPokemons(pokemons, 1, 151) });
    this.tabs.push({ name: 'Johto', pokemons: this.getPokemons(pokemons, 152, 251) });
    this.tabs.push({ name: 'Hoenn', pokemons: this.getPokemons(pokemons, 252, 386) });
    this.tabs.push({ name: 'Sinnoh', pokemons: this.getPokemons(pokemons, 387, 493) });
    this.tabs.push({ name: 'Unova', pokemons: this.getPokemons(pokemons, 494, 649) });
    this.tabs.push({ name: 'Kalos', pokemons: this.getPokemons(pokemons, 650, 721) });
    this.tabs.push({ name: 'Alola', pokemons: this.getPokemons(pokemons, 722, 809) });
    this.tabs.push({ name: 'Galar', pokemons: this.getPokemons(pokemons, 810, 898) });
  }

  ngOnInit(): void {
  }

  private getPokemons(pokemons: Observable<Pokemon>, start: number, end: number): Observable<Pokemon[]> {
    return pokemons.pipe(
      filter((p) => p.dex >= start && p.dex <= end),
      toArray()
    );
  }
}

export interface TabComp {
  name: string;
  pokemons: Observable<Pokemon[]>;
}
