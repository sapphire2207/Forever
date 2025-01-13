import { createContext, useEffect, useState } from 'react';
// import { products } from '../assets/assets'
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async(itemId, size) => {

        if(!size){
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData)
        
        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                }
                catch(error){

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async(itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount
    }

    // Used while adding to cart
    // useEffect(() => {
    //     console.log(cartItems)
    // }, [cartItems])

    const getProductsData = async() => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            console.log(response.data)
            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getUserCart = async(token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
            if(response.data.success){
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])


    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, token, setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

// Logic in addToCart:
// A deep copy of cartItems is created using structuredClone. This is done to avoid mutating the existing state directly.
// The function then checks:
// If the itemId already exists in the cart:
// If the size for that item already exists in the cart, it increments the quantity of that size.
// If the size doesn't exist yet, it adds the size and sets the quantity to 1.
// If the itemId does not exist in the cart, a new entry is created for the item with the selected size and quantity set to 1.

// Example Scenario:
// Let's say you have two items:
// Women's Top (_id: "aaaaa") with available sizes: "S", "M", "L".
// Men's T-shirt (_id: "aaaab") with sizes: "M", "L", "XL".
// First Add: You call addToCart("aaaaa", "M"):
// The cart is initially empty ({}).
// Since "aaaaa" (Women's Top) isn't in the cart, it creates a new entry:
// {
//   "aaaaa": { "M": 1 }
// }
// Second Add: You call addToCart("aaaaa", "M") again:
// The cart already has "aaaaa" with size "M", so it increments the quantity:
// {
//   "aaaaa": { "M": 2 }
// }
// Third Add: You call addToCart("aaaaa", "L"):
// The cart has "aaaaa", but not for size "L", so it adds size "L" with quantity 1:
// {
//   "aaaaa": { "M": 2, "L": 1 }
// }
// Fourth Add: You call addToCart("aaaab", "M") (Men's T-shirt):
// The cart doesn't have "aaaab" yet, so it adds it with size "M":
// {
//   "aaaaa": { "M": 2, "L": 1 },
//   "aaaab": { "M": 1 }
// }
// Each time, it checks if the item and size are already present and either increments the quantity or adds a new size to the item.