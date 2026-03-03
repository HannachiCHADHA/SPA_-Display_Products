import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const fetchProducts = async (cat = '') => {
    setLoading(true);
    setError('');
    const start = Date.now();
    try {
      const query = cat ? `?category=${encodeURIComponent(cat)}` : '';
      const res = await axios.get(`http://localhost:3000/api/products${query}`);
      setProducts(res.data.products || []);
      if ((res.data.products || []).length === 0) {
        setError('No products found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products.');
      setProducts([]);
    } finally {
      // ensure loader is visible at least 300ms so user can see it
      const elapsed = Date.now() - start;
      const min = 1000;
      if (elapsed < min) {
        setTimeout(() => setLoading(false), min - elapsed);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  // reset page any time products list changes (including after a filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product List</h1>
        <div>
          <label htmlFor="category">Filter by category:</label>{' '}
          <input
            id="category"
            type="text"
            value={category}
            onChange={handleCategoryChange}
            placeholder="e.g. electronics"
            disabled={loading}
          />
        </div>
      </header>

      <main>
        {loading && (
          <div className="loading-overlay">
            <div className="spinner">Loading...</div>
          </div>
        )}
        {error && !loading && <p>{error}</p>}
        {!loading && !error && (
          <>
            <ul className="product-list">
              {(
                // slice for current page
                products
                  .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                  .map((p) => (
                    <li key={p.id} className="product-item">
                      <h2>{p.title}</h2>
                      <p><strong>Price:</strong> ${p.price}</p>
                      <p><strong>Category:</strong> {p.category}</p>
                      <p>{p.description}</p>
                    </li>
                  ))
              )}
            </ul>
            {/* pagination controls */}
            {products.length > productsPerPage && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ←
                </button>
                <span>
                  Page {currentPage} of {Math.ceil(products.length / productsPerPage)}
                </span>
                <button
                  disabled={currentPage === Math.ceil(products.length / productsPerPage) || loading}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(Math.ceil(products.length / productsPerPage), p + 1))
                  }
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
