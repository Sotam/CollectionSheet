import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, filter, map, mergeAll } from 'rxjs/operators';

import { EntryPokemon } from './models/entry-pokemon.model';
import { EntryTabList } from './models/entry-tab-list.model';
import { EntryTrainer } from './models/entry-trainer.model';
import { Root } from './models/root.model';
import { Tab } from './models/tab.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleConnectorService {
  private baseUri = 'https://spreadsheets.google.com/feeds';
  private spreadSheetId = '19bPAgDiQTRuNiwoSWz-2DSdD1hX2804JDCdRR3oRHfo';
  private worksheetUri = `${this.baseUri}/worksheets/${this.spreadSheetId}/public/basic?alt=json`;

  constructor(private http: HttpClient) { }

  public getTrainer(): Observable<Root<EntryTrainer>> {
    // Trainer tab will always be the first tab
    const trainerTabId = 1;
    const uri = this.getListUri(trainerTabId);

    return this.http.get<Root<EntryTrainer>>(uri);
  }

  public getPokemons(): Observable<EntryPokemon> {
    // Only use the second tab, filled with Pokémons
    const pokemonTabId = 2;
    const uri = this.getListUri(pokemonTabId);

    return this.http.get<Root<EntryPokemon>>(uri)
      .pipe(
        map((e) => e.feed.entry),
        concatAll(),
        filter((p) => !!p.gsx$dexno.$t)
      );
  }

  // Currently only use a single tab as source
  private getTabs(): Observable<Tab> {
    const uri = this.worksheetUri;
    const allowedTabs = ['FT', 'LF', 'NFT'];

    return this.http.get<Root<EntryTabList>>(uri)
      .pipe(
        map((r) => r.feed.entry),
        mergeAll(),
        map((e, i): Tab => ({ index: ++i, name: e.content.$t })),
        filter((t) => {
          const tabsFound = allowedTabs.filter((at) => t.name.startsWith(at));

          return tabsFound.length > 0;
        })
      );
  }

  private getListUri(page: number): string {
    return `${this.baseUri}/list/${this.spreadSheetId}/${page}/public/values?alt=json`;
  }
}
