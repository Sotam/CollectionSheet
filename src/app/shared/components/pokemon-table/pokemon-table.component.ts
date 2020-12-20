import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Move } from '../../models/move.model';
import { Pokemon } from '../../models/pokemon.model';
import { Type } from '../../models/type.enum';

@Component({
  selector: 'app-pokemon-table',
  templateUrl: './pokemon-table.component.html',
  styleUrls: ['./pokemon-table.component.scss'],
})
export class PokemonTableComponent {
  @Input()
  pokemons!: Observable<Pokemon[]>;

  public getPokemonSprite(species: string, form: string): string {
    const speciesSprite = species
      .toLowerCase()
      .replace(/ /gi, '-')
      .replace(/[^a-zA-Z0-9-]/gi, '');

    if (!form) {
      return speciesSprite.toLowerCase();
    }

    const formSprite = form
      .toLowerCase()
      .replace(/ /gi, '-')
      .replace(/[^a-zA-Z0-9-]/gi, '');

    return `${speciesSprite}-${formSprite}`;
  }

  public getItemSprite(item: string): string {
    return item
      .toLowerCase()
      .replace(/ /gi, '-')
      .replace('é', 'e');
  }

  public getSpecies(species: string, form: string): string {
    if (!form) {
      return species;
    }

    return `${species}<br /><small>${form}</small>`;
  }

  public getNatureFormat(nature: string, statNature: string): string {
    return statNature
      ? `${nature}<br /><small>(${statNature})</small>`
      : nature;
  }

  public getNatureClass(nature: string, statNature: string): string {
    const natureStr = statNature
      ? statNature
      : nature;

    return natureStr.toLowerCase();
  }

  public getHiddenPowerType(pkm: Pokemon): string {
    const hp = this.getLeastSignificantBit(pkm.hpiv);
    const atk = this.getLeastSignificantBit(pkm.atkiv) * 2;
    const def = this.getLeastSignificantBit(pkm.defiv) * 4;
    const spe = this.getLeastSignificantBit(pkm.speiv) * 8;
    const spa = this.getLeastSignificantBit(pkm.spaiv) * 16;
    const spd = this.getLeastSignificantBit(pkm.spdiv) * 32;

    const hpType = Math.floor(((hp + atk + def + spe + spa + spd) * 15) / 63);
    return `${Type[hpType + 1]}`;
  }

  public getHiddenPowerTypeSprite(pkm: Pokemon): string {
    return this.getHiddenPowerType(pkm).toLowerCase();
  }

  public getStat(pkm: Pokemon, iv: number, ev: number, ht: boolean): string {
    const ivStr = this.getIv(iv, ht);
    const evStr = this.getEv(pkm, ev);

    return evStr
      ? `${ivStr}<br /><small>${evStr}</small>`
      : ivStr;
  }

  private getIv(iv: number, ht: boolean): string {
    if (ht) {
      if (iv < 0) {
        return `HT`;
      }

      return `HT <small>(${iv})</small>`;
    }

    return `${iv}`;
  }

  private getEv(pkm: Pokemon, ev: number): string {
    if (pkm.hpev > 0 || pkm.atkev > 0 || pkm.defev > 0 || pkm.spaev > 0 || pkm.spdev > 0 || pkm.speev > 0) {
      return `${ev}`;
    }

    return '';
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

  private getLeastSignificantBit(input: number): number {
    return input % 2 === 0
      ? 0 // Even number
      : 1; // Odd number
  }
}
