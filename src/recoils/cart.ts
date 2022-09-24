import {atom, useRecoilValue, selectorFamily} from 'recoil';
import { CartType } from '../graphql/cart';

// const cartState = atom<Map<string, number>>({
//     key: 'cartState',
//     default: new Map()
// })

// export const useCartItem = (id: string) => {
//     const carts = useRecoilValue(cartState)
//     return carts.get(id)
// }
// 위방식을 사용하지말고 selectorFamily 사용하면 id값을 받아서 활용 가능

// export const cartItemSelector = selectorFamily({
//     key: 'cartItem',
//     get: (id: string) => ({get}) => {
//         const carts = get(cartState)
//         return carts.get(id)
//     },
//     set: (id: string) => ({set, get}, newValue) => {
//         console.log('newValue : ', newValue)
//         if (typeof newValue === 'number') {
//             const newCart = new Map([...get(cartState)])
//             newCart.set(id, newValue)
//             console.log('newCart : ', newCart)
//             set(cartState, newCart)
//         }
//     }
// })

export const checkedCartState = atom<CartType[]>({
    key: 'cartState',
    default: [],
})
