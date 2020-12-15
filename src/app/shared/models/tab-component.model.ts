import { Observable } from 'rxjs';

import { Pokemon } from './pokemon.model';

export interface TabComponent {
    name: string;
    pokemons: Observable<Pokemon[]>;
}
