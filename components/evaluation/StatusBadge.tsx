interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-gray-500';
      case 'Em Andamento':
        return 'bg-blue-500';
      case 'Finalizado':
        return 'bg-green-500';
      case 'Cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'Pendente';
      case 'Em Andamento':
        return 'Em Andamento';
      case 'Finalizado':
        return 'Finalizado';
      case 'Cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge; 