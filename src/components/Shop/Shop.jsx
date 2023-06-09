import React, { useEffect, useState } from 'react';
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(0);
  // console.log(currentPage)
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { totalProducts } = useLoaderData();
  const [itemsPerPage, setItemsPerPage] = useState(6);
  //   const itemsPerPage = 10  //TODO :meke it dynamic
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // const pageNumbers = [];
  // for (let i = 1; i < totalPages; i++)
  // {
  //     pageNumbers.push(i);
  // }

  const pageNumbers = [...Array(totalPages).keys()];
  // console.log(pageNumbers)
  // console.log(typeof totalProducts,totalProducts ,totalPages);

  //   useEffect(() => {
  //       fetch('https://ema-jhon-server-psi.vercel.app/products')
  //       .then((res) => res.json())
  //       .then((data) => setProducts(data));
  // }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://ema-jhon-server-psi.vercel.app/products?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await res.json();
      setProducts(data);
    }
    fetchData();
  }, [currentPage, totalPages]);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const selectedId = Object.keys(storedCart);

    fetch('https://ema-jhon-server-psi.vercel.app/productsByIds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedId),
    })
      .then((res) => res.json())
      .then((cartProducts) => {
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
          // step 2: get product from products state by using id
          const addedProduct = cartProducts.find(
            (product) => product._id === id
          );
          if (addedProduct) {
            // step 3: add quantity
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            // step 4: add the added product to the saved cart
            savedCart.push(addedProduct);
          }
          // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
      });
  }, []);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const options = [6, 9, 12, 15];
  const handleSelectChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      <div className='shop-container'>
        <div className='products-container'>
          {products.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className='cart-container'>
          <Cart cart={cart} handleClearCart={handleClearCart}>
            <Link className='proceed-link' to='/orders'>
              <button className='btn-proceed'>Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>
      {/* pagination */}
      <div className='pagination'>
        <p>Current Page: {currentPage}</p>
        {pageNumbers.map((number) => (
          <button
            className={currentPage === number ? 'selected' : ''}
            key={number}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
        <select
          name=''
          id=''
          value={itemsPerPage}
          onChange={handleSelectChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Shop;
