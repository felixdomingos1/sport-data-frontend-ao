import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { competicaoService } from '@/infrastructure/services/competicao.service';
import DisplayAoVivo from './display-ao-vivo';
import DisplayDuoBatalhas from './display-duo-batalhas';

const MODALIDADE_DUO = 'JIU_JITSU_DUO';

/** `/display/:id`: competições Ju-Jitsu Duo mostram a lista de batalhas; as restantes o quadro ao vivo. */
const DisplayCampeonato: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [tipo, setTipo] = useState<{ id: string; duo: boolean } | null>(null);

  useEffect(() => {
    let ativo = true;
    competicaoService
      .getCampeonatoById(id)
      .then((c) => ativo && setTipo({ id, duo: c.modalidade === MODALIDADE_DUO }))
      // Pode ser o id de um combate (o quadro ao vivo trata esse caso)
      .catch(() => ativo && setTipo({ id, duo: false }));
    return () => {
      ativo = false;
    };
  }, [id]);

  if (!tipo || tipo.id !== id) return <div className="min-h-screen w-full bg-[#2b313b]" aria-busy="true" />;
  return tipo.duo ? <DisplayDuoBatalhas campeonatoId={id} /> : <DisplayAoVivo />;
};

export default DisplayCampeonato;
