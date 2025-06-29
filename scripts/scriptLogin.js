document.addEventListener('DOMContentLoaded', function () {
    const addAddressButton = document.getElementById('add-address-button');
    const additionalAddressesDiv = document.getElementById('additional-addresses');
    const addressTemplate = document.getElementById('address-template');

  
    addressTemplate.removeAttribute('id');

    addAddressButton.addEventListener('click', function () {
        addAddressForm();
    });

    function addAddressForm() {
        
        const newAddressContainer = addressTemplate.cloneNode(true);
        
        newAddressContainer.classList.add('cloned-address-form');

      
        const newAddressForm = newAddressContainer.querySelector('.address-form');

        
        newAddressForm.querySelectorAll('input[type="text"], input[type="password"]').forEach(input => {
            input.value = '';
        });

        
        const submitButton = newAddressForm.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.value = 'Salvar Este Endereço';
        }

        
        additionalAddressesDiv.appendChild(newAddressContainer);
    }

    
    if (additionalAddressesDiv.children.length === 0) {
        addAddressForm(); 
    }
});

