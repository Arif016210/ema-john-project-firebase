import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import fakeData from '../../fakeData';

const ProductDetail = () => {
    const { ProductKey } = useParams()

    const products = fakeData.find(product => product.key === ProductKey);
    console.log(products);
    return (
        <div>
            <h1> {ProductKey} Info Coming Soooooooon</h1>
            <Product showAddToCart={false} productList={products} ></Product>
        </div>
    );
};

export default ProductDetail;