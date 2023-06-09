import { getShoppingCart } from '../utilities/fakedb';

const cartProductsLoader = async () => {
  // if cart data is in database, you have to use async await
  const storedCart = getShoppingCart();
  // console.log('------------------',storedCart)
  const selectedId = Object.keys(storedCart);
  console.log(selectedId);

  // const loadedProducts = await fetch(`https://ema-jhon-server-psi.vercel.app/products`)
  const loadedProducts = await fetch(
    'https://ema-jhon-server-psi.vercel.app/productsByIds',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedId),
    }
  );
  const products = await loadedProducts.json();

  const savedCart = [];

  for (const id in storedCart) {
    const addedProduct = products.find((pd) => pd._id === id);
    if (addedProduct) {
      const quantity = storedCart[id];
      addedProduct.quantity = quantity;
      savedCart.push(addedProduct);
    }
  }

  // if you need to send two things
  // return [products, savedCart]
  // another options
  // return { products, cart: savedCart }

  return savedCart;
};

export default cartProductsLoader;
