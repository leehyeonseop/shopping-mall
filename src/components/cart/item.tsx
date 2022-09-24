import { useMutation } from '@tanstack/react-query';
import { ForwardedRef, forwardRef, RefObject, SyntheticEvent } from 'react';
import { ADD_CART, CartType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { getClient, graphqlFetcher, QueryKeys } from '../../queryClient';
import ItemData from './itemData';

const CartItem = ({
    id,
    imageUrl,
    price,
    title,
    amount
} : CartType, ref : ForwardedRef<HTMLInputElement>) => {

    const queryClient = getClient()

    const {mutate : updateCart} = useMutation(({id, amount} : {id:string, amount:number}) => graphqlFetcher(UPDATE_CART, {id, amount}) ,{
        // 아래 방법대로 하게 되면은 성공할 때 마다 getCart라는 api 요청이 다시 가게된다! => 비효율적
        // 성공했을 때 setQueryDate로 캐시를 갈아 치우자! 그렇다면 요청을 다시 할 필요가 없음
        // onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART])
        onMutate: async ({id, amount}) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries([QueryKeys.CART])
        
            // Snapshot the previous value
            const prevCart = queryClient.getQueryData<{[key:string] : CartType}>([QueryKeys.CART])
            if(!prevCart?.[id]) return prevCart
            // Optimistically update to the new value
            const newCart = {
                ...(prevCart || {}),
                [id] : {...prevCart[id], amount}
            }
            queryClient.setQueryData([QueryKeys.CART], newCart)
        
        
            // Return a context object with the snapshotted value
            return prevCart
        },
        onSuccess: newValue => {
            const prevCart = queryClient.getQueryData<{[key: string] : CartType}>([QueryKeys.CART])
            const newCart = {
                ...(prevCart || {}),
                [id]: newValue,
            }
            queryClient.setQueryData([QueryKeys.CART], newCart)
        }
    })

    const {mutate: deleteCart} = useMutation(({id} : {id: string}) => graphqlFetcher(DELETE_CART, {id}), {
        onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART])
    })

    const handleUpdateAmount = (e : SyntheticEvent) => {
        const amount = Number((e.target as HTMLInputElement).value)
        if(amount < 1) return
        updateCart({id, amount})
    }

    const handleDeleteItem = () => {
        deleteCart({id})
    }

    return (
        <li className='cart-item'>
            <input className='cart-item__checkbox' type="checkbox" name='select-item' ref={ref} data-id={id}/>
            <ItemData imageUrl={imageUrl} price={price} title={title}/>
            <input type="number" className='cart-item__amount' value={amount} onChange={handleUpdateAmount} min={1}/>
            <button type='button' className='cart-item__button' onClick={handleDeleteItem}>삭제</button>
        </li>
    )
}

export default forwardRef(CartItem)