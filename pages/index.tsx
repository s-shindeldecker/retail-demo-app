// pages/index.js
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProductList from '../components/ProductList';
import shoes from '../data/shoes.json';
import clothes from '../data/clothes.json';
import FeatureFlag from '../components/FeatureFlag';
import Head from 'next/head';

const Home = () => {
  const allProducts = [...shoes, ...clothes];

  return (
    <Layout>
      <Head>
        <title>RetailApp - Home</title>
        <meta
          name="description"
          content="Your one-stop shop for shoes and clothes."
        />
      </Head>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Products Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <ProductList products={allProducts} />
        </section>

        {/* Feature Flag Section */}
        <FeatureFlag flagKey="new-promo-banner">
          <section className="py-8 px-4 bg-yellow-100">
            <h2 className="text-2xl font-semibold">Special Promotion!</h2>
            <p className="mt-2 text-gray-700">
              Get 20% off on all products. Use code: SAVE20
            </p>
          </section>
        </FeatureFlag>
      </main>
    </Layout>
  );
};

export default Home;
