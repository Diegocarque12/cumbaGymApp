const Card = ({ name }: { name: string}) => {
  return (
    <div
      className='bg-gray-300 h-full w-full flex items-center justify-between px-4 py-8 md:w-1/2 xl:w-1/3 border-y-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    >
      <h1 className='tracking-widest text-xs title-font font-medium text-indigo-500 mb-1'>
        {name}
      </h1>
      <h3 className='title-font font-medium text-gray-400 mb-3'>
        Principiantes
      </h3>
    </div>
  );
};

export default Card;
