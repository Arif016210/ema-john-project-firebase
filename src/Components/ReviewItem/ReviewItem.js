import React from 'react';

const ReviewItem = (props) => {
    // console.log(props);

    const { name, quantity, key, price } = props.product;
    const reviewItemStyle = {
        borderBottom: "1px solid lightgrey",
        marginBottom: "5px",
        paddingBottom: "5px",
        marginLeft: "200px"
    }
    return (
        <div style={reviewItemStyle}>
            <h3 className="product-name" > {name} </h3>
            <p>Quantity : {quantity} </p>
            <p> ${price} </p>
            <br />
            <button
                onClick={() => props.removeProduct(key)}
                // onClick={() => props.removeProduct(key)}
                className="cart-btn" >Remove</button>
        </div>
    );
};

export default ReviewItem;