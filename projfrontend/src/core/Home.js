import React, { useEffect, useState } from 'react';

import Base from './Base';
import Card from './Card';
import { getProducts } from './helper/coreapicalls';

import '../styles.css'

function Home() {

  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  const loadAllProduct = () => {
    getProducts().then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })
  }

  useEffect(() => {
    loadAllProduct()
  }, [])

  return (
    <Base title="Home Page" description="Welcome to the Store">
      <div className="row text-center">
        <h1 className="text-white">All of tshirts</h1>
        <div className="row">
        {products.map((product, index) => (
          <div className="col-4 mb-4" key={index}>
            <Card product={product} />
          </div>
        ))}
        </div>
      </div>
    </Base>
  )
}

export default Home