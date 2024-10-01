import Dropdown from './Dropdown';

const Sidebar = () => {
  const categories = [
    'Shoes',
    'Tops & Shirts',
    'Shorts',
    'Hoodies & Pullovers',
    'Jackets & Vests',
    'Pants & Tights',
    'Socks',
  ];

  const preferences = [
    'Gender',
    'Kids',
    'Sale & Offers',
    'Color',
    'Shop by Price',
    'Brand',
    'Sports and Activities',
    'Best For',
  ];

  return (
    <aside className="w-full md:w-1/4 p-4  border-gray-200">
      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">New Releases</h2>
        <ul>
          {categories.map((category) => (
            <li key={category} className="mb-2">
              <a href="#" className="text-gray-700 hover:underline">
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Preferences */}
      <div className="mt-8">
      <hr className="my-4 border-gray-300" />
        {preferences.map((preference, index) => (
          <div key={preference}>
            <Dropdown title={preference}>
              {/* Dropdown content can be populated here */}
              <p className="text-gray-600">Options for {preference}</p>
            </Dropdown>
            {index < preferences.length - 1 && (
              <hr className="my-4 border-gray-300" />
            )}
          </div>
        ))}
      </div>
      <hr className="my-4 border-gray-300" />
    </aside>
  );
};

export default Sidebar;
