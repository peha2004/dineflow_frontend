interface Props {
  name: string;
  description?: string;
  price: number;
  category: string;
  availableFor?: string[];
}

export default function MenuCard({
  name,
  description,
  price,
  category,
  availableFor = []
}: Props) {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition duration-200">

      <h3 className="font-bold text-gray-800 mb-1">
        {name}
      </h3>

      {description && (
        <p className="text-xs text-gray-400 mb-3">
          {description}
        </p>
      )}

      <p className="text-sm text-gray-500 mb-2">
        {category}
      </p>

      {availableFor.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {availableFor.map(f => (
            <span
              key={f}
              className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-500 rounded-full border border-purple-100"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <p className="text-lg font-black text-purple-600 mt-3">
        Rs. {price.toLocaleString()}
      </p>

    </div>
  );
}