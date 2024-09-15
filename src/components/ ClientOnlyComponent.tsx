// src/components/ClientOnlyComponent.tsx

import React from 'react';

const ClientOnlyComponent: React.FC = () => {
  return <div>This component is only rendered on the client side.</div>;
};

export default ClientOnlyComponent;
