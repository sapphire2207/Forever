import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import {useNavigate} from 'react-router-dom';



const Update = ({ token }) => {
  const navigate = useNavigate();
  const { list } = useContext(AdminContext);

  const [productData, setProductData] = useState([]); // Initialize as an empty array
  const { itemId } = useParams();

  // const getProductData = () => {
  //   const requiredProduct = list.filter(item => item._id === itemId);
  //   setProductData(requiredProduct);
  // };

  // useEffect(() => {
  //   getProductData();
  // }, [token]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestSeller] = useState(false);
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [requiredProduct, setRequiredProduct] = useState('')

  // useEffect(() => {
  //   if (productData.length > 0) { // Check if productData[0] exists
  //     setName(productData[0].name || '');
  //     setDescription(productData[0].description || '');
  //     setCategory(productData[0].category || '');
  //     setSubCategory(productData[0].subCategory || '');
  //     setPrice(productData[0].price || 0);
  //     setSizes(productData[0].sizes || []);
  //     setBestSeller(productData[0].bestseller || false);
  //     setImage1(productData[0].image[0])
  //     setImage2(productData[0].image[1])
  //     setImage3(productData[0].image[2])
  //     setImage4(productData[0].image[3])
  //   }
  // }, [productData]);

  useEffect(() => {
    const requiredProduct = list.find(item => item._id === itemId);
    setRequiredProduct(requiredProduct);
    if (requiredProduct) {
      setProductData(requiredProduct);
      setName(requiredProduct.name || '');
      setDescription(requiredProduct.description || '');
      setCategory(requiredProduct.category || '');
      setSubCategory(requiredProduct.subCategory || '');
      setPrice(requiredProduct.price || 0);
      setSizes(requiredProduct.sizes || []);
      setBestSeller(requiredProduct.bestseller || false);
      setImage1(requiredProduct.image[0] || null);
      setImage2(requiredProduct.image[1] || null);
      setImage3(requiredProduct.image[2] || null);
      setImage4(requiredProduct.image[3] || null);
    }
  }, [list, itemId]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setImage(URL.createObjectURL(file));  // Create a URL for the selected image
    }
  };

  

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      // image1 && formData.append("image1", image1)
      // image2 && formData.append("image2", image2)
      // image3 && formData.append("image3", image3)
      // image4 && formData.append("image4", image4)

    if (image1) formData.append('image1', image1 instanceof File ? image1 : requiredProduct.image[0]);
    if (image2) formData.append('image2', image2 instanceof File ? image2 : requiredProduct.image[1]);
    if (image3) formData.append('image3', image3 instanceof File ? image3 : requiredProduct.image[2]);
    if (image4) formData.append('image4', image4 instanceof File ? image4 : requiredProduct.image[3]);

      console.log("Form Data is:")
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

      const response = await axios.post(`${backendUrl}/api/product/update/${itemId}`, formData, {headers: {token}})
      console.log(response.data)

      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1('')
        setImage2('')
        setImage3('')
        setImage4('')
        setPrice('')
        setCategory('Men')
        setSubCategory('Topwear')
        setBestSeller(false)
        setSizes([])
        navigate('/list')
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img src={image1 instanceof File ? URL.createObjectURL(image1) : image1 || assets.upload_area} className='w-20' alt="Product" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img src={image2 instanceof File ? URL.createObjectURL(image2) : image2 || assets.upload_area} className='w-20' alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img src={image3 instanceof File ? URL.createObjectURL(image3) : image3 || assets.upload_area} className='w-20' alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img src={image4 instanceof File ? URL.createObjectURL(image4) : image4 || assets.upload_area} className='w-20' alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Type Here'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea
          className='w-full max-w-[500px] px-3 py-2'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Write the content here'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            className='w-full px-3 py-2'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select
            className='w-full px-3 py-2'
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            className='w-full px-3 py-2 sm:w-[120px]'
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='25'
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== 'S') : [...prev, "S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== 'M') : [...prev, "M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== 'L') : [...prev, "L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== 'XL') : [...prev, "XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== 'XXL') : [...prev, "XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className='flex gap-3 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={(e) => setBestSeller(e.target.checked)}
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  );
};

export default Update;
