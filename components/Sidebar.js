import Dropdown from "./Dropdown";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

const Sidebar = () => {
  const categories = [
    "Shoes",
    "Tops & Shirts",
    "Shorts",
    "Hoodies & Pullovers",
    "Jackets & Vests",
    "Pants & Tights",
    "Socks",
  ];

  const preferenceOptions = {
    Gender: ["Male", "Women", "Unisex"],
    Kids: ["Boys", "Girls"],
    "Sale & Offers": ["Sale"],
    "Shop by Price": ["$0 - $25", "$25 - $50", "$50 - $100", "$100 - $200", "$200 & Above"],
    Color: ["Black", "Blue", "Brown", "Green", "Grey", "Pink"],

  };

  const { sideNavPreferences } = useFlags();
  const preferences = sideNavPreferences.preferences;
  const ldClient = useLDClient();

  const handleCheckedBox = () => {
    console.log("Dropdown clicked");
    ldClient?.track("preferencesClicked");
    ldClient?.flush();
  };

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
            <Dropdown title={preference} >
              {/* Dropdown content populated here */}
              {preferenceOptions[preference]?.map((option) => (
                <div key={option} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={option}
                    name={option}
                    className="mr-2"
                    onClick={handleCheckedBox}
                  />
                  <label htmlFor={option} className="text-gray-600">
                    {option}
                  </label>
                </div>
              ))}
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
