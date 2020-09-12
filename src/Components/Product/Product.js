import React from 'react';
import './Product.css'
import { Link } from 'react-router-dom';

const product = (props) => {
    console.log(props);
    const { name, img, seller, stock, price, key } = props.productList;
    return (
        <div className="product">
            <div>
                <img src={img} alt="" />
            </div>
            <div>
                <h3 className="product-Name"> <Link to={"/product/" + key} >{name}</Link> </h3>
                <br />
                <p><small> by: {seller} </small></p>
                <p> ${price} </p>
                <br />
                <p> only {stock} left in stock - order soon </p>
                <br />
                {props.showAddToCart && <button
                    className="cart-btn"
                    onClick={() => props.handlerAddProduct(props.productList)}

                >Add Cart</button>}
            </div>
        </div>
    );
};

export default product;