export interface DocumentUploadData {
  atletaId: string;
  tipo: string;
  url: string;
  hash: string;
}

export interface InscricaoData {
  atletaId: string;
  federacaoId: string;
  clubeId: string;
  planoId: string;
}

export interface AssociateAtletaData {
  atletaId: string;
  clubeId: string;
  federacaoId: string;
  numeroRegistro: string;
}

export interface CampeonatoInscricaoData {
  inscricaoId: string;
  categoriaId: string;
  numeroCamisola?: number;
}
