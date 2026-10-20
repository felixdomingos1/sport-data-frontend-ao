import React from 'react';

/** Linha única por baixo do header, dividida em três colunas com as cores da bandeira de Angola. */
const FaixaAngola: React.FC = () => (
  <div aria-hidden="true" className="flex h-1">
    <span className="flex-1 bg-black" />
    <span className="flex-1 bg-[#FFCB00]" />
    <span className="flex-1 bg-[#CC092F]" />
  </div>
);

export default FaixaAngola;
