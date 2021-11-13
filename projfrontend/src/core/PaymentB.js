import { useEffect, useState } from "react"
import DropIn from "braintree-web-drop-in-react"
import { isAuthenticated } from "../auth/helper"
import { getmeToken, processPayment } from "./helper/paymentBHelper"
import { loadCart, cartEmpty } from "./helper/cartHelper"
import { createOrder } from './helper/orderHelper'


const PaymentB = ({
  products,
  setReload = f => f,
  reload = undefined
}) => {

  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  })

  const userId = isAuthenticated() && isAuthenticated().user._id
  const token = isAuthenticated() && isAuthenticated().token

  const getToken = (userId, token) => {
    getmeToken(userId, token).then(info => {
      // console.log("Information: ", info);
      if (info.error) {
        setInfo({ ...info, error: info.error })
      } else {
        const clientToken = info.clientToken
        setInfo({ ...info, clientToken })
      }
    })
  }

  const showBtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0
          ? (
            <div>
              <DropIn
                options={{ authorization: info.clientToken }}
                onInstance={(instance) => (info.instance = instance)}
              />
              <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
            </div>
          )
          : (
            <h3>Please login or add something to cart</h3>
          )
        }
      </div>
    )
  }

  useEffect(() => {
    getToken(userId, token)
  }, [])

  const onPurchase = () => {
    setInfo({...info, loading: true})
    let nonce;
    let getNonce = info.instance
      .requestPaymentMethod()
      .then(data => {
        nonce = data.nonce
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount()
        }
        processPayment(userId, token, paymentData)
        .then(response => {
          setInfo({...info, success: response.success, loading: false})
          console.log("PAYMENT SUCCESS");

          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount
          }
          createOrder(userId, token, orderData)

          cartEmpty(() => {
            console.log("");
          })
          setReload(!reload)
        })
        .catch(error => {
          setInfo({...info, loading: false, success: false})
          console.log("PAYMENT FAILED");
        })
        .catch(err => console.log(err))
      })
  }

  const getAmount = () => {
    let amount = 0
    products.map(product => {
      amount = amount + product.price
    })
    return amount
  }

  return (
    <div>
      <h3>Your bill is {getAmount()}</h3>
      {showBtdropIn()}
    </div>
  )
}

export default PaymentB