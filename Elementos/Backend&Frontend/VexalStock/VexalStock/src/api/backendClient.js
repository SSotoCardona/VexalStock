const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function apiFetch(path, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        ...(options.headers || {}),
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      },
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    // For GET requests with no data, return empty array so UI doesn't break
    // but allow the error to be logged
    const isGetRequest = !options.method || options.method === 'GET';
    
    if (isGetRequest) {
      console.warn(`Backend unavailable for ${path}: ${error.message}`);
      return [];
    }
    
    // For mutations, throw the error
    throw error;
  }
}

export const getProducts = ({ status, category, sellerEmail } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (category) params.set('category', category);
  if (sellerEmail) params.set('sellerEmail', sellerEmail);
  return apiFetch(`/products${params.toString() ? `?${params.toString()}` : ''}`);
};

export const getProductById = async (id) => {
  const res = await apiFetch(`/products/${id}`);
  if (Array.isArray(res)) return null; // apiFetch returns [] on network GET errors; coerce to null for single-resource endpoints
  return res;
};
export const createProduct = (product) => apiFetch('/products', {
  method: 'POST',
  body: product instanceof FormData ? product : JSON.stringify(product),
});
export const updateProduct = (id, product) => apiFetch(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(product),
});
export const deleteProduct = (id) => apiFetch(`/products/${id}`, { method: 'DELETE' });

export const getFavorites = (userEmail) => apiFetch(`/favorites?userEmail=${encodeURIComponent(userEmail)}`);
export const createFavorite = (favorite) => apiFetch('/favorites', { method: 'POST', body: JSON.stringify(favorite) });
export const deleteFavorite = (id) => apiFetch(`/favorites/${id}`, { method: 'DELETE' });

export const getCartItems = (userEmail) => apiFetch(`/cart?userEmail=${encodeURIComponent(userEmail)}`);
export const addCartItem = (cartItem) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(cartItem) });
export const deleteCartItem = (id) => apiFetch(`/cart/${id}`, { method: 'DELETE' });
export const deleteCartItemByProduct = ({ userEmail, productId }) => apiFetch(`/cart?userEmail=${encodeURIComponent(userEmail)}&productId=${encodeURIComponent(productId)}`, { method: 'DELETE' });

export const getOrders = ({ buyerEmail, sellerEmail } = {}) => {
  const params = new URLSearchParams();
  if (buyerEmail) params.set('buyerEmail', buyerEmail);
  if (sellerEmail) params.set('sellerEmail', sellerEmail);
  return apiFetch(`/orders${params.toString() ? `?${params.toString()}` : ''}`);
};
export const createOrder = (order) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) });

export const getMessages = ({ receiverEmail, senderEmail, unreadOnly } = {}) => {
  const params = new URLSearchParams();
  if (receiverEmail) params.set('receiverEmail', receiverEmail);
  if (senderEmail) params.set('senderEmail', senderEmail);
  if (unreadOnly) params.set('unreadOnly', 'true');
  return apiFetch(`/messages${params.toString() ? `?${params.toString()}` : ''}`);
};
export const createMessage = (message) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(message) });
export const updateMessage = (id, message) => apiFetch(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(message) });

export const getReviewsByProductId = (productId) => apiFetch(`/reviews?productId=${encodeURIComponent(productId)}`);
export const getReviewsBySellerEmail = (sellerEmail) => apiFetch(`/reviews?sellerEmail=${encodeURIComponent(sellerEmail)}`);
export const createReview = (review) => apiFetch('/reviews', { method: 'POST', body: JSON.stringify(review) });
