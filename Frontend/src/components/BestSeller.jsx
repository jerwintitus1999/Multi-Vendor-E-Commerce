import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'

const BestSeller = () => {
    const {products} = useContext(ShopContext)
    const [BestSeller, setBestSeller] = useState([])

    
    useEffect(()=>{
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0,5))
    },[])
    
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={"BEST"} text2={"SELLER"}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-grey-600'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum earum nemo corrupti optio magnam itaque laboriosam dolore! Repellat laborum voluptas ipsa ex dolor at magni labore consectetur ratione consequuntur! Omnis.
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                BestSeller.map((item, index) =>{
                    
                })
            }
        </div>
    </div>
  )
}

export default BestSeller