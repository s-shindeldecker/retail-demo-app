// pages/index.js
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProductList from '../components/ProductList';
import shoes from '../data/shoes.json';
import clothes from '../data/clothes.json';
import FeatureFlag from '../components/FeatureFlag';
import Head from 'next/head';
import Promotion from '../components/Promotion';

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
        {/* Feature Flag Section */}
        <FeatureFlag flagKey="new-promo-banner">
          <Promotion />
        </FeatureFlag>

        {/* Products Section */}
        <section>
          <ProductList products={allProducts} />
        </section>


      </main>
    </Layout>
  );
};

export default Home;
