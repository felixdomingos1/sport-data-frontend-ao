import type { DuplaPublica } from '@/infrastructure/services/jujitsu-duo.service';

/** Nome da equipa Duo: o nome original do clube inscrito (os atletas distinguem equipas do mesmo clube). */
export function nomeEquipa(i: DuplaPublica): string {
  return i.clube?.nome ?? (i.dupla.designacao || null) ?? i.provincia?.nome ?? atletasEquipa(i);
}

/** Os dois atletas da equipa, para mostrar por baixo do nome. */
export function atletasEquipa(i: DuplaPublica): string {
  return `${i.atleta1.nomeCompleto} & ${i.atleta2.nomeCompleto}`;
}
