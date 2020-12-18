import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatAll, map, mergeAll, mergeMap, take, toArray } from 'rxjs/operators';

import { Pokemon } from '../../../shared/models/pokemon.model';
import { Trainer } from '../../../shared/models/trainer.model';
import { GoogleConnectorService } from '../../http/google-connector/google-connector.service';
import { EntryPokemon } from '../../http/google-connector/models/entry-pokemon.model';
import { CacheStorageService } from '../cache-storage/cache-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {

  constructor(private googleConnector: GoogleConnectorService, private cacheStorage: CacheStorageService) { }

  public getTrainer(): Observable<Trainer> {
    const key = 'trainer';

    return this.cacheStorage.getItem<Trainer>(key)
      .pipe(
        mergeMap((t) => {
          if (t) {
            return of(t);
          }

          const expires = new Date();

          // Expires in
          expires.setHours(expires.getHours() + 1);

          const trainer = this.googleConnector.getTrainer()
            .pipe(
              map((e) => e.feed.entry),
              mergeAll(),
              take(1),
              map((e): Trainer => ({
                contactUri: e.gsx$contacturl.$t,
                friendCode: e.gsx$friendcode.$t,
                inGameName: e.gsx$ingamename.$t,
                trainerIconUri: e.gsx$trainericonurl.$t,
              }))
            );

          return this.cacheStorage.setItem(key, expires, trainer);
        })
      );
  }

  public getPokemons(): Observable<Pokemon> {
    const key = 'pkm';

    return this.cacheStorage.getItem<Pokemon[]>('pkm')
      .pipe(
        mergeMap((p) => {
          if (p) {
            return of(p);
          }

          const expires = new Date();

          // Expires in
          expires.setHours(expires.getHours() + 1);

          const pokemons = this.googleConnector.getPokemons()
            .pipe(
              map((e) => this.pokemonBuilder(e)),
              toArray()
            );

          return this.cacheStorage.setItem(key, expires, pokemons);
        }),
        concatAll()
      );
  }

  private pokemonBuilder(entry: EntryPokemon): Pokemon {
    return {
      dex: Number(entry.gsx$dexno.$t),
      species: entry.gsx$name.$t,
      form: entry.gsx$form.$t,
      nickname: entry.gsx$nickname.$t,
      gender: entry.gsx$gender.$t,
      shiny: entry.gsx$shiny.$t === 'TRUE',
      nature: entry.gsx$nature.$t,
      statNature: entry.gsx$statnature.$t,
      ability: entry.gsx$ability.$t,
      hpiv: Number(entry.gsx$hpiv.$t),
      atkiv: Number(entry.gsx$atkiv.$t),
      defiv: Number(entry.gsx$defiv.$t),
      spaiv: Number(entry.gsx$spaiv.$t),
      spdiv: Number(entry.gsx$spdiv.$t),
      speiv: Number(entry.gsx$speiv.$t),
      hpht: entry.gsx$hpht.$t === 'TRUE',
      atkht: entry.gsx$atkht.$t === 'TRUE',
      defht: entry.gsx$defht.$t === 'TRUE',
      spaht: entry.gsx$spaht.$t === 'TRUE',
      spdht: entry.gsx$spdht.$t === 'TRUE',
      speht: entry.gsx$speht.$t === 'TRUE',
      hpev: Number(entry.gsx$hpev.$t),
      atkev: Number(entry.gsx$atkev.$t),
      defev: Number(entry.gsx$defev.$t),
      spaev: Number(entry.gsx$spaev.$t),
      spdev: Number(entry.gsx$spdev.$t),
      speev: Number(entry.gsx$speev.$t),
      move1: entry.gsx$move1.$t,
      move2: entry.gsx$move2.$t,
      move3: entry.gsx$move3.$t,
      move4: entry.gsx$move4.$t,
      eggMove1: entry.gsx$eggmove1.$t,
      eggMove2: entry.gsx$eggmove2.$t,
      eggMove3: entry.gsx$eggmove3.$t,
      eggMove4: entry.gsx$eggmove4.$t,
      ball: entry.gsx$ball.$t,
      heldItem: entry.gsx$helditem.$t,
      ot: entry.gsx$ot.$t,
      tid: Number(entry.gsx$tid.$t),
      language: entry.gsx$language.$t,
      originGame: entry.gsx$origingame.$t,
      notes: entry.gsx$notes.$t,
    };
  }
}
