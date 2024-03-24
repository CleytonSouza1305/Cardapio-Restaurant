const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn =document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

const cart = []

cartBtn.addEventListener('click', function() {
   updateCartModal()
   cartModal.classList.remove('hidden')
   cartModal.classList.add('flex')

   closeModalBtn.addEventListener('click', function() {
      cartModal.classList.add('hidden')
      cartModal.classList.remove('flex')
      addressWarn.classList.add('hidden')
      addressInput.classList.remove('border-red-500')
   })
})

cartModal.addEventListener('click', function(ev) {
   if (ev.target === cartModal) {
      cartModal.classList.add('hidden')
      cartModal.classList.remove('flex')
      addressWarn.classList.add('hidden')
      addressInput.classList.remove('border-red-500')
   }
})

menu.addEventListener('click', function(ev) {
   let parentButton = ev.target.closest('.add-to-cart-btn')

   if (parentButton) {
      const name = parentButton.dataset.name
      const price = parseFloat(parentButton.dataset.price)

      addToCart(name, price)
   }
})

function addToCart(name, price) {

   const existingItem = cart.find(item => item.name === name)

   if (existingItem) {
      existingItem.quantity++
   } else {
      cart.push({
         name,
         price,
         quantity: 1
      })
   }

   updateCartModal()
}

function updateCartModal() {
   cartItemsContainer.innerHTML = ''
   let total = 0

   cart.forEach(item => {
      const cardItemElement = document.createElement('div')
      cardItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

      let itemPrice = item.price
      let itemTotalNumber = itemPrice * item.quantity

      cardItemElement.innerHTML = `
      <div class="flex items-center justify-between mb-3">
         <div>
            <p class="font-bold">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mb-2">R$ ${itemTotalNumber.toFixed(2)}</p>
         </div>

            <button class="bg-red-500 text-white px-4 py-0.5 rounded remove-item" data-name="${item.name}">
            <i class="fa-solid fa-trash-can"></i>
            </button>
      </div>
      `
      total += itemTotalNumber

      cartItemsContainer.append(cardItemElement)
   })
   
   cartTotal.textContent = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
   })

   cartCounter.innerHTML = cart.length
}

cartItemsContainer.addEventListener('click', function(ev) {
   if (ev.target.classList.contains('remove-item')) {
      const name = ev.target.dataset.name
      removeItemCart(name)
   }
})

function removeItemCart(name) {
   const index = cart.findIndex(item => item.name === name)

   if (index !== -1) {
      const item = cart[index]

      if (item.quantity > 1) {
         item.quantity -= 1
         updateCartModal()
         return
      }

      cart.splice(index, 1)
      updateCartModal()
   }
}

addressInput.addEventListener('input', function(ev) {
   let inputValue = ev.target.value

   if (inputValue !== '') {
      addressInput.classList.remove('border-red-500')
      addressWarn.classList.add('hidden')
   }

})

checkoutBtn.addEventListener('click', function() {

   const open = checkOpen()

   if (!open) {
      cartModal.classList.add('hidden')
      const data = new Date()
      const actualHours = data.getHours()
      const horasRest = 18 - actualHours

      Toastify({
         text: `Ops, o restaurante esta fechado no momento, volte daqui à ${horasRest} hrs`,
         duration: 3000,
         close: true,
         gravity: "top", 
         position: "right", 
         stopOnFocus: true, 
         style: {
           background: "#ef4444",
           borderRadius: "6px",
           fontWeight: 'bold',
         },
      }).showToast()

      return
   }

   if (cart.length === 0) {
      addressWarn.classList.remove('hidden')
      addressWarn.textContent = 'Seu carrinho está vazio'
      addressInput.classList.add('border-red-500')
      return
   }

   if (addressInput.value === '') {
      addressWarn.classList.remove('hidden')
      addressWarn.textContent = 'Digite seu Endereço completo'
      addressInput.classList.add('border-red-500')
      return
   }

   const cartItems = cart.map(function(item) {
      return (
         `Item: ${item.name}
         Quantidade: ${item.quantity} 
         Preço: R$${item.price * item.quantity} | `
      )
   }).join("")

   const message = encodeURIComponent(cartItems)
   const phone = '11985961027'

   window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')

   cart.length = 0
   addressInput.value = ''
   updateCartModal()

})

function checkOpen() {
   const data = new Date()
   const hora = data.getHours()

   return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const open = checkOpen()

if (open) {
   spanItem.classList.remove('bg-red-500')
   spanItem.classList.add('bg-green-600')
} else {
   spanItem.classList.remove('bg-green-600')
   spanItem.classList.add('bg-red-500')
}
