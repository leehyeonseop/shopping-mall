import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ADD_CART } from '../../graphql/cart'
import { Product } from '../../graphql/products'
import { graphqlFetcher, QueryKeys } from '../../queryClient'

export const ProductItem = ({
    description,
    imageUrl,
    price,
    createdAt,
    title,
    id
} : Product) => {

    const { mutate: addCart } = useMutation((id: string) => graphqlFetcher(ADD_CART, { id }))

    return (
        <li className='product-item'>
            <Link to={`/products/${id}`}>
                <p className='product-item__title'>{title}</p>
                {/* <p className='product-item__description'>{description}</p> */}
                <img className='product-item__image' src={imageUrl} />
                <span className='product-item__price'>${price}</span>
            </Link>
            <button className='product-item__add-cart' onClick={() => {
                addCart(id)
            }}>담기</button>
        </li>
    )
}