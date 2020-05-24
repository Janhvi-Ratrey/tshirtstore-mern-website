import React, {useEffect, useState} from 'react';
import { isAuthenticated, signin } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from '../backend';
import { createOrder } from "./helper/orderHelper";


const StripeCheckout = ({products, setReload = f=> f, reload = undefined}) => {
    
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })
    
    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalPrice = () => {
       let amount = 0
       products.map(p => {
           amount = amount + p.price
       })
       return amount
    }

    const makePayment = (token) => {
      const body = {
          token,
          products
      }
      const headers={
          "Content-Type": "application/json"
      }
      return fetch(`${API}/stripepayment`, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
      }).then(response => {
        console.log(response)
        const {status} = response
        console.log("STATUS ", status);
        // const orderData = {
        //     products: products,
        //     transaction_id: response.transaction.id,
        //     amount: response.transaction.amount
        // }
        // createOrder(userId, token, orderData)
    cartEmpty(() =>{
        console.log("got a crash?");

        
    })
    setReload(!reload)
        
      }).catch(error=> console.log(error))
    }
    
    const showStripeButton = () => {
        return isAuthenticated()? (
            <StripeCheckoutButton
            stripeKey = "pk_test_FyVrqybvLmNdmdXiSy54Jopc00hdYpkeJ8"
            token={makePayment}
            amount={getFinalPrice()*100}
            name = "Buy"
            shippingAddress
            billingAddress
            >
            <button className = "btn btn-success">Pay with stripe</button>
            </StripeCheckoutButton>
            ): (
            <Link to = "/signin">
                     <button className = "btn btn-warning">SignIn</button>
            </Link>
        )
    }
    return (
         <div>
           <h3 className ="text-white">Stripe Checkout {getFinalPrice()}$</h3>
             {showStripeButton()}
           </div>
    )
}

export default StripeCheckout;