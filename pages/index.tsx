// pages/index.js
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProductList from '../components/ProductList';
import shoes from '../data/shoes.json';
import clothes from '../data/clothes.json';
import {useFlags} from 'launchdarkly-react-client-sdk';
import Head from 'next/head';
import Promotion from '../components/Promotion';

const Home = () => {
  const allProducts = [...shoes, ...clothes];
  const { newPromoBanner } = useFlags();

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
        {/* Promotion Section */}
        {newPromoBanner && <Promotion />}

        {/* Products Section */}
        <section>
          <ProductList products={allProducts} />
        </section>


      </main>
    </Layout>
  );
};

export default Home;
