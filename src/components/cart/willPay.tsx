import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { checkedCartState } from '../../recoils/cart'
import ItemData from './itemData'

const WillPay = () => {
    const navigate = useNavigate()
    const checkedItems = useRecoilValue(checkedCartState)
    const totalPrice = checkedItems.reduce((res, {price, amount}) => {
        res += price * amount;
        return res
    }, 0)

    const handleSubmit = () => {
        if(checkedItems.length) {
            navigate('/payment')
        } else {
            alert('결제할 대상이 없어요!')
        }
    }

    return (
        <div className='cart-willpay'>
            <ul>
                {checkedItems.map(({imageUrl, price, title, id, amount}) => (
                    <li>
                        <ItemData key={id} imageUrl={imageUrl} price={price} title={title} />
                        <p>수량 : {amount}</p>
                        <p>금액 : {price * amount}</p>
                    </li>
                ))}
            </ul>
            <p>총예상 결제액 : {totalPrice}</p>
            <button onClick={handleSubmit}>결제하기</button>
        </div>
    )
}

export default WillPay