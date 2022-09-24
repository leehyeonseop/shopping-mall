import { createRef, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CartType } from '../../graphql/cart';
import { checkedCartState } from '../../recoils/cart';
import CartItem from './item';
import WillPay from './willPay';

const CartList = ({items} : {items : CartType[]}) => {

    const [checkedCartData ,setCheckedCartData] = useRecoilState(checkedCartState)

    const formRef = useRef<HTMLFormElement>(null)

    // 아래 방법을 사용해주면 checkboxes를 찾는 작업을 하지 않아도 된다!
    const checkboxRefs = items.map(() => createRef<HTMLInputElement>())

    const [formData, setFormData] = useState<FormData>()

    const setAllCheckedFromItems = () => {
        // 개별 아이템 선택시
        if(!formRef.current) return
        const data = new FormData(formRef.current)
        const selectedCount = data.getAll('select-item').length
        const allChecked = (selectedCount === items.length)
        formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked = allChecked
    }

    const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
        const allChecked = targetInput.checked
        // 아래 방법은 checkboxes를 찾아야 했을 때
        // checkboxes.forEach(inputElem => {
        //     inputElem.checked = allChecked
        // })
        checkboxRefs.forEach(inputElem => {
            inputElem.current!.checked = allChecked
        })
    }

    const handleCheckboxChanged = (e?: SyntheticEvent) => {
        if(!formRef.current) return
        // const checkboxes = formRef.current.querySelectorAll<HTMLInputElement>('.cart-item__checkbox')

        const targetInput = e?.target as HTMLInputElement;

        if(targetInput && targetInput.classList.contains('select-all')) {
            // select-all 선택시
            setItemsCheckedFromAll(targetInput)
        } else {
            
            setAllCheckedFromItems()
        }
        const data = new FormData(formRef.current)
        console.log('data : ', ...data)
        // 아래꺼는 이상하게 나옴 차이점 알아보자!
        // console.log(data.entries())
        // console.log(...data.entries())
        // console.log(data.getAll('select-item'))
        setFormData(data)
    }

    useEffect(() => {
        checkedCartData.forEach(item => {
            const itemRef = checkboxRefs.find(ref => ref.current!.dataset.id === item.id)
            if(itemRef) itemRef.current!.checked = true
        })
        setAllCheckedFromItems()
    },[])

    useEffect(() => {
        // const checkedItems = checkboxRefs.map((ref, i) => {
        //     return ref.current!.checked ? items[i] : null
        // }).filter(v => !!v)
        const checkedItems = checkboxRefs.reduce<CartType[]>((res, ref, i) => {
            if(ref.current!.checked) res.push(items[i])
            return res
        },[])

        setCheckedCartData(checkedItems)
    }, [items, formData])

    return (
        <>
            <form ref={formRef} onChange={handleCheckboxChanged}>
                <label>
                    <input className='select-all' type="checkbox" name='select-all'/>
                    전체선택
                </label>

                <ul className='cart'>
                    {items.map((item, index) => <CartItem {...item} key={item.id} ref={checkboxRefs[index]}/>)}
                </ul>
            </form>
            <WillPay />
        </>
    )
}

export default CartList