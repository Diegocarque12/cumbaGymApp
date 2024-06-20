interface CardProps {
  name: string;
  description?: string;
}

const Card = ({ name, description }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default Card;
